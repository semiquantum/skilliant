import { createClient, type SupabaseClient } from 'npm:@supabase/supabase-js@2';

export function corsHeaders(req?: Request) {
  const origin = req?.headers.get('origin') || '*';
  const allowed = Deno.env.get('ALLOWED_ORIGINS');
  const ok = !allowed || allowed.split(',').map(x => x.trim()).filter(Boolean).includes(origin);
  return {
    'Access-Control-Allow-Origin': ok ? origin : 'null',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
    'Vary': 'Origin',
  };
}

export function json(req: Request, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders(req) });
}

export function options(req: Request) { return new Response('ok', { headers: corsHeaders(req) }); }

export function adminClient(): SupabaseClient {
  const url = Deno.env.get('SUPABASE_URL');
  const rawKeys = Deno.env.get('SUPABASE_SECRET_KEYS');
  let key: string | undefined;
  try {
    const secretKeys = rawKeys ? JSON.parse(rawKeys) : null;
    key = secretKeys?.default;
  } catch {
    key = undefined;
  }
  // Legacy fallback only; current Supabase projects should use SUPABASE_SECRET_KEYS.
  if (!key) key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || undefined;
  if (!url || !key) throw new Error('Server Supabase secret key is not configured.');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function caller(req: Request) {
  const token = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '').trim();
  if (!token) return { client: adminClient(), user: null, admin: null, error: 'Authentication required.' };
  const client = adminClient();
  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user) return { client, user: null, admin: null, error: 'Invalid or expired session.' };
  const { data: admin, error: adminError } = await client
    .from('admin_users')
    .select('id,email,full_name,role,status,email_verified')
    .eq('id', data.user.id)
    .maybeSingle();
  if (adminError) return { client, user: data.user, admin: null, error: 'Unable to verify administrator authorization.' };
  if (!admin || admin.status !== 'Active') return { client, user: data.user, admin: null, error: 'Administrator access is not active.' };
  return { client, user: data.user, admin, error: null };
}

export function requireSuperAdmin(result: Awaited<ReturnType<typeof caller>>) {
  if (result.error) return result.error;
  if (result.admin?.role !== 'Super Admin') return 'Only a Super Admin can perform this action.';
  return null;
}

export async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function otpHash(otp: string) {
  const secret = Deno.env.get('OTP_HASH_SECRET');
  if (!secret) throw new Error('OTP_HASH_SECRET is not configured.');
  return sha256(`${secret}:${otp}`);
}

export function randomOtp() {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return String(100000 + (array[0] % 900000));
}

export function randomToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

export function randomPassword() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => String.fromCharCode(33 + (b % 90))).join('') + 'aA1!';
}

export function safeName(value: string) {
  return String(value || 'Administrator').replace(/[<>]/g, '').slice(0, 120);
}

export async function sendOtpEmail({ to, name, otp, subject, purpose }: { to: string; name: string; otp: string; subject: string; purpose: string }) {
  const serviceId = Deno.env.get('EMAILJS_SERVICE_ID');
  const templateId = Deno.env.get('EMAILJS_TEMPLATE_ID');
  const publicKey = Deno.env.get('EMAILJS_PUBLIC_KEY');
  if (!serviceId || !templateId || !publicKey) {
    return { ok: false, error: 'Email delivery is not configured. Set EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID and EMAILJS_PUBLIC_KEY in Supabase Edge Function secrets.' };
  }

  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        email: to,
        name: safeName(name),
        passcode: otp,
        validity: '10',
        purpose
      }
    })
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    console.error('EmailJS delivery error:', text);
    return { ok: false, error: 'The verification email could not be delivered.' };
  }
  return { ok: true };
}

export async function issueOtp(client: SupabaseClient, admin: { id: string; email: string; full_name: string }, purpose: 'PASSWORD_RESET'|'EMAIL_VERIFICATION'|'LOGIN') {
  const since = new Date(Date.now() - 60_000).toISOString();
  const { data: recent } = await client.from('admin_otp_codes').select('id').eq('email', admin.email.toLowerCase()).eq('purpose', purpose).gte('created_at', since).limit(1);
  if (recent?.length) return { ok: false, error: 'Please wait before requesting another code.' };
  // Invalidate any previous active code for this purpose before issuing a new one.
  await client.from('admin_otp_codes')
    .update({ used_at: new Date().toISOString() })
    .eq('admin_id', admin.id).eq('purpose', purpose).is('used_at', null);

  const otp = randomOtp();
  const hash = await otpHash(otp);
  const { data: inserted, error: insertError } = await client.from('admin_otp_codes').insert({
    admin_id: admin.id, email: admin.email.toLowerCase(), otp_hash: hash, purpose,
    expires_at: new Date(Date.now() + 10 * 60_000).toISOString(), attempts: 0, max_attempts: 5,
  }).select('id').single();
  if (insertError || !inserted) return { ok: false, error: 'Unable to create a verification code.' };
  const sent = await sendOtpEmail({
    to: admin.email, name: admin.full_name, otp,
    subject: purpose === 'PASSWORD_RESET' ? 'Skilliant password reset code' : 'Skilliant email verification code',
    purpose: purpose === 'PASSWORD_RESET' ? 'password reset' : 'email verification',
  });
  if (!sent.ok) {
    await client.from('admin_otp_codes').update({ used_at: new Date().toISOString() }).eq('id', inserted.id);
    return { ok: false, error: sent.error || 'Unable to send the verification email.' };
  }
  return { ok: true };
}
