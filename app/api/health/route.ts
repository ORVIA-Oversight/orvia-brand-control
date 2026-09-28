import { NextResponse } from 'next/server';

export async function GET(){
  return NextResponse.json({
    service:'ORVIA Brand Control',
    status:'ok',
    environment:process.env.VERCEL_ENV||'local',
    supabaseConfigured:Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
    irisSecretConfigured:Boolean(process.env.IRIS_INTAKE_SECRET)
  });
}
