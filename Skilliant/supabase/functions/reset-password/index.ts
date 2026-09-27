import { adminClient, json, options, otpHash } from '../_shared.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return options(req);
  if (req.method !== 'POST') return json(req, { ok:false, message:'Method not allowed.' }, 405);
  try {
    const { email, resetToken, newPassword } = await req.json();
    const normalized = String(email || '').trim().toLowerCase();
    const token = String(resetToken || '').trim();
    const password = String(newPassword || '');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) || token.length < 32) {
      return json(req, { ok:false, message:'Invalid password reset request.' }, 400);
    }
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) return json(req, { ok:false, message:'Password must be at least 8 characters and include uppercase, lowercase, and a number.' }, 400);

    const client = adminClient();
    const { data: admin } = await client.from('admin_users')
      .select('id,email,status')
      .eq('email', normalized)
      .maybeSingle();
    if (!admin || admin.status !== 'Active') return json(req, { ok:false, message:'Unable to reset the password.' }, 400);

    const tokenHash = await otpHash(token);
    const { data: rows } = await client.from('admin_otp_codes')
      .select('id,reset_token_expires_at,verified_at,used_at')
      .eq('admin_id', admin.id)
      .eq('purpose','PASSWORD_RESET')
      .eq('reset_token_hash', tokenHash)
      .is('used_at',null)
      .order('created_at',{ascending:false})
      .limit(1);
    const row = rows?.[0];
    if (!row || !row.verified_at || !row.reset_token_expires_at || new Date(row.reset_token_expires_at).getTime() <= Date.now()) {
      return json(req, { ok:false, message:'Password reset authorization has expired. Request a new OTP.' }, 400);
    }

    // Consume the reset authorization before changing the password so the same
    // reset token cannot be used concurrently in two requests. If the Auth
    // update fails, restore the OTP row so the administrator can retry.
    const consumedAt = new Date().toISOString();
    const { data: consumedRows, error: consumeError } = await client.from('admin_otp_codes')
      .update({ used_at: consumedAt })
      .eq('id', row.id)
      .is('used_at', null)
      .select('id');
    if (consumeError || !consumedRows?.length) {
      return json(req, { ok:false, message:'Password reset authorization has already been used. Request a new OTP.' }, 400);
    }

    const { error: authError } = await client.auth.admin.updateUserById(admin.id, { password });
    if (authError) {
      await client.from('admin_otp_codes').update({ used_at:null }).eq('id', row.id).eq('used_at', consumedAt);
      return json(req, { ok:false, message:'Unable to update the password.' }, 500);
    }

    await client.from('admin_users').update({ email_verified:true }).eq('id', admin.id);
    return json(req, { ok:true, message:'Password updated successfully. You can now sign in.' });
  } catch (e) {
    console.error(e);
    return json(req, { ok:false, message:'Unable to reset the password.' }, 500);
  }
});
