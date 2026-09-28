import { BrandControl } from '@/components/BrandControl';
import { getServerSupabase } from '@/lib/supabase-server';

export const dynamic='force-dynamic';
export const revalidate=0;

async function loadData(){
  const supabase=getServerSupabase();
  if(!supabase) return { connected:false, work:[], assets:[], integrations:[] };

  const [work,assets,integrations] = await Promise.all([
    supabase.from('admin_work_queue').select('id,work_type,title,detail,status,priority,approval_required,source_system,source_reference,created_at').eq('assigned_to','BRAND-01').order('created_at',{ascending:false}).limit(100),
    supabase.from('orvia_asset_registry').select('asset_key,display_name,asset_type,canonical_domain,canonical_url,estate_disposition,verification_status,updated_at').order('display_name',{ascending:true}),
    supabase.from('admin_integrations').select('code,name,category,connection_mode,status,launch_url,owner,contains_material_data,metadata,updated_at').order('name',{ascending:true})
  ]);

  return { connected:true, work:work.data??[], assets:assets.data??[], integrations:integrations.data??[] };
}

export default async function Page(){
  const data=await loadData();
  return <BrandControl initialData={data}/>;
}
