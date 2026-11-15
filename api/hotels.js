// Hoteles reales con LiteAPI (Nuitée). Key en Vercel: LITEAPI_KEY
const{wrap,env,cached}=require("./_lib");
const KEY=()=>env("LITEAPI_KEY","LITEAPI_API_KEY","LITEAPI","liteapi");
const B="https://api.liteapi.travel/v3.0",hd=()=>({"X-API-Key":KEY(),"content-type":"application/json",accept:"application/json"});
const nz=s=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
// LiteAPI busca por nombre de ciudad (en inglés/oficial): probamos alias y variantes
const AL={"los cabos":["Cabo San Lucas","San Jose del Cabo"],"cabos":["Cabo San Lucas","San Jose del Cabo"],"tokio":["Tokyo"],"ciudad de mexico":["Mexico City","Ciudad de Mexico"],"cdmx":["Mexico City"],"san cristobal":["San Cristobal de las Casas"],"nueva york":["New York"],"londres":["London"],"paris":["Paris"],"roma":["Rome"],"estambul":["Istanbul"],"seul":["Seoul"],"florencia":["Florence"],"venecia":["Venice"],"lisboa":["Lisbon"],"praga":["Prague"],"viena":["Vienna"],"berlin":["Berlin"],"la paz":["La Paz"],"playa del carmen":["Playa del Carmen"],"merida":["Merida"]};
const names=d=>{const base=d.split(/[,(]/)[0].trim();return[...new Set([...(AL[nz(base)]||[]),base,base.replace(/^(los|las|la|el)\s+/i,""),nz(base)])].filter(Boolean)};
module.exports=wrap(async(b,res)=>{
  if(!KEY())return res.json({items:[],err:"sin key de LiteAPI"});
  const cc=/^[A-Za-z]{2}$/.test(b.cc||"")?b.cc.toUpperCase():"MX",n=Math.min(Math.max(+b.days||3,1),30),dep=new Date(Date.now()+30*864e5),out=new Date(+dep+n*864e5),f=x=>x.toISOString().slice(0,10);
  let hs=[];const tried=[];
  for(const cn of names(String(b.dest||""))){
    const l=await cached(`hl:${cc}:${cn}`,24*36e5,async()=>{const r=await fetch(`${B}/data/hotels?countryCode=${cc}&cityName=${encodeURIComponent(cn)}&limit=40`,{headers:hd()}),j=await r.json();if(!r.ok)throw new Error("LiteAPI hoteles "+r.status+" "+JSON.stringify(j).slice(0,150));return j.data||[]});
    tried.push(cn+":"+l.length);
    for(const h of l)if(!hs.some(x=>x.id==h.id))hs.push(h);
    if(hs.length>=40)break;
  }
  if(!hs.length)return res.json({items:[],err:`sin hoteles para ${b.dest} (país ${cc}; probé ${tried.join(", ")})`});
  const body={hotelIds:hs.map(h=>h.id),occupancies:[{adults:2}],currency:"MXN",guestNationality:"MX",checkin:f(dep),checkout:f(out),timeout:6};
  const j=await cached("hr:"+JSON.stringify(body),30*6e4,async()=>{const r=await fetch(`${B}/hotels/min-rates`,{method:"POST",headers:hd(),body:JSON.stringify(body)}),j=await r.json();if(!r.ok)throw new Error("LiteAPI tarifas "+r.status+" "+JSON.stringify(j).slice(0,150));return j});
  const by=Object.fromEntries(hs.map(h=>[h.id,h]));
  // "price" = tarifa mínima de toda la estancia -> se divide entre las noches
  const all=(j.data||[]).filter(x=>x.price>0&&by[x.hotelId]).map(x=>{const h=by[x.hotelId];return{id:x.hotelId,n:h.name,st:Math.round(h.stars||3),p:Math.round(x.price/n/10)*10,img:h.main_photo||h.thumbnail||""}}).sort((x,y)=>x.p-y.p);
  // páginas de 3 (económico, medio, premium) para el botón "Ver otras opciones"
  let items=all;
  if(all.length>=9){items=[];const seen=new Set();for(let pg=0;pg<3;pg++)for(let t=0;t<3;t++){let i=Math.min(all.length-1,Math.floor((t+pg/3)*all.length/3));while(seen.has(i)&&i<all.length-1)i++;seen.add(i);items.push(all[i])}}
  res.json({items:items.slice(0,9),src:"LiteAPI",sandbox:!!j.sandbox,dep:f(dep),out:f(out)});
});