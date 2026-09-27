import { adminClient, issueOtp, json, options } from '../_shared.ts';
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return options(req);
  if (req.method !== 'POST') return json(req, { ok:false, message:'Method not allowed.' }, 405);
  try {
    const { email } = await req.json();
    const normalized = String(email || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) return json(req, { ok:false, message:'Enter a valid email address.' }, 400);
    const client = adminClient();
    const { data: admin } = await client.from('admin_users').select('id,email,full_name,status,email_verified').eq('email', normalized).maybeSingle();
    if (!admin || admin.status !== 'Active') return json(req, { ok:true, message:'If the account is eligible, a verification code has been sent.' });
    const result = await issueOtp(client, admin, 'EMAIL_VERIFICATION');
    if (!result.ok) return json(req, { ok:false, message: result.error }, 429);
    return json(req, { ok:true, message:'If the account is eligible, a verification code has been sent.' });
  } catch (e) { console.error(e); return json(req, { ok:false, message:'Unable to process the request.' }, 500); }
});
