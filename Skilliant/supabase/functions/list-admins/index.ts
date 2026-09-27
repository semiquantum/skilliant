import { adminClient, caller, json, options, requireSuperAdmin } from '../_shared.ts';
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return options(req);
  if (req.method !== 'POST') return json(req,{ok:false,message:'Method not allowed.'},405);
  try {
    const auth = await caller(req); const denied=requireSuperAdmin(auth); if(denied) return json(req,{ok:false,message:denied},403);
    const client=adminClient();
    const {data,error}=await client.from('admin_users').select('id,email,full_name,role,status,profile_photo,email_verified,created_at,updated_at').order('created_at',{ascending:false});
    if(error) return json(req,{ok:false,message:'Unable to load administrators.'},500);
    const ids=new Set((data||[]).map(a=>a.id));
    const {data:users}=await client.auth.admin.listUsers({page:1,perPage:1000});
    const lastLogin=new Map((users?.users||[]).map(u=>[u.id,u.last_sign_in_at||null]));
    return json(req,{ok:true,admins:(data||[]).map(a=>({...a,lastLogin:lastLogin.get(a.id)||null}))});
  } catch(e){console.error(e);return json(req,{ok:false,message:'Unable to load administrators.'},500);}
});
