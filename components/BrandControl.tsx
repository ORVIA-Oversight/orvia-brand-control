'use client';

import { useMemo, useState } from 'react';
import {
  Activity, BarChart3, CheckCircle2, CircleAlert, FileImage, Globe2,
  Megaphone, Mic2, Palette, Plus, Share2, Sparkles, Video, WandSparkles,
  Network, Settings2, ShieldCheck, ArrowUpRight, Layers3, Radio, Zap, Orbit,
  LayoutTemplate, Boxes, Rocket, Search, Link2, ScanSearch, History, ExternalLink,
  MonitorCheck, ShieldAlert, FileCode2
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type WorkItem={id:string;work_type:string;title:string;detail?:string|null;status:string;priority:string;approval_required:boolean;source_system?:string|null;source_reference?:string|null;created_at:string};
type Asset={asset_key:string;display_name:string;asset_type?:string|null;canonical_domain?:string|null;canonical_url?:string|null;estate_disposition?:string|null;verification_status?:string|null};
type Integration={code:string;name:string;category?:string|null;connection_mode?:string|null;status?:string|null};
type WebProject={project_code:string;domain?:string|null;preview_url?:string|null;live_url?:string|null;github_repo?:string|null;deployment_project?:string|null;state?:string|null;completion_percent?:number|string|null;rag_status?:string|null;critical_blocker_count?:number|null;last_assessed_at?:string|null};
type InitialData={connected:boolean;work:WorkItem[];assets:Asset[];integrations:Integration[];webProjects:WebProject[]};

type View='Overview'|'Brand DNA'|'Socials'|'Media'|'Voice'|'Websites'|'Assets'|'Campaigns'|'Integrations'|'Settings';

const views:[View,LucideIcon][]=[
  ['Overview',Activity],['Brand DNA',Palette],['Socials',Share2],['Media',Video],['Voice',Mic2],['Websites',Globe2],['Assets',FileImage],['Campaigns',Megaphone],['Integrations',Network],['Settings',Settings2]
];

function norm(v:unknown){return String(v??'').toLowerCase().replaceAll('_',' ')}
function ok(v:unknown){return ['connected','configured','ready','live verified','verified','keep'].includes(norm(v))}

export function BrandControl({initialData}:{initialData:InitialData}){
  const [view,setView]=useState<View>('Overview');
  const [tab,setTab]=useState<'overview'|'create'|'analytics'>('overview');
  const [brief,setBrief]=useState('');
  const [submitState,setSubmitState]=useState('');

  const currentAssets=useMemo(()=>initialData.assets.filter(a=>['keep','rename','temporary','hold'].includes(norm(a.estate_disposition))),[initialData.assets]);
  const reviewAssets=currentAssets.filter(a=>norm(a.estate_disposition)!=='keep'||!ok(a.verification_status));
  const health=currentAssets.length?Math.max(0,Math.round(((currentAssets.length-reviewAssets.length)/currentAssets.length)*100)):0;
  const todo=initialData.work.filter(w=>['open','review required'].includes(norm(w.status)));
  const progress=initialData.work.filter(w=>norm(w.status)==='in progress');
  const done=initialData.work.filter(w=>['done','completed','closed'].includes(norm(w.status)));
  const failed=initialData.work.filter(w=>['blocked','failed','error','cancelled'].includes(norm(w.status)));

  const socials=initialData.integrations.filter(x=>/metricool|facebook|instagram|linkedin|youtube|tiktok|threads|social/i.test(`${x.code} ${x.name} ${x.category}`));
  const media=initialData.integrations.filter(x=>/heygen|synthesia|canva|prompt|video|media/i.test(`${x.code} ${x.name} ${x.category}`));
  const voice=initialData.integrations.filter(x=>/vapi|voice|aria|yay|telephony/i.test(`${x.code} ${x.name} ${x.category}`));

  async function submitBrief(){
    const instruction=brief.trim();
    if(!instruction)return;
    setSubmitState('Preparing controlled brief...');
    const r=await fetch('/api/iris/intake',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({instruction,approval_required:true,priority:'normal',source_reference:'brand-control-ui'})});
    const data=await r.json().catch(()=>({}));
    if(r.ok){setSubmitState(`Accepted as work ${data?.work?.id||''}`);setBrief('');}
    else if(r.status===503)setSubmitState('IRIS/Supabase connection not configured yet. Interface is live; data connection is next.');
    else setSubmitState(data?.reason||'Could not create the controlled brief.');
  }

  return <div className="appShell">
    <aside className="sideRail">
      <div className="brandLockup">
        <div className="orbitMark" aria-hidden="true"><i/><i/><i/><span/></div>
        <div><strong>ORVIA</strong><small>OVERSIGHT</small></div>
      </div>
      <nav>{views.map(([name,Icon])=><button key={name} className={view===name?'active':''} onClick={()=>setView(name)}><Icon size={17}/>{name}{view===name&&<span className="activeDot"/>}</button>)}</nav>
      <button className="createButton" onClick={()=>{setView('Overview');setTab('create')}}><WandSparkles size={16}/>Create content</button>
      <div className="railFoot"><span>IRIS conducts</span><b>Brand Control</b><small>One brand. One source. Every surface.</small></div>
    </aside>

    <main className="mainArea">
      <section className="workspace">
        <header className="workspaceHeader">
          <div><small>ORVIA OVERSIGHT · INTERNAL BRAND OPERATIONS</small><h1>{view}</h1></div>
          <div className={`connectionPill ${initialData.connected?'connected':''}`}><span/>{initialData.connected?'Live data connected':'Interface live · data connection pending'}</div>
        </header>

        {view==='Overview'?<>
          <div className="tabs"><button className={tab==='overview'?'active':''} onClick={()=>setTab('overview')}>Overview</button><button className={tab==='create'?'active':''} onClick={()=>setTab('create')}>Create</button><button className={tab==='analytics'?'active':''} onClick={()=>setTab('analytics')}>Analytics</button></div>

          {tab==='overview'&&<>
            <section className="brandPulse">
              <div className="pulseCopy">
                <div className="pulseEyebrow"><span/>LIVE BRAND OPERATING SYSTEM</div>
                <h2>One living brand across every ORVIA surface.</h2>
                <p>IRIS routes the work. Brand Control keeps identity, voice, social, media and web output aligned before anything reaches the outside world.</p>
                <div className="pulseActions">
                  <button className="primaryPulse" onClick={()=>setTab('create')}><Sparkles size={16}/>Create with IRIS</button>
                  <button className="secondaryPulse" onClick={()=>setView('Brand DNA')}>Open Brand DNA<ArrowUpRight size={15}/></button>
                </div>
                <div className="pulseStats">
                  <div><b>{currentAssets.length}</b><span>controlled surfaces</span></div>
                  <div><b>{initialData.work.length}</b><span>brand work items</span></div>
                  <div><b>{initialData.integrations.filter(x=>ok(x.status)).length}</b><span>verified connections</span></div>
                </div>
              </div>
              <div className="pulseVisual" aria-hidden="true">
                <div className="orbitalCore">
                  <i className="orbitRing ringOne"/><i className="orbitRing ringTwo"/><i className="orbitRing ringThree"/>
                  <div className="orbitNode nodeOne"/><div className="orbitNode nodeTwo"/><div className="orbitNode nodeThree"/>
                  <div className="orbitCentre"><Orbit size={26}/><strong>ORVIA</strong><small>BRAND CONTROL</small></div>
                </div>
                <div className="pulseBadge badgeOne"><Palette size={14}/><span>Brand DNA</span></div>
                <div className="pulseBadge badgeTwo"><Share2 size={14}/><span>Social</span></div>
                <div className="pulseBadge badgeThree"><Mic2 size={14}/><span>Voice</span></div>
              </div>
            </section>

            <section className="quickActions">
              <button onClick={()=>setTab('create')} className="quickCard qcNavy"><span className="quickIcon"><Zap size={19}/></span><div><small>START</small><b>New campaign</b><p>Give IRIS the outcome and let Brand Control build the governed pack.</p></div><ArrowUpRight size={16}/></button>
              <button onClick={()=>setView('Socials')} className="quickCard qcPurple"><span className="quickIcon"><Share2 size={19}/></span><div><small>CHANNELS</small><b>Social studio</b><p>Plan, approve, publish and measure every approved social output.</p></div><ArrowUpRight size={16}/></button>
              <button onClick={()=>setView('Media')} className="quickCard qcGold"><span className="quickIcon"><Video size={19}/></span><div><small>PRODUCTION</small><b>Media lab</b><p>Control HeyGen, Synthesia, Canva and approved creative production.</p></div><ArrowUpRight size={16}/></button>
              <button onClick={()=>setView('Websites')} className="quickCard qcTeal"><span className="quickIcon"><Layers3 size={19}/></span><div><small>ESTATE</small><b>Web & assets</b><p>Keep headers, footers, favicons, OG images and product identity aligned.</p></div><ArrowUpRight size={16}/></button>
            </section>

            <section className="statusCard">
              <div className="healthRing" style={{'--health':`${health*3.6}deg`} as React.CSSProperties}><span>{health}%</span></div>
              <div><h2>{initialData.connected?(reviewAssets.length?'Brand health needs attention':'Brand estate is aligned'):'Fresh platform is live'}</h2><p>{initialData.connected?`${currentAssets.length} controlled surfaces · ${reviewAssets.length} require reconciliation or verification`:'Connect Supabase and IRIS next. No synthetic data is being displayed.'}</p></div>
              <div className="humanBadge"><ShieldCheck size={15}/>Human authority retained</div>
            </section>

            <section className="boardWrap">
              <div className="boardHead"><div><small>IRIS → BRAND CONTROL</small><h2>Actions</h2></div><button onClick={()=>setTab('create')}><Plus size={15}/>New brief</button></div>
              <div className="board">
                <Column title="To do" tone="purple" items={todo}/><Column title="In progress" tone="gold" items={progress}/><Column title="Done" tone="teal" items={done}/><Column title="Failed / blocked" tone="red" items={failed}/>
              </div>
            </section>

            <section className="networkSection">
              <div className="networkHeading"><div><small>LIVE TOOLING</small><h2>Connected brand systems</h2></div><div className="networkMeta"><Radio size={15}/>{initialData.integrations.filter(x=>ok(x.status)).length} verified</div></div>
              <section className="networkGrid"><NetworkPanel title="Social" subtitle="Publishing & analytics" icon={<Share2 size={18}/>} rows={socials}/><NetworkPanel title="Media" subtitle="Generation & production" icon={<Video size={18}/>} rows={media}/><NetworkPanel title="Voice" subtitle="ARIA & telephony" icon={<Mic2 size={18}/>} rows={voice}/></section>
            </section>
          </>}

          {tab==='create'&&<section className="focusPanel"><div className="focusIcon"><WandSparkles/></div><small>CREATE WITH IRIS</small><h2>Start with the outcome, not the tool.</h2><p>Describe what ORVIA needs to communicate or change. Brand Control attaches the approved identity, brand rules, evidence requirements, channels and approval gate before production.</p><textarea value={brief} onChange={e=>setBrief(e.target.value)} placeholder="Example: Prepare a Witness Room launch pack for the website, LinkedIn, Facebook, two 10-second videos and Voice briefing."/><button onClick={submitBrief}><Sparkles size={16}/>Build controlled brief</button>{submitState&&<div className="submitState">{submitState}</div>}</section>}

          {tab==='analytics'&&<section className="focusPanel"><div className="focusIcon"><BarChart3/></div><small>REAL DATA ONLY</small><h2>Analytics populate only from verified connections.</h2><p>Brand Control does not invent followers, reach, conversions or campaign performance.</p><div className="stats"><div><b>{socials.filter(x=>ok(x.status)).length}</b><span>verified social connections</span></div><div><b>{reviewAssets.length}</b><span>estate exceptions</span></div><div><b>{initialData.work.filter(x=>x.approval_required).length}</b><span>approval-gated items</span></div></div></section>}
        </>:view==='Websites'?<WebsiteControl assets={initialData.assets} webProjects={initialData.webProjects} connected={initialData.connected} onCreateBrief={()=>{setView('Overview');setTab('create')}}/>:<SectionView view={view} assets={initialData.assets} integrations={initialData.integrations}/>}
      </section>
    </main>
  </div>
}

function Column({title,tone,items}:{title:string;tone:string;items:WorkItem[]}){return <div className={`column ${tone}`}><header><span/>{title}<b>{items.length}</b></header><div>{items.length?items.map(x=><WorkCard key={x.id} item={x}/>):<div className="emptyCard"><Sparkles size={20}/><b>No items</b><span>IRIS-routed work will appear here.</span></div>}</div></div>}
function WorkCard({item}:{item:WorkItem}){return <article className="workCard"><div className="workMeta"><span>{item.work_type.replaceAll('_',' ')}</span>{item.approval_required&&<span className="approval">approval</span>}</div><h4>{item.title}</h4><p>{item.detail||'Routed by IRIS to Brand Control.'}</p><footer><span>{item.priority}</span><span>{item.source_system||'IRIS'}</span></footer></article>}
function NetworkPanel({title,subtitle,icon,rows}:{title:string;subtitle:string;icon:React.ReactNode;rows:Integration[]}){return <article className="networkPanel"><div className="sectionTitle">{icon}<span><b>{title}</b><small>{subtitle}</small></span></div><div className="chips">{rows.length?rows.map(r=><div className="chip" key={r.code}><span className={ok(r.status)?'dot ready':'dot'}/><div><b>{r.name}</b><small>{String(r.status||'NOT VERIFIED').replaceAll('_',' ')}</small></div></div>):<div className="chip"><span className="dot"/><div><b>{title} tools</b><small>NOT CONNECTED</small></div></div>}</div></article>}


type WebsiteTab='Overview'|'Estate'|'Templates'|'Components'|'Deployments'|'SEO / OG'|'Compliance'|'Issues'|'Change History';

function WebsiteControl({assets,webProjects,connected,onCreateBrief}:{assets:Asset[];webProjects:WebProject[];connected:boolean;onCreateBrief:()=>void}){
  const [webTab,setWebTab]=useState<WebsiteTab>('Overview');
  const [siteAction,setSiteAction]=useState('');
  const websites=assets.filter(a=>Boolean(a.canonical_domain)||/website|site|web/i.test(String(a.asset_type||'')));
  const projectRows=webProjects.filter(p=>p.project_code!=='ORVIA-HEALTHCARE-LEGACY'&&p.project_code!=='ORVIA-WORKSPACE-TEMP');
  const verified=websites.filter(a=>ok(a.verification_status));
  const exceptions=websites.filter(a=>!ok(a.verification_status));
  const tabs:WebsiteTab[]=['Overview','Estate','Templates','Components','Deployments','SEO / OG','Compliance','Issues','Change History'];

  async function requestWebsiteChange(site:WebProject){
    const instruction=window.prompt(`What do you want changed on ${site.project_code}?`);
    if(!instruction?.trim())return;
    setSiteAction(`Sending ${site.project_code} change to IRIS…`);
    const r=await fetch('/api/iris/intake',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({
      instruction:`Website change for ${site.project_code} (${site.domain||site.live_url||site.github_repo||'site'}): ${instruction.trim()}`,
      target_agent:'IT-01',
      work_type:'website_change',
      approval_required:true,
      priority:'normal',
      source_reference:`brand-control-websites:${site.project_code}`
    })});
    const data=await r.json().catch(()=>({}));
    setSiteAction(r.ok?`Queued via IRIS to IT-01: ${data?.work?.id||site.project_code}`:(data?.reason||'Could not queue website change.'));
  }
  const templateClasses=['PUBLIC CORPORATE','PRODUCT SITE','SERVICE PAGE','CAMPAIGN LANDING PAGE','CASE STUDY','INSIGHT / ARTICLE','ACADEMY','PORTAL / LOGIN','CLIENT SITE','MICROSITE'];
  const runtimeComponents=['OrviaUtilityBar','OrviaHeader','OrviaHero','OrviaTrustStrip','OrviaMethod','OrviaCaseStudies','OrviaSocialFeed','OrviaArmedForcesPanel','OrviaPractitionerPanel','OrviaRelatedProducts','OrviaContact','OrviaFooter'];

  return <section className="websiteControl">
    <div className="websiteHero">
      <div>
        <div className="siteEyebrow"><Globe2 size={14}/>ORVIA WEBSITE LAYER</div>
        <h2>One brand. One website system. Many products.</h2>
        <p>Brand Control owns the approved identity, presentation and website rules. The ORVIA Web Runtime implements them across the estate; IRIS remains the conductor.</p>
        <div className="siteHeroActions"><button onClick={onCreateBrief}><Sparkles size={16}/>Create website brief</button><span className={connected?'siteLive connected':'siteLive'}><i/>{connected?'Live registry connected':'Registry connection pending'}</span></div>
      </div>
      <div className="siteRuntimeCard">
        <small>CONTROL CHAIN</small>
        <div><b>Brand Control</b><span>Policy & approved content</span></div>
        <i>↓</i>
        <div><b>ORVIA Web Runtime</b><span>Components & templates</span></div>
        <i>↓</i>
        <div><b>GitHub · Vercel · Live Site</b><span>Deploy & verify</span></div>
      </div>
    </div>

    <div className="websiteTabs">{tabs.map(t=><button key={t} className={webTab===t?'active':''} onClick={()=>setWebTab(t)}>{t}</button>)}</div>

    {webTab==='Overview'&&<>
      <div className="siteMetricGrid">
        <Metric icon={<Globe2 size={18}/>} label="Registered sites" value={projectRows.length||websites.length} note={connected?'Verified registry data':'Connect registry to populate'}/>
        <Metric icon={<MonitorCheck size={18}/>} label="Verified" value={verified.length} note="Current verification state"/>
        <Metric icon={<ShieldAlert size={18}/>} label="Needs attention" value={exceptions.length} note="Unverified or exception state"/>
        <Metric icon={<Boxes size={18}/>} label="Runtime components" value={runtimeComponents.length} note="Defined target component set"/>
      </div>
      <div className="siteOverviewGrid">
        <article className="sitePanel estatePanel"><PanelHead icon={<Globe2 size={17}/>} eyebrow="ESTATE" title="Website register"/><div className="estateRows">{projectRows.length?projectRows.slice(0,10).map(site=><WebProjectRow key={site.project_code} site={site} onEdit={requestWebsiteChange}/>):websites.length?websites.slice(0,8).map(site=><WebsiteRow key={site.asset_key} site={site}/>):<EmptyModule icon={<Globe2/>} title="No website records connected" body="When the Brand Control registry is connected, verified ORVIA domains will appear here."/>}</div>{siteAction&&<div className="submitState">{siteAction}</div>}</article>
        <article className="sitePanel"><PanelHead icon={<Boxes size={17}/>} eyebrow="RUNTIME" title="Shared component control"/><div className="runtimeList">{runtimeComponents.slice(0,7).map(name=><div key={name}><span className="runtimeIcon"><FileCode2 size={14}/></span><b>{name}</b><small>Pending runtime registration</small></div>)}</div></article>
      </div>
      <div className="siteOverviewGrid lower">
        <article className="sitePanel"><PanelHead icon={<LayoutTemplate size={17}/>} eyebrow="TEMPLATES" title="Approved structure library"/><div className="templateCloud">{templateClasses.slice(0,6).map(t=><span key={t}>{t}</span>)}</div><p className="panelNote">Template classes are defined; live template versions will appear only after runtime registration.</p></article>
        <article className="sitePanel"><PanelHead icon={<ScanSearch size={17}/>} eyebrow="COMPLIANCE" title="What Brand Control checks"/><div className="checkGrid">{['Logo / favicon','Header / footer','Contact data','Company & ICO','SEO / canonical','Open Graph','Social links','Legacy wording'].map(x=><span key={x}><ShieldCheck size={13}/>{x}</span>)}</div></article>
      </div>
    </>}

    {webTab==='Estate'&&<section className="sitePanel full"><PanelHead icon={<Globe2 size={17}/>} eyebrow="LIVE ESTATE" title="Registered ORVIA websites"/>{websites.length?<div className="estateTable"><div className="estateHeader"><span>Site</span><span>Domain</span><span>Status</span><span>Verification</span></div>{websites.map(site=><div className="estateTableRow" key={site.asset_key}><b>{site.display_name}</b><span>{site.canonical_domain||'No canonical domain'}</span><span>{String(site.estate_disposition||'UNSET').toUpperCase()}</span><span className={ok(site.verification_status)?'verifiedText':'pendingText'}>{String(site.verification_status||'NOT VERIFIED').replaceAll('_',' ')}</span></div>)}</div>:<EmptyModule icon={<Globe2/>} title="Estate register not connected yet" body="No website records are being invented. Connect the ORVIA Asset Registry / Website Registry to populate this view."/>}</section>}

    {webTab==='Templates'&&<section className="sitePanel full"><PanelHead icon={<LayoutTemplate size={17}/>} eyebrow="ORVIA WEB RUNTIME" title="Website template classes"/><div className="templateGrid">{templateClasses.map(t=><div key={t}><span><LayoutTemplate size={17}/></span><b>{t}</b><small>Defined · version not yet registered</small></div>)}</div></section>}

    {webTab==='Components'&&<section className="sitePanel full"><PanelHead icon={<Boxes size={17}/>} eyebrow="SHARED RUNTIME" title="Controlled components"/><div className="componentGrid">{runtimeComponents.map(name=><div key={name}><span><FileCode2 size={16}/></span><div><b>{name}</b><small>Brand Manifest consumer · registration pending</small></div></div>)}</div></section>}

    {webTab==='Deployments'&&<section className="sitePanel full"><PanelHead icon={<Rocket size={17}/>} eyebrow="DEPLOYMENT CONTROL" title="GitHub → Vercel → Live verification"/><div className="estateTable"><div className="estateHeader"><span>Site</span><span>GitHub</span><span>Vercel</span><span>Readiness</span></div>{projectRows.map(site=><div className="estateTableRow" key={site.project_code}><b>{site.project_code}</b><span>{site.github_repo||'Repo not mapped'}</span><span>{site.deployment_project||'Project not mapped'}</span><span className={site.rag_status==='GREEN'?'verifiedText':'pendingText'}>{site.rag_status||'UNASSESSED'} · {Math.round(Number(site.completion_percent||0))}%</span></div>)}</div></section>}

    {webTab==='SEO / OG'&&<section className="sitePanel full"><PanelHead icon={<Search size={17}/>} eyebrow="DISCOVERY" title="SEO & social preview control"/><div className="seoGrid">{['Title format','Meta descriptions','Canonical URLs','Open Graph images','Social card crop','Structured data','Internal linking','Sitemap / robots','Image alt rules','GSC integration'].map(x=><div key={x}><Search size={15}/><b>{x}</b><small>Controlled by Brand Manifest / Website Layer</small></div>)}</div></section>}

    {webTab==='Compliance'&&<section className="sitePanel full"><PanelHead icon={<ScanSearch size={17}/>} eyebrow="VERIFY" title="Live website compliance"/><div className="complianceHero"><div><b>{exceptions.length}</b><span>current registry exceptions</span></div><p>{connected?'Only records currently marked unverified or outside KEEP are counted here. Full page-level scanning is not connected yet.':'Connect the Website Registry before compliance counts can be treated as live.'}</p></div><div className="checkGrid large">{['Site reachable','Correct logo','Correct favicon','Header version','Footer version','Phone / email','Company number','ICO','Armed Forces status','Social links','Page title','Meta description','Canonical URL','OG image','Product identity','Broken links','Accessibility','Legacy wording','Old domains','Unsupported claims'].map(x=><span key={x}><ShieldCheck size={13}/>{x}</span>)}</div></section>}

    {webTab==='Issues'&&<section className="sitePanel full"><PanelHead icon={<CircleAlert size={17}/>} eyebrow="IRIS WORK" title="Website issues"/>{exceptions.length?<div className="issueList">{exceptions.map(x=><div key={x.asset_key}><CircleAlert size={16}/><div><b>{x.display_name}</b><span>{x.canonical_domain||x.asset_type||'Website'} · {String(x.verification_status||'NOT VERIFIED')}</span></div></div>)}</div>:<EmptyModule icon={<ShieldCheck/>} title={connected?'No registry-level website issues':'Issue feed not connected'} body={connected?'No currently registered website assets are marked as exceptions.':'IRIS-created website issues will appear here once Brand Control data is connected.'}/>}</section>}

    {webTab==='Change History'&&<section className="sitePanel full"><PanelHead icon={<History size={17}/>} eyebrow="AUDIT TRAIL" title="Website change history"/><EmptyModule icon={<History/>} title="No deployment history connected" body="This view will preserve previous commit, new commit, authority level, approval, deployment, live verification and rollback point."/></section>}
  </section>
}

function Metric({icon,label,value,note}:{icon:React.ReactNode;label:string;value:number;note:string}){return <article className="siteMetric"><span>{icon}</span><div><small>{label}</small><b>{value}</b><p>{note}</p></div></article>}
function PanelHead({icon,eyebrow,title}:{icon:React.ReactNode;eyebrow:string;title:string}){return <div className="sitePanelHead"><span>{icon}</span><div><small>{eyebrow}</small><h3>{title}</h3></div></div>}
function WebProjectRow({site,onEdit}:{site:WebProject;onEdit:(site:WebProject)=>void}){return <div className="websiteRow"><div className="siteInitial">{site.project_code.slice(0,1).toUpperCase()}</div><div><b>{site.project_code}</b><span>{site.domain||'No domain'} · {site.github_repo||'Repo not mapped'} · {site.deployment_project||'Vercel not mapped'}</span></div><button className="siteState" onClick={()=>onEdit(site)}>EDIT VIA IRIS</button>{(site.live_url||site.preview_url)&&<a href={site.live_url||site.preview_url||'#'} target="_blank" rel="noreferrer"><ExternalLink size={14}/></a>}</div>}

function WebsiteRow({site}:{site:Asset}){return <div className="websiteRow"><div className="siteInitial">{site.display_name.slice(0,1).toUpperCase()}</div><div><b>{site.display_name}</b><span>{site.canonical_domain||site.asset_type||'Website'}</span></div><span className={ok(site.verification_status)?'siteState good':'siteState'}>{String(site.verification_status||'NOT VERIFIED').replaceAll('_',' ')}</span>{site.canonical_url&&<a href={site.canonical_url} target="_blank" rel="noreferrer" aria-label={`Open ${site.display_name}`}><ExternalLink size={14}/></a>}</div>}
function EmptyModule({icon,title,body}:{icon:React.ReactNode;title:string;body:string}){return <div className="emptyModule"><span>{icon}</span><b>{title}</b><p>{body}</p></div>}

function SectionView({view,assets,integrations}:{view:View;assets:Asset[];integrations:Integration[]}){
  const copy:Record<View,{title:string;body:string}>={
    'Overview':{title:'Overview',body:''},
    'Brand DNA':{title:'Master brand system',body:'Logos, colours, typography, writing rules, approved descriptions, claims, CTAs, legal wording and product identities live here.'},
    'Socials':{title:'Social operating centre',body:'Connected accounts, content calendar, drafts, approvals, scheduled posts, published content, replies and performance.'},
    'Media':{title:'Media production',body:'HeyGen, Synthesia, Canva, visual prompts, approved presenters, video templates and generated-asset provenance.'},
    'Voice':{title:'Voice & ARIA',body:'Voice profiles, greetings, pronunciation, scripts, escalation wording, contact routes and approved conversational tone.'},
    'Websites':{title:'Website estate',body:'Shared headers, footers, Open Graph rules, favicons, product identity, canonical URLs and compliance checks across the ORVIA estate.'},
    'Assets':{title:'Approved asset library',body:'Master logos, product marks, favicons, app icons, social avatars, campaign graphics, videos and controlled derivatives.'},
    'Campaigns':{title:'Campaign control',body:'Objectives, audiences, channels, landing pages, media, approvals, UTM/tracking and verified performance.'},
    'Integrations':{title:'Integration truth',body:'Every connector is shown as connected, configured, native-link, degraded, error or not verified. No fake integrations.'},
    'Settings':{title:'Brand Control settings',body:'Authority, approval defaults, model context, connector configuration, audit rules and internal-only access.'}
  };
  const c=copy[view];
  return <section className="focusPanel sectionMode"><div className="focusIcon"><Palette/></div><small>{view.toUpperCase()}</small><h2>{c.title}</h2><p>{c.body}</p>{view==='Assets'&&<div className="listGrid">{assets.slice(0,20).map(a=><div key={a.asset_key}><b>{a.display_name}</b><span>{a.asset_type||a.canonical_domain||'Asset'}</span></div>)}</div>}{view==='Integrations'&&<div className="listGrid">{integrations.map(i=><div key={i.code}><b>{i.name}</b><span>{i.connection_mode||i.category||'Integration'} · {i.status||'NOT VERIFIED'}</span></div>)}</div>}{(view!=='Assets'&&view!=='Integrations')&&<div className="coming"><CircleAlert size={18}/><span>Fresh module shell is ready. We will wire its live controls next without inheriting Command.</span></div>}</section>
}
