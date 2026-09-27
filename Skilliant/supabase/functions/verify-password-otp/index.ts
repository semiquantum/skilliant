import { adminClient, json, options, otpHash, randomToken } from '../_shared.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return options(req);
  if (req.method !== 'POST') return json(req, { ok:false, message:'Method not allowed.' }, 405);
  try {
    const { email, otp } = await req.json();
    const normalized = String(email || '').trim().toLowerCase();
    const code = String(otp || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) || !/^\d{6}$/.test(code)) {
      return json(req, { ok:false, message:'Invalid verification request.' }, 400);
    }

    const client = adminClient();
    const { data: admin } = await client.from('admin_users')
      .select('id,email,status')
      .eq('email', normalized)
      .maybeSingle();

    if (!admin || admin.status !== 'Active') {
      return json(req, { ok:false, message:'Invalid or expired verification code.' }, 400);
    }

    const { data: rows } = await client.from('admin_otp_codes')
      .select('id,otp_hash,expires_at,attempts,max_attempts,used_at')
      .eq('admin_id', admin.id)
      .eq('purpose','PASSWORD_RESET')
      .is('used_at',null)
      .order('created_at',{ascending:false})
      .limit(1);

    const row = rows?.[0];
    if (!row || new Date(row.expires_at).getTime() <= Date.now() || row.attempts >= row.max_attempts) {
      return json(req, { ok:false, message:'Invalid or expired verification code.' }, 400);
    }

    const hash = await otpHash(code);
    if (hash !== row.otp_hash) {
      const attempts = row.attempts + 1;
      await client.from('admin_otp_codes').update({ attempts }).eq('id', row.id);
      return json(req, { ok:false, message: attempts >= row.max_attempts ? 'Too many attempts. Request a new code.' : 'Invalid verification code.' }, 400);
    }

    const resetToken = randomToken();
    const resetTokenHash = await otpHash(resetToken);
    await client.from('admin_otp_codes').update({
      verified_at: new Date().toISOString(),
      reset_token_hash: resetTokenHash,
      reset_token_expires_at: new Date(Date.now() + 10 * 60_000).toISOString(),
      attempts: row.attempts
    }).eq('id', row.id);

    return json(req, { ok:true, message:'OTP verified. You can now create a new password.', resetToken });
  } catch (e) {
    console.error(e);
    return json(req, { ok:false, message:'Unable to verify the code.' }, 500);
  }
});
