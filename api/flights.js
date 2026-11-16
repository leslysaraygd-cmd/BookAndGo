// Vuelos reales con Ignav. Key en Vercel: IGNAV_API_KEY
const{wrap,env,cached,fx,trip}=require("./_lib");
const KEY=()=>env("IGNAV_API_KEY","IGNAV_KEY","IGNAV","ignav");
const call=(p,o={})=>fetch("https://ignav.com"+p,{...o,headers:{"X-Api-Key":KEY(),"content-type":"application/json"}});
const code=async(name,hint)=>/^[A-Z]{3}$/.test(hint||"")?hint:cached("ap:"+name,7*864e5,async()=>{
  const r=await call("/api/airports?q="+encodeURIComponent(name)+"&limit=5"),j=await r.json();
  return Array.isArray(j)&&j[0]?.code||null});
module.exports=wrap(async(b,res)=>{
  if(!KEY())return res.json({items:[],err:"sin key de Ignav"});
  const[o,d]=await Promise.all([code(b.origin,b.oc),code(b.dest,b.dc)]);
  if(!o||!d)return res.json({items:[],err:`aeropuerto no encontrado (${b.origin}→${b.dest})`});
  const T=trip(b); // precio por persona: la app multiplica por el número de viajeros
  const body={origin:o,destination:d,departure_date:T.dep,return_date:T.ret,adults:1,market:"MX"};
  const key="fl:"+JSON.stringify(body);
  const j=await cached(key,30*6e4,async()=>{const r=await call("/api/fares/round-trip",{method:"POST",body:JSON.stringify(body)}),j=await r.json();if(!r.ok)throw new Error("Ignav "+r.status+" "+JSON.stringify(j).slice(0,150));return j});
  const best={};
  for(const it of j.itineraries||[]){
    const amt=it.price?.amount;if(!(amt>0))continue;
    const seg=it.outbound?.segments?.[0],a=seg?.operating_carrier_name||it.outbound?.carrier||"Aerolínea",
      p=Math.round(amt*await fx(it.price.currency||"USD")/10)*10,
      h=(seg?.departure_time_local||"").match(/(\d{2}:\d{2})/)?.[1]||"",
      st=Math.max((it.outbound?.segments?.length||1)-1,0);
    if(!best[a]||p<best[a].p)best[a]={a,p,h,st};
  }
  const items=Object.values(best).sort((x,y)=>x.p-y.p).slice(0,9);
  res.json({items,src:"Ignav",from:o,to:d,dep:T.dep,ret:T.ret});
});
