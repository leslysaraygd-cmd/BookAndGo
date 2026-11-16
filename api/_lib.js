// Utilidades compartidas (el guion bajo evita que Vercel lo exponga como ruta).
const FB=process.env.FIREBASE_API_KEY||"AIzaSyBY0KCEgBwrKV02kiFTGZLtWOxO9ozzSso"; // pública por diseño
const auth=async t=>!!t&&(await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FB}`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({idToken:t})})).ok;
const env=(...n)=>{for(const k of n)if(process.env[k])return process.env[k]};
const C=new Map();
const cached=async(k,ttl,f)=>{const h=C.get(k);if(h&&Date.now()-h.t<ttl)return h.v;const v=await f();if(C.size>300)C.clear();C.set(k,{t:Date.now(),v});return v};
const FX={USD:18.5,EUR:20,CAD:13.5,JPY:0.12,GBP:23};
const fx=async cur=>cur==="MXN"?1:cached("fx:"+cur,6*36e5,async()=>{try{const j=await(await fetch(`https://open.er-api.com/v6/latest/${cur}`)).json();return j.rates?.MXN||FX[cur]||18.5}catch{return FX[cur]||18.5}});
// Solo usuarios con sesión; si algo truena, el chat cae a datos de ejemplo.
const wrap=fn=>async(req,res)=>{
  if(req.method!=="POST")return res.status(405).end();
  const b=req.body||{};
  if(!await auth(b.token))return res.status(401).json({items:[],err:"auth"});
  try{await fn(b,res)}catch(e){console.error(e);res.json({items:[],err:String(e.message||e).slice(0,200)})}
};
// Fechas del viaje: usa la fecha elegida (si es futura) o, si no, hoy + 30 días.
// "days" = días del viaje (incluye llegada y salida); span = noches (mín. 1 para cotizar).
const iso=d=>d.toISOString().slice(0,10);
const trip=b=>{const days=Math.min(Math.max(+b.days||3,1),30),today=iso(new Date()),
  s=/^\d{4}-\d{2}-\d{2}$/.test(b.start||"")&&b.start>=today?b.start:iso(new Date(Date.now()+30*864e5)),
  span=Math.max(days-1,1),dep=new Date(s+"T12:00:00Z");
  return{days,span,dep:iso(dep),ret:iso(new Date(+dep+span*864e5))}};
module.exports={auth,env,cached,fx,wrap,trip};
