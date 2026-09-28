export const brandManifest = {
  brand: 'ORVIA Oversight',
  product: 'ORVIA Brand Control',
  version: '0.1.0',
  status: 'internal-draft',
  proposition: 'One brand. One source. Every surface.',
  colours: {
    navy: '#0B2450',
    teal: '#2B929D',
    gold: '#EAAA00',
    purple: '#82418F',
    orange: '#E74612',
    warm: '#FAF7F2'
  },
  rules: [
    'IRIS remains the sole conductor.',
    'Use only approved brand and corporate data.',
    'Do not fabricate analytics, claims, testimonials, awards or connection states.',
    'Material public release requires the applicable human approval.',
    'Voice, websites, social, media and prompts inherit the same current brand context.',
    'VERA verifies implementation after approved release.'
  ]
} as const;

export const integrationCatalogue = [
  { code:'IRIS', name:'IRIS', area:'Orchestration', mode:'API', env:null },
  { code:'SUPABASE', name:'Supabase', area:'Data', mode:'API', env:'SUPABASE_URL' },
  { code:'METRICOOL', name:'Metricool', area:'Social', mode:'Connector', env:'METRICOOL_ENABLED' },
  { code:'HEYGEN', name:'HeyGen', area:'Media', mode:'API', env:'HEYGEN_API_KEY' },
  { code:'SYNTHESIA', name:'Synthesia', area:'Media', mode:'API', env:'SYNTHESIA_API_KEY' },
  { code:'VAPI', name:'Vapi / ARIA', area:'Voice', mode:'API', env:'VAPI_API_KEY' },
  { code:'CANVA', name:'Canva', area:'Media', mode:'Connector', env:'CANVA_ENABLED' },
  { code:'PROMPTEDITOR', name:'PromptEditor', area:'Prompts', mode:'Native link', env:'PROMPTEDITOR_URL' },
  { code:'SINTRA', name:'Sintra', area:'Social', mode:'Native link', env:'SINTRA_URL' },
  { code:'HOLO', name:'Holo', area:'Marketing', mode:'Native link', env:'HOLO_URL' }
] as const;
