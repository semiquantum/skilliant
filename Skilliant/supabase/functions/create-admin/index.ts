import { adminClient, caller, issueOtp, json, options, randomPassword, requireSuperAdmin } from '../_shared.ts';
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return options(req);
  if (req.method !== 'POST') return json(req,{ok:false,message:'Method not allowed.'},405);
  try {
    const auth = await caller(req);
    const denied = requireSuperAdmin(auth);
    if (denied) return json(req,{ok:false,message:denied},403);
    const { full_name, email, role } = await req.json();
    const name = String(full_name||'').trim().slice(0,120);
    const normalized = String(email||'').trim().toLowerCase();
    const allowedRoles = ['Admin','Financial Admin','Super Admin'];
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) || !allowedRoles.includes(role)) return json(req,{ok:false,message:'Invalid administrator details.'},400);
    const client = adminClient();
    const { data: existing } = await client.from('admin_users').select('id').eq('email',normalized).maybeSingle();
    if (existing) return json(req,{ok:false,message:'An administrator with this email already exists.'},409);
    const { data: created, error: createError } = await client.auth.admin.createUser({ email:normalized, password:randomPassword(), email_confirm:false, user_metadata:{full_name:name} });
    if (createError || !created.user) return json(req,{ok:false,message:createError?.message || 'Unable to create the authentication account.'},400);
    const { error: insertError } = await client.from('admin_users').insert({id:created.user.id,email:normalized,full_name:name,role,status:'Active',email_verified:false,created_by:auth.user!.id});
    if (insertError) { await client.auth.admin.deleteUser(created.user.id); return json(req,{ok:false,message:'Unable to create the administrator authorization record.'},500); }
    const admin = {id:created.user.id,email:normalized,full_name:name,status:'Active',email_verified:false};
    const otp = await issueOtp(client,admin,'EMAIL_VERIFICATION');
    if (!otp.ok) {
      // Do not leave an active administrator account that can never complete onboarding.
      await client.auth.admin.deleteUser(created.user.id).catch(() => {});
      return json(req,{ok:false,message:otp.error || 'Administrator was not created because the verification email could not be sent.'},503);
    }
    return json(req,{ok:true,message:'Administrator created. A verification code was sent to the email address.'});
  } catch(e) { console.error(e); return json(req,{ok:false,message:'Unable to create administrator.'},500); }
});
