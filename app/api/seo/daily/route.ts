import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";
import { seoAgent, seoIndustryThemes } from "@/config/seo-agent";

function authorised(req:NextRequest){
  const expected=process.env.CRON_SECRET || process.env.SEO_AGENT_SECRET;
  if(!expected) return true;
  const bearer=req.headers.get("authorization")?.replace(/^Bearer\s+/i,"") || "";
  const supplied=req.headers.get("x-orvia-seo-key") || "";
  return bearer===expected || supplied===expected;
}

export async function GET(req:NextRequest){
  if(!authorised(req)) return NextResponse.json({status:"DENIED"},{status:401});
  const supabase=getServerSupabase();
  if(!supabase) return NextResponse.json({status:"NOT_CONNECTED",reason:"Supabase is not configured"},{status:503});

  const sites=await supabase
    .from("brand_site_registry")
    .select("site_key,display_name,canonical_domain,lifecycle_state,compliance_status,last_verified_at")
    .in("lifecycle_state",["active","preview"]);

  const inventory=sites.data || [];
  const instruction=[
    "Run the governed ORVIA daily SEO and AI-discovery review.",
    `Agent: ${seoAgent.code} — ${seoAgent.name}.`,
    "IRIS remains conductor. Use verified search/analytics evidence only; if Search Console is unavailable, record the gap and continue with technical/on-page checks only.",
    `Review these registered sites: ${inventory.map(s=>`${s.display_name} (${s.canonical_domain||s.site_key})`).join(", ") || "No registered sites returned"}.`,
    `Priority industry themes: ${seoIndustryThemes.join("; ")}.`,
    "Identify technical defects, indexing/canonical issues, query/page opportunities, high-impression low-CTR pages, internal-link gaps, content gaps, commercial-intent gaps, structured-data gaps and AI-search/entity clarity issues.",
    "Do not auto-publish protected changes. Queue recommendations with evidence, page/query target, expected user intent, owner, priority and verification method.",
    "Escalate any unsupported claims, fake/placeholder testimonials, broken commercial routes or legal/compliance conflicts.",
    "Output a daily SEO health summary, top 10 actions, blockers, declining pages/queries where data exists, and new content opportunities."
  ].join(" ");

  const insert=await supabase.from("admin_work_queue").insert({
    work_type:"seo_daily_review",
    title:"Daily ORVIA SEO & AI-discovery review",
    detail:instruction,
    status:"open",
    priority:"high",
    assigned_to:"SEO-01",
    approval_required:true,
    source_system:"IRIS",
    source_reference:"brand-control:seo-daily"
  }).select("id,status,priority,assigned_to,created_at").single();

  if(insert.error || !insert.data){
    return NextResponse.json({status:"INCOMPLETE",reason:insert.error?.message||"Could not queue SEO review"},{status:500});
  }

  return NextResponse.json({
    status:"QUEUED",
    agent:seoAgent.code,
    registeredSites:inventory.length,
    work:insert.data,
    note:"This queues the governed review. Search performance analysis requires a verified Search Console/analytics connection."
  });
}
