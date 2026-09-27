import { adminClient, caller, json, options, requireSuperAdmin } from '../_shared.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return options(req);
  if (req.method !== 'POST') return json(req, { ok:false, message:'Method not allowed.' }, 405);

  try {
    const auth = await caller(req);
    const denied = requireSuperAdmin(auth);
    if (denied) return json(req, { ok:false, message:denied }, 403);

    const body = await req.json();
    const id = String(body.id || '').trim();
    if (!id) return json(req, { ok:false, message:'Administrator ID is required.' }, 400);

    const client = adminClient();
    const { data: target, error: targetError } = await client
      .from('admin_users')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (targetError || !target) return json(req, { ok:false, message:'Administrator not found.' }, 404);

    const allowedRoles = ['Admin', 'Financial Admin', 'Super Admin'];
    const allowedStatus = ['Active', 'Inactive', 'Suspended'];
    const requestedRole = body.role !== undefined ? String(body.role) : target.role;
    const requestedStatus = body.status !== undefined ? String(body.status) : target.status;
    if (!allowedRoles.includes(requestedRole) || !allowedStatus.includes(requestedStatus)) {
      return json(req, { ok:false, message:'Invalid role or status.' }, 400);
    }

    if (id === auth.user!.id && (requestedStatus !== 'Active' || requestedRole !== 'Super Admin')) {
      return json(req, { ok:false, message:'You cannot disable or demote your own active Super Admin account.' }, 400);
    }

    // Never allow an update to remove the last active Super Admin.
    const targetIsActiveSuperAdmin = target.role === 'Super Admin' && target.status === 'Active';
    const targetWillRemainActiveSuperAdmin = requestedRole === 'Super Admin' && requestedStatus === 'Active';
    if (targetIsActiveSuperAdmin && !targetWillRemainActiveSuperAdmin) {
      const { count } = await client
        .from('admin_users')
        .select('id', { count:'exact', head:true })
        .eq('role', 'Super Admin')
        .eq('status', 'Active');
      if ((count || 0) <= 1) {
        return json(req, { ok:false, message:'At least one active Super Admin must remain.' }, 400);
      }
    }

    const name = body.full_name !== undefined ? String(body.full_name).trim().slice(0, 120) : target.full_name;
    if (!name) return json(req, { ok:false, message:'Full name is required.' }, 400);

    let normalizedEmail = target.email;
    const emailChanged = body.email !== undefined;
    if (emailChanged) {
      normalizedEmail = String(body.email).trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
        return json(req, { ok:false, message:'Invalid email address.' }, 400);
      }
      const { data: duplicate } = await client
        .from('admin_users')
        .select('id')
        .eq('email', normalizedEmail)
        .neq('id', id)
        .maybeSingle();
      if (duplicate) return json(req, { ok:false, message:'That email is already used by another administrator.' }, 409);
    }

    const patch:any = {
      full_name: name,
      role: requestedRole,
      status: requestedStatus,
      updated_at: new Date().toISOString()
    };
    if (emailChanged && normalizedEmail !== target.email) {
      patch.email = normalizedEmail;
      patch.email_verified = false;
    }

    // Keep Auth and authorization records synchronized. If the Auth update fails,
    // do not change the authorization row. If the DB update fails after Auth,
    // attempt to restore the previous Auth profile.
    const { data: targetAuth } = await client.auth.admin.getUserById(id);
    const authPatch:any = {};
    if (name !== target.full_name) authPatch.user_metadata = { ...(targetAuth?.user?.user_metadata || {}), full_name: name };
    if (emailChanged && normalizedEmail !== target.email) {
      authPatch.email = normalizedEmail;
      authPatch.email_confirm = false;
    }

    if (Object.keys(authPatch).length) {
      const { error: authError } = await client.auth.admin.updateUserById(id, authPatch);
      if (authError) return json(req, { ok:false, message:'Unable to update the administrator authentication profile.' }, 500);
    }

    const { error: dbError } = await client.from('admin_users').update(patch).eq('id', id);
    if (dbError) {
      if (Object.keys(authPatch).length) {
        const rollback:any = {};
        if (authPatch.user_metadata) rollback.user_metadata = { ...(targetAuth?.user?.user_metadata || {}), full_name: target.full_name };
        if (authPatch.email) { rollback.email = target.email; rollback.email_confirm = !!target.email_verified; }
        if (Object.keys(rollback).length) await client.auth.admin.updateUserById(id, rollback).catch(() => {});
      }
      return json(req, { ok:false, message:'Unable to update administrator.' }, 500);
    }

    return json(req, { ok:true, message:'Administrator updated successfully.' });
  } catch (e) {
    console.error(e);
    return json(req, { ok:false, message:'Unable to update administrator.' }, 500);
  }
});
