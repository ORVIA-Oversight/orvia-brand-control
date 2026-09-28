import { NextResponse } from 'next/server';
import { brandManifest } from '@/lib/brand';

export async function GET(){
  return NextResponse.json(brandManifest,{headers:{'cache-control':'no-store'}});
}
