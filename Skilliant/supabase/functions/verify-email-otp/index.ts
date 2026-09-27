import { adminClient, json, options, otpHash } from '../_shared.ts';
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return options(req);
  if (req.method !== 'POST') return json(req, { ok:false, message:'Method not allowed.' }, 405);
  try {
    const { email, otp } = await req.json();
    const normalized = String(email || '').trim().toLowerCase();
    const code = String(otp || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) || !/^\d{6}$/.test(code)) return json(req, { ok:false, message:'Invalid verification request.' }, 400);
    const client = adminClient();
    const { data: admin } = await client.from('admin_users').select('id,email,full_name,status').eq('email', normalized).maybeSingle();
    if (!admin || admin.status !== 'Active') return json(req, { ok:false, message:'Invalid or expired verification code.' }, 400);
    const { data: rows } = await client.from('admin_otp_codes').select('*').eq('admin_id',admin.id).eq('purpose','EMAIL_VERIFICATION').is('used_at',null).order('created_at',{ascending:false}).limit(1);
    const row = rows?.[0];
    if (!row || new Date(row.expires_at).getTime() < Date.now() || row.attempts >= row.max_attempts) return json(req, { ok:false, message:'Invalid or expired verification code.' }, 400);
    const hash = await otpHash(code);
    if (hash !== row.otp_hash) { await client.from('admin_otp_codes').update({attempts:row.attempts+1}).eq('id',row.id); return json(req,{ok:false,message:'Invalid verification code.'},400); }
    const { error } = await client.auth.admin.updateUserById(admin.id, { email_confirm:true });
    if (error) return json(req,{ok:false,message:'Unable to verify the email.'},500);
    await client.from('admin_users').update({email_verified:true}).eq('id',admin.id);
    await client.from('admin_otp_codes').update({used_at:new Date().toISOString()}).eq('id',row.id);
    return json(req,{ok:true,message:'Email verified successfully.'});
  } catch(e) { console.error(e); return json(req,{ok:false,message:'Unable to verify the code.'},500); }
});
