// Fotos de Unsplash por el servidor (así la key no queda en el navegador). Key en Vercel: UNSPLASH_ACCESS_KEY
const{wrap,env,cached}=require("./_lib");
module.exports=wrap(async(b,res)=>{
  const k=env("UNSPLASH_ACCESS_KEY","UNSPLASH_KEY","UNSPLASH"),q=String(b.q||"").slice(0,80).trim();
  if(!k||!q)return res.json({items:[]});
  const r=await cached("ph:"+q.toLowerCase(),24*36e5,async()=>{
    const x=await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=1&orientation=landscape&content_filter=high`,{headers:{Authorization:"Client-ID "+k,"Accept-Version":"v1"}});
    if(!x.ok)throw new Error("Unsplash "+x.status);
    const p=(await x.json()).results?.[0];
    return p?{url:p.urls?.small,name:p.user?.name,link:p.user?.links?.html}:null});
  res.json(r?{items:[1],...r}:{items:[]});
});
