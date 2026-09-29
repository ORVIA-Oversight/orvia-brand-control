import { google } from "googleapis";

export type GscEvidence = {
  siteUrl: string;
  startDate: string;
  endDate: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  topQueries: Array<{query:string;clicks:number;impressions:number;ctr:number;position:number}>;
  topPages: Array<{page:string;clicks:number;impressions:number;ctr:number;position:number}>;
};

function isoDate(d:Date){return d.toISOString().slice(0,10)}

export function gscConfigured(){
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY &&
    process.env.GSC_SITE_URLS
  );
}

export async function getGscEvidence(days=28):Promise<GscEvidence[]>{
  if(!gscConfigured()) return [];

  const auth=new google.auth.JWT({
    email:process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key:String(process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY).replace(/\\n/g,"\n"),
    scopes:["https://www.googleapis.com/auth/webmasters.readonly"]
  });

  const searchconsole=google.searchconsole({version:"v1",auth});
  const end=new Date();
  end.setUTCDate(end.getUTCDate()-3);
  const start=new Date(end);
  start.setUTCDate(start.getUTCDate()-(days-1));
  const startDate=isoDate(start), endDate=isoDate(end);

  const sites=String(process.env.GSC_SITE_URLS)
    .split(",")
    .map(x=>x.trim())
    .filter(Boolean);

  const out:GscEvidence[]=[];

  for(const siteUrl of sites){
    const [summary,queries,pages]=await Promise.all([
      searchconsole.searchanalytics.query({
        siteUrl,
        requestBody:{startDate,endDate,dimensions:[],rowLimit:1}
      }),
      searchconsole.searchanalytics.query({
        siteUrl,
        requestBody:{startDate,endDate,dimensions:["query"],rowLimit:25}
      }),
      searchconsole.searchanalytics.query({
        siteUrl,
        requestBody:{startDate,endDate,dimensions:["page"],rowLimit:25}
      })
    ]);

    const s=summary.data.rows?.[0]||{};
    out.push({
      siteUrl,startDate,endDate,
      clicks:Number(s.clicks||0),
      impressions:Number(s.impressions||0),
      ctr:Number(s.ctr||0),
      position:Number(s.position||0),
      topQueries:(queries.data.rows||[]).map(r=>({
        query:String(r.keys?.[0]||""),
        clicks:Number(r.clicks||0),
        impressions:Number(r.impressions||0),
        ctr:Number(r.ctr||0),
        position:Number(r.position||0)
      })),
      topPages:(pages.data.rows||[]).map(r=>({
        page:String(r.keys?.[0]||""),
        clicks:Number(r.clicks||0),
        impressions:Number(r.impressions||0),
        ctr:Number(r.ctr||0),
        position:Number(r.position||0)
      }))
    });
  }

  return out;
}
