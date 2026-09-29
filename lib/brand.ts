export const brandManifest = {
  brand: 'ORVIA',
  legalEntity: 'ORVIA Oversight Ltd',
  product: 'ORVIA Brand Control',
  version: '1.1.0',
  status: 'controlled',
  canonicalManifestUrl: 'https://brand.orvia.org.uk/api/manifest',
  proposition: 'One brand. One source. Every surface.',
  identity: {
    companyNumber: '16123685',
    icoRegistration: 'ZC152311',
    phone: '0330 043 3703',
    email: 'hello@orvia.org.uk',
    method: ['Observe','Review','Verify','Interpret','Act']
  },
  colours: {
    navy: '#0B2D5C',
    teal: '#2F7F86',
    gold: '#F0A51A',
    purple: '#6A2E7C',
    orange: '#E34B23',
    warm: '#FAF7F2'
  },
  rules: [
    'IRIS remains the sole conductor.',
    'brand.orvia.org.uk is the canonical public Brand & Web System.',
    'Use only approved brand and corporate data.',
    'Do not fabricate analytics, claims, testimonials, awards or connection states.',
    'Material public release requires the applicable human approval.',
    'Voice, websites, social, media and prompts inherit the same current brand context.',
    'No automated safeguarding, clinical or culpability decisions.',
    'VERA verifies implementation after approved release.'
  ],
  deployment: {
    sourceOfTruth: 'GitHub',
    deploymentTruth: 'Vercel',
    conductor: 'IRIS',
    verification: 'VERA',
    memory: 'SharePoint'
  }
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
