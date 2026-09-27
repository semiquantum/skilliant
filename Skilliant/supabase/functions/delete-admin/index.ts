import { adminClient, caller, json, options, requireSuperAdmin } from '../_shared.ts';
Deno.serve(async (req) => {
  if(req.method==='OPTIONS')return options(req); if(req.method!=='POST')return json(req,{ok:false,message:'Method not allowed.'},405);
  try{
    const auth=await caller(req); const denied=requireSuperAdmin(auth); if(denied)return json(req,{ok:false,message:denied},403);
    const {id}=await req.json(); if(!id)return json(req,{ok:false,message:'Administrator ID is required.'},400); if(id===auth.user!.id)return json(req,{ok:false,message:'You cannot delete your own active administrator account.'},400);
    const client=adminClient(); const {data:target}=await client.from('admin_users').select('id,role,full_name').eq('id',id).maybeSingle(); if(!target)return json(req,{ok:false,message:'Administrator not found.'},404);
    if(target.role==='Super Admin'){const {count}=await client.from('admin_users').select('id',{count:'exact',head:true}).eq('role','Super Admin').eq('status','Active'); if((count||0)<=1)return json(req,{ok:false,message:'At least one active Super Admin must remain.'},400);}
    const {error}=await client.auth.admin.deleteUser(id); if(error)return json(req,{ok:false,message:'Unable to delete administrator authentication account.'},500);
    return json(req,{ok:true,message:'Administrator deleted successfully.'});
  }catch(e){console.error(e);return json(req,{ok:false,message:'Unable to delete administrator.'},500)}
});
