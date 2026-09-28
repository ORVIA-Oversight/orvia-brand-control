import { NextRequest, NextResponse } from 'next/server';

const banned=[
  /guarantee(?:d|s)? compliance/i,
  /cqc approved/i,
  /fully autonomous safeguarding/i,
  /replaces human judgement/i
];

export async function POST(req:NextRequest){
  const body=await req.json().catch(()=>null);
  const text=String(body?.text??'').trim();
  if(!text) return NextResponse.json({status:'INCOMPLETE',reason:'text is required'},{status:400});
  const failures=banned.filter(r=>r.test(text)).map(r=>r.source);
  return NextResponse.json({
    status:failures.length?'FAIL':'PASS',
    failures,
    warnings:[],
    humanReviewRequired:failures.length>0,
    checkedAt:new Date().toISOString()
  });
}
