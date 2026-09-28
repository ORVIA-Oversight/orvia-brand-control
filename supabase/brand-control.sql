-- ORVIA Brand Control bootstrap for the existing ORVIA Supabase project.
-- Review before execution in production.

insert into public.admin_agents
(code, display_name, agent_type, purpose, operating_scope, human_owner_role, risk_ceiling, can_draft, can_read, can_write_low_risk, requires_human_approval_above, active, instructions, metadata)
values
(
  'BRAND-01',
  'ORVIA Brand Control',
  'specialist',
  'Apply the current approved ORVIA brand, content, social, media, website and Voice rules to work routed by IRIS, preventing brand dilution across public surfaces.',
  'Internal ORVIA brand operating layer covering master brand, product brands, websites, shared headers/footers, logos, icons, favicons, Open Graph assets, social content, campaigns, Voice/ARIA scripts, media generation, prompts and public-facing collateral.',
  'Founder and Group CEO',
  'medium',
  true,
  true,
  true,
  'medium',
  true,
  jsonb_build_object('rules', jsonb_build_array(
    'IRIS remains the sole conductor',
    'Use only current approved ORVIA brand and corporate data',
    'Preserve source, version and approval provenance',
    'Do not fabricate analytics, testimonials, awards, claims or outcomes',
    'Material publication and canonical brand change require human approval',
    'Voice, websites, social, media and prompts inherit the same Brand Control context',
    'VERA verifies implementation after approved release'
  )),
  jsonb_build_object('role','brand_control','canonical',true,'internal_only',true,'accepts_signal_context',true)
)
on conflict (code) do update set
  display_name=excluded.display_name,
  purpose=excluded.purpose,
  operating_scope=excluded.operating_scope,
  instructions=excluded.instructions,
  metadata=excluded.metadata,
  active=true,
  updated_at=now();

-- Insert the routing rule only if an equivalent rule does not already exist.
insert into public.admin_routing_rules
(intent_code, description, priority, primary_tool_code, fallback_tool_code, specialist_agent_code, approval_policy, active, match_terms, metadata)
select
  'BRAND_CONTROL',
  'Brand, social, website identity, media, Voice presentation, prompts and public-content control',
  190,
  'BRAND_CONTROL',
  'OPENAI_API',
  'BRAND-01',
  'risk_based',
  true,
  array['brand','branding','logo','favicon','icon','header','footer','social','facebook','instagram','linkedin','youtube','tiktok','campaign','content','post','media','video','heygen','synthesia','prompteditor','aria','voice','vapi','open graph','og image','case study','armed forces','covenant'],
  jsonb_build_object('canonical',true,'internal_only',true,'iris_conducted',true,'accepts_signal_context',true)
where not exists (
  select 1 from public.admin_routing_rules where intent_code='BRAND_CONTROL'
);
