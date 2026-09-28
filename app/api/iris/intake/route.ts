import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase-server';

function clean(v:unknown){return String(v??'').replace(/[\r\n]+/g,' ').replace(/\s+/g,' ').trim();}

export async function POST(req:NextRequest){
  const expected=process.env.IRIS_INTAKE_SECRET;
  if(expected){
    const supplied=req.headers.get('x-orvia-iris-key')||'';
    if(supplied!==expected) return NextResponse.json({status:'DENIED'},{status:401});
  }
  const body=await req.json().catch(()=>null);
  const instruction=clean(body?.instruction);
  if(!instruction) return NextResponse.json({status:'INCOMPLETE',reason:'instruction is required'},{status:400});
  const supabase=getServerSupabase();
  if(!supabase) return NextResponse.json({status:'NOT_CONNECTED',reason:'Supabase is not configured'},{status:503});

  const buzz=body?.buzz||body?.signal||null;
  const detail=clean(`${instruction}${buzz?` | Signal: ${JSON.stringify(buzz)}`:''}`);
  const approvalRequired=body?.approval_required!==false;
  const insert=await supabase.from('admin_work_queue').insert({
    work_type:'brand_control_instruction',
    title:instruction.slice(0,180),
    detail,
    status:'open',
    priority:clean(body?.priority)||'normal',
    assigned_to:'BRAND-01',
    approval_required:approvalRequired,
    source_system:'IRIS',
    source_reference:clean(body?.source_reference)||'brand-control-api'
  }).select('id,status,priority,approval_required').single();

  if(insert.error||!insert.data) return NextResponse.json({status:'INCOMPLETE',reason:insert.error?.message||'insert failed'},{status:500});
  return NextResponse.json({status:'ACCEPTED',work:insert.data});
}
