(()=>{
const $=id=>document.getElementById(id),M=$("msgs"),K=["dest","days","start","people","budget","origin","hotel","flight","plan"],S={hist:[],n:0,ofs:0,done:0};let sh=null;
const esc=s=>String(s).replace(/[&<>"']/g,c=>"&#"+c.charCodeAt(0)+";"),
nz=s=>String(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),
H=s=>[...s].reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,7),
mx=p=>"$"+(+p).toLocaleString("es-MX")+" MXN",
ICO={
  pin:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  cal:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>',
  hotel:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z"/><path d="m9 16 .348-.24c1.465-1.013 3.84-1.013 5.304 0L15 16"/><circle cx="12" cy="10" r="2"/></svg>',
  plane:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>',
  map:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/></svg>',
  wallet:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>',
  check:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>',
  bus:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/></svg>',
  car:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>',
  walk:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="1"/><path d="m9 20 3-6 3 6"/><path d="m6 8 6 2 6-2"/><path d="M12 10v4"/></svg>',
  max:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" x2="14" y1="3" y2="10"/><line x1="3" x2="10" y1="21" y2="14"/></svg>',
  min:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" x2="21" y1="10" y2="3"/><line x1="3" x2="10" y1="21" y2="14"/></svg>',
  bigPlane:'<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>',
  bigHotel:'<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z"/><path d="m9 16 .348-.24c1.465-1.013 3.84-1.013 5.304 0L15 16"/><circle cx="12" cy="10" r="2"/></svg>',
  bigPin:'<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>'
},
D=[["pv","Puerto Vallarta","playa romántico tranquilo",1800,"Puerto_Vallarta"],["cun","Cancún","playa familia aventura",2200,"Cancún"],["oax","Oaxaca","cultura gastronomía tranquilo",1300,"Oaxaca_de_Juárez"],["sc","San Cristóbal","cultura aventura tranquilo",1100,"San_Cristóbal_de_las_Casas"],["gto","Guanajuato","cultura romántico tranquilo",1200,"Guanajuato_(Guanajuato)"],["tul","Tulum","playa romántico aventura",2400,"Tulum"],["bac","Bacalar","tranquilo romántico playa",1500,"Bacalar"],["cdmx","Ciudad de México","cultura gastronomía familia",1500,"Ciudad_de_México"],["mty","Monterrey","aventura familia",1600,"Monterrey"],["lap","La Paz","playa tranquilo aventura",1700,"La_Paz_(Baja_California_Sur)"]].map(([id,n,t,c,k])=>({id,n,t,c,k})),
find=n=>n&&D.find(x=>nz(x.n).includes(nz(n))||nz(n).includes(nz(x.n))),
cur=()=>S.dest&&(find(S.dest)||{id:"g",n:S.dest,t:"",c:S.cost||(S.mode=="intl"?2800:1600),k:S.dest.replace(/ /g,"_")}),
nts=()=>S.days||3,nn=()=>Math.max(nts()-1,1),np=()=>S.people||1,rooms=()=>Math.ceil(np()/2),
hc=h=>(h?.p||0)*nn()*rooms(),fc=f=>(f?.p||0)*np(),used=()=>hc(S.hotel)+fc(S.flight),
iso=d=>d.toLocaleDateString("sv-SE"),today=()=>iso(new Date()),addD=(s,n)=>{const d=new Date(s+"T12:00");d.setDate(d.getDate()+n);return iso(d)},
MES=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"],
range=()=>S.start=="x"?"Por definir":S.start?`${fd(S.start)} — ${fd(addD(S.start,nts()-1))}`:"Por definir",
parseD=n=>{let m,d,mo,y;if(m=n.match(/^(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?$/)){d=+m[1];mo=+m[2];y=m[3]}else if(m=n.match(/^(?:el )?(\d{1,2}) de (\w+)(?: de (\d{4}))?$/)){d=+m[1];mo=MES.indexOf(m[2])+1;y=m[3]}else return;
  if(!(mo>=1&&mo<=12&&d>=1&&d<=31))return;y=y?(+y<100?2000+ +y:+y):+today().slice(0,4);
  let s=`${y}-${String(mo).padStart(2,"0")}-${String(d).padStart(2,"0")}`;if(new Date(s+"T12:00").getDate()!=d)return;if(s<today()&&!m[3])s=`${y+1}-${s.slice(5)}`;return s},
HN=["Casa del Sol","Hotel Brisa","Posada Real","Gran Marina","Villa Azul","Hotel Centro"],FI=["Aeroméxico","United","American","Iberia","Air France","LATAM"],FN=["Volaris","Aeroméxico","Viva","Calafia","Magni","TAR"],
ht=d=>[0,1,2].map(k=>{const i=(S.ofs*3+k)%6,n=`${HN[i]} ${d.n}`;return{n,st:3+i%3,p:Math.round(d.c*[.45,.75,1.1][i%3]*(1+H(n)%20/100)/50)*50}}),
fl=d=>{const i=S.mode=="intl";return[0,1,2].map(k=>{const a=(i?FI:FN)[(S.ofs*3+k)%6];return{a,p:(i?7500:1800)+H(a+d.n)%(i?14000:3200),h:`${6+H(a+d.n)%14}:${["00","15","30","45"][H(a+"m")%4]}`}})},
lab=(v,f)=>!v?"Pendiente":v=="n"?"No necesario":v=="x"?"Por tu cuenta":esc(v[f]);
// ---------- UI ----------
const add=(c,h)=>{const e=document.createElement("div");e.className=c;e.innerHTML=h;M.append(e);M.scrollTop=1e9;return e};
function say(t,me){const d=document.createElement("div");d.className="m"+(me?" me":"");d.textContent=t;d.dataset.t=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});M.append(d);M.scrollTop=1e9}
const bot=t=>{say(t);S.hist.push({r:"m",t})},
chips=a=>{M.querySelectorAll(".chips").forEach(e=>e.remove());add("chips",a.map(x=>`<button>${esc(x)}</button>`).join(""))},
WK={},UP={},
ph=async q=>{try{const u=bg.auth.currentUser;if(!u)return null;const r=await(await fetch("/api/photo",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({token:await u.getIdToken(),q})})).json();return r.url?r:null}catch{return null}};
async function pic(el){const{w,q,img}=el.dataset;let u,cr;try{
  if(img)u=img;else{const k=q||(w||"").replace(/_/g," ");if(k){const r=await(UP[k]??=ph(k));if(r?.url){u=r.url;cr=r}}}
  if(!u&&q)u=await(WK[q]??=fetch(`https://es.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrlimit=1&prop=pageimages&piprop=thumbnail&pithumbsize=480&format=json&origin=*`).then(r=>r.json()).then(j=>Object.values(j.query?.pages||{})[0]?.thumbnail?.source));
  if(!u&&w)u=await(WK[w]??=fetch("https://es.wikipedia.org/api/rest_v1/page/summary/"+encodeURIComponent(w)).then(r=>r.json()).then(j=>j.thumbnail?.source));
  u&&el.insertAdjacentHTML("afterbegin",`<img src="${esc(u)}" alt="">`+(cr?`<small style="position:absolute;left:6px;bottom:4px;z-index:1;font-size:10px;background:#000a;color:#fff;padding:1px 6px;border-radius:6px"><a style="color:#fff" href="${esc(cr.link||"https://unsplash.com")}?utm_source=bookandgo&utm_medium=referral" target="_blank" rel="noopener">${esc(cr.name||"Unsplash")}</a> · <a style="color:#fff" href="https://unsplash.com/?utm_source=bookandgo&utm_medium=referral" target="_blank" rel="noopener">Unsplash</a></small>`:""))}catch{}}
const cards=a=>{const e=add("cards",a.map(x=>`<div class="cc"><div class="im" data-w="${esc(x.w||"")}" data-q="${esc(x.q||"")}" data-img="${esc(x.img||"")}"><i>${x.e||ICO.bigPin}</i>${x.p!=null?`<b>${mx(x.p)}${x.pl||""}</b>`:""}</div><div class="bd"><h4>${esc(x.t)}</h4><p>${esc(x.s)}</p>${x.d?.length?`<ul style="margin:4px 0 0;padding-left:16px;font-size:12px;color:var(--muted)">${x.d.map(l=>`<li style="margin-bottom:4px">${esc(l)}</li>`).join("")}</ul>`:""}<div class="bt2">${x.btn.map(([l,a,i])=>`<button data-a="${a}" data-id="${esc(i)}">${l}</button>`).join("")}</div></div></div>`).join(""));e.querySelectorAll(".im").forEach(pic)};
function sync(){$("td").textContent=S.dest||"Sin destino";$("tb").textContent=S.budget!=null?mx(S.budget):"Por definir";$("tf").textContent=range();let t=$("tp");if(!t){t=document.createElement("div");t.id="tp";$("tb").parentNode.append(t)}
  t.innerHTML=`<div style="margin-top:8px;padding-top:8px;border-top:1px dashed var(--line);display:flex;flex-direction:column;gap:4px">
    <span>${ICO.cal} ${S.days||"—"} días · ${S.people||"—"} pers.</span>
    <span>${ICO.pin} Desde ${esc(S.origin||"—")}</span>
    <span>${ICO.hotel} ${lab(S.hotel,"n")}</span>
    <span>${ICO.plane} ${lab(S.flight,"a")}</span>
    <strong>${ICO.wallet} Restante: ${S.budget!=null?mx(S.budget-used()):"—"}</strong>
  </div>`}
function save(){const u=window.bg?.auth.currentUser;if(!u)return;const s={};[...K,"mode","cost","home","cc","lastOrigin","oa","da"].forEach(k=>s[k]=S[k]??null);
  bg.set(bg.ref(bg.db,"chats/"+u.uid),JSON.parse(JSON.stringify({m:S.hist.slice(-20),s}))).catch(()=>{})}
function set(k,v){if(k=="dest"&&S.dest&&nz(S.dest)!=nz(v))S.hotel=S.flight=S.plan=S.mode=S.pp=S.cc=S.da=0;if(k=="origin"&&S.origin!=v)S.oa=0;if(/^(dest|days|origin|start|people)$/.test(k))S.rc=0;S[k]=v;S.done=0;sync()}
const RS=()=>{if(S.origin)S.lastOrigin=S.origin;K.forEach(k=>S[k]=0);S.budget=null;S.mode=S.cost=S.pp=S.done=S.askHome=S.cc=S.rc=S.opt=S.oa=S.da=0;S.ofs=0;S.hist=[];sh=null;M.querySelectorAll(".chips,.sm,.dp").forEach(e=>e.remove())};
// ---------- Flujo del viaje ----------
const Q={
  dest:["¿A dónde te gustaría ir? Dime un destino o elige un estilo:",["Romántico","Tranquilo","Aventura","Internacional"]],
  days:["¿Cuántos días durará tu viaje?",["2 días","3 días","5 días","7 días"]],
  start:["¿Qué día saldrías? Elige la fecha o escríbela (ej. \"20 de diciembre\"):",["En 2 semanas","En 1 mes","Aún no sé la fecha"]],
  people:["¿Cuántas personas viajan? (contándote a ti)",["Solo yo","2 personas","3 personas","4 personas"]],
  budget:[()=>`¿Con qué presupuesto cuentas para ${S.dest}? (total${S.people>1?" para las "+S.people+" personas":""}, en pesos)`,["$5,000","$10,000","$15,000","$25,000"]],
  origin:["¿Desde qué ciudad saldrías?",()=>[...new Set([S.lastOrigin, "CDMX", "Guadalajara", "Monterrey", "Puebla"].filter(Boolean))].slice(0,4)],
  hotel:["¿Tienes algún hotel en mente?",["Ver recomendados","Ya tengo hotel","Omitir hotel"]],
  flight:[()=>`¿Buscamos tu vuelo desde ${S.origin}?`,["Ver vuelos","Ya tengo vuelo","Omitir vuelo"]],
  plan:["¿Quieres que arme tu itinerario?",["Armar itinerario","Más tarde"]]
};
function fin(){if(S.askHome)return;const p=K.find(k=>k=="budget"?S.budget==null:!S[k]);
  if(!p){if(!S.done){S.done=1;sum()}return}
  if(sh==p)return;const[q,c]=Q[p];bot((sh?"Nos quedamos en: ":"")+(typeof q=="function"?q():q));if(p=="start")dateCard();chips(typeof c=="function"?c():c)}
function dateCard(){M.querySelectorAll(".dp").forEach(e=>e.remove());add("it dp",`<div><b>${ICO.cal} Salida</b><span><input type="date" min="${today()}" style="background:transparent;color:inherit;border:1px solid var(--line);border-radius:8px;padding:6px;font:inherit"></span></div><button data-a="date">Confirmar fecha</button>`)}
function setStart(s){if(s<today()){bot("Esa fecha ya pasó. Elige una fecha futura.");return}set("start",s);bot(`Salida: ${fd(s)}${S.days?` · regreso: ${fd(addD(s,nts()-1))}`:""}.`)}
function sum(){const r=S.budget-used(),h=S.hotel.n?`${esc(S.hotel.n)} · ${mx(hc(S.hotel))}`:lab(S.hotel),f=S.flight.a?`${esc(S.flight.a)} · ${mx(fc(S.flight))}`:lab(S.flight);
  M.querySelectorAll(".sm").forEach(e=>e.remove());
  add("it sm",`<div><b>${ICO.pin} Resumen</b><span>${esc(S.dest)} · ${nts()} d · ${np()} pers. · desde ${esc(S.origin)}</span></div><div><b>${ICO.cal} Fechas</b><span>${range()}</span></div><div><b>${ICO.hotel} Hotel</b><span>${h}</span></div><div><b>${ICO.plane} Vuelo</b><span>${f}</span></div><div><b>${ICO.map} Plan</b><span>${Array.isArray(S.plan)?S.plan.length+" días":"Sin itinerario"}</span></div><div><b>${ICO.wallet} Total</b><span>${mx(used())} de ${mx(S.budget)} ${r<0?"(Excede presupuesto)":""}</span></div><button data-a="ok">${ICO.check} Confirmar reserva</button>`);
  bot(S.flight?.a?"¿Quieres ver cómo llegar desde tu casa al aeropuerto?":"¿Quieres ver cómo llegar?");chips([S.flight?.a?"Cómo llegar al aeropuerto":"Cómo llegar","Cambiar algo","Otras ideas"])}
const AP=()=>{const c=oac();return c?AN[c]||c+" airport":"Aeropuerto "+(S.origin||"")},
route=(d,t)=>{const h=S.home&&S.home!="gps"?S.home:"",o=h?`&origin=${encodeURIComponent(h)}`:"";add("it",`<div><b>${ICO.pin} ${esc(t)}</b><span>Desde ${h?esc(h):"tu ubicación actual"} (Google Maps)</span></div><div class="ln">${[[`${ICO.bus} Transporte`,"transit"],[`${ICO.car} Auto`,"driving"],[`${ICO.walk} A pie`,"walking"]].map(([l,m])=>`<a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(d)}${o}&travelmode=${m}" target="_blank" rel="noopener">${l}</a>`).join("")}</div>`)};
function goRoute(){if(!S.dest){bot("Primero dime a dónde quieres ir.");return}
  if(!S.home){S.askHome=1;bot("¿Desde dónde sales? Escríbeme tu colonia o dirección (ej. \"Col. Juárez, CDMX\") o usa tu ubicación actual.");chips(["Usar mi ubicación actual"]);return 0}
  const air=S.flight?.a||S.flight=="x"||/fly|intl/.test(S.mode),land=/local|road/.test(S.mode)||S.flight=="n";
  if(!air&&!land){bot("¿Cómo viajarás a "+S.dest+"? Así te muestro la ruta correcta.");chips(["Voy en avión","Voy por tierra"]);return 0}
  if(air){const h=S.flight?.h,e=S.mode=="intl"?3:2;let a="";if(h){const[x,y]=h.split(":").map(Number),t=(x*60+y-e*60+1440)%1440;a=` (aprox. ${t/60|0}:${String(t%60).padStart(2,"0")})`}
   bot(`Llega al aeropuerto ${e} h antes de tu vuelo${h?` de las ${h}`:""}${a}. Aquí tienes las opciones de ruta:`);route(AP(),"Ruta a tu aeropuerto"+(oac()?` (${oac()})`:""))}
  else{bot(`Aquí tienes la ruta para llegar a ${S.dest}:`);route(S.dest,"Ruta a "+S.dest)}}
function mode(){const m=S.mode;S.done=0;
  if(/local|road/.test(m)){if(!S.flight)S.flight="n";if(m=="local"){if(!S.hotel)S.hotel="n";if(!S.days)S.days=1}goRoute()}
  if(m=="intl"&&!S.pp){S.pp=1;bot("Nota de viaje internacional: revisa que tu pasaporte esté vigente y verifica los requisitos de entrada (visa, seguro) del país de destino.")}sync()}
const IA={pv:"PVR",cun:"CUN",oax:"OAX",sc:"TGZ",gto:"BJX",tul:"TQO",bac:"CTM",cdmx:"MEX",mty:"MTY",lap:"LAP"},
OA=[["MEX",/cdmx|ciudad de mexico|mexico city|\bdf\b|neza|chimalhuac|ecatepec|tlalnepantla|naucalpan|ixtapaluca|chalco|texcoco|iztapalapa|iztacalco|coacalco|tecamac|cuautitlan|huixquilucan|atizapan|azcapotzalco|coyoacan|xochimilco|tlahuac|milpa alta|chicoloapan|los reyes|edomex|estado de mexico|tultitlan|nicolas romero|zumpango|acolman|amecameca/],
["GDL",/guadalajara|zapopan|tlaquepaque|tonala/],["MTY",/monterrey|san nicolas de los garza|apodaca|escobedo|san pedro garza|santa catarina/],["PBC",/puebla/],["TLC",/toluca|metepec/],["QRO",/queretaro/],
["BJX",/guanajuato|irapuato|silao|celaya|leon,? gto/],["TIJ",/tijuana/],["MID",/merida/],["CUN",/cancun/],["VER",/veracruz/],["OAX",/oaxaca/],["CUU",/chihuahua/],["HMO",/hermosillo/],["CUL",/culiacan/],["MLM",/morelia/],["AGU",/aguascalientes/],["SLP",/san luis potosi/],["TRC",/torreon/],["VSA",/villahermosa/],["TGZ",/tuxtla/],["ACA",/acapulco/],["PVR",/puerto vallarta/],["SJD",/los cabos|cabo san lucas|san jose del cabo/],["MZT",/mazatlan/],["CJS",/ciudad juarez/]],
AN={MEX:"Aeropuerto Internacional Benito Juárez (AICM), Ciudad de México",GDL:"Aeropuerto Internacional de Guadalajara",MTY:"Aeropuerto Internacional de Monterrey",PBC:"Aeropuerto Internacional de Puebla",TLC:"Aeropuerto Internacional de Toluca",QRO:"Aeropuerto Intercontinental de Querétaro",BJX:"Aeropuerto Internacional del Bajío",CUN:"Aeropuerto Internacional de Cancún",TGZ:"Aeropuerto Ángel Albino Corzo, Tuxtla Gutiérrez"},
oi=o=>{o=nz(o||"");return(OA.find(([,r])=>r.test(o))||[""])[0]},
oac=()=>S.rc?.flight?.from||oi(S.origin)||S.oa||"",
fd=s=>new Date(s+"T12:00").toLocaleDateString("es-MX",{day:"numeric",month:"short"});
async function real(k,d){try{const u=bg.auth.currentUser;if(!u)return null;
  const r=await(await fetch("/api/"+(k=="hotel"?"hotels":"flights"),{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({token:await u.getIdToken(),dest:d.n,origin:S.origin||"Ciudad de México",days:nts(),start:S.start&&S.start!="x"?S.start:"",people:np(),cc:find(d.n)?"MX":S.cc||"",dc:IA[d.id]||S.da||"",oc:oi(S.origin)||S.oa||""})})).json();
  if(r.err)console.warn("API "+k+":",r.err);return r.items?.length?r:null}catch(e){console.warn(e);return null}}
async function showOpts(k){const d=cur();if(!d){bot("Primero dime a dónde quieres ir.");return fin()}
  sh=k;S.rc||={};let L=S.rc[k];
  if(L===undefined){const w=add("m dots","<span></span><span></span><span></span>");L=S.rc[k]=await real(k,d);w.remove()}
  let l;if(L?.items?.length){const n=L.items.length,s=(S.ofs*3)%n;l=[...L.items,...L.items].slice(s,s+3).slice(0,n)}else l=(k=="hotel"?ht:fl)(d);
  S.opt={k,l};
  cards(l.map((o,i)=>k=="hotel"?{w:d.k,img:o.img,e:ICO.bigHotel,t:o.n,s:`${o.st} estrellas · ${nn()} noche${nn()>1?"s":""}${rooms()>1?` · ${rooms()} hab.`:""} = ${mx(o.p*nn()*rooms())}`,p:o.p,pl:"/noche",btn:[["Elegir hotel","sh",i]]}:{e:ICO.bigPlane,t:o.a,s:`${S.origin||"Tu ciudad"}${L?.from?` (${L.from})`:""} → ${d.n}${L?.to?` (${L.to})`:""} · ${o.h||""} · ${o.st==null?(S.mode=="intl"?"internacional":"directo"):o.st?o.st+" escala"+(o.st>1?"s":""):"directo"}${np()>1?` · ${np()} pers. = ${mx(o.p*np())}`:""}`,p:o.p,pl:" redondo",btn:[["Elegir vuelo","sh",i]]}));
  const depTxt=S.start&&S.start!="x"?fd(S.start):"fechas seleccionadas";
  say(k=="hotel"?`Tarifas disponibles en ${d.n} para ${L?.dep?`${fd(L.dep)} – ${fd(L.out)}`:depTxt} (por habitación). Sujetas a disponibilidad.`:`Tarifas disponibles hacia ${d.n}${L?.dep?` (${fd(L.dep)} – ${fd(L.ret)})`:""}, precio redondo por persona.`);
  chips(["Ver otras opciones"])}
function showPlan(){sh="plan";const d=cur();
  cards(S.plan.map((x,i)=>({w:d?.k,q:`${x.p} ${S.dest}`,e:ICO.bigPin,t:`Día ${i+1}`+(x.m?`: ${x.t}`:""),s:x.m?(x.c!=null?`Estimado: ${mx(x.c)}${np()>1?" por persona":""}`:""):x.t,d:[x.m&&"Mañana: "+x.m,x.a&&"Tarde: "+x.a,x.n&&"Noche: "+x.n].filter(Boolean),btn:[["Cambiar día","chg",i]]})));
  if(S.plan.some(x=>x.c!=null)){const tot=S.plan.reduce((a,x)=>a+(+x.c||0),0)*np(),rest=S.budget!=null?Math.max(S.budget-used(),0):null;
   say(`Comidas, entradas y transporte local estimados${np()>1?` para ${np()} personas`:""}: ${mx(tot)}`+(rest!=null?` de ${mx(rest)} disponibles${tot<=rest?" (dentro del presupuesto)":""}.`:""))}
  chips(["Me gusta","Otras ideas"])}
const dc=d=>({w:d.k,e:ICO.bigPin,t:d.n,s:(S.budget?`${mx(d.c*nts()*np())} por ${nts()} días${np()>1?" · "+np()+" pers.":""} · `:"")+d.t.split(" ").join(" · "),p:d.c,pl:"/día",btn:[["Elegir destino","pick",d.id]]});
function sug(m,b){sh="dest";let l=b?[...D].sort((a,c)=>a.c-c.c):D.filter(x=>(!m||x.t.includes(m.slice(0,6)))&&(!S.budget||x.c*nts()*np()<=S.budget));if(!l.length)l=[...D].sort((a,c)=>a.c-c.c);cards(l.slice(0,4).map(dc))}
// ---------- Botones/frases cortas ----------
const mood=t=>(nz(t).match(/romantic|aventura|tranquil|familia|playa|cultura|gastronom|barato|econom/)||[])[0];
function local(t){const n=nz(t),s=t.length<40,m=mood(t);let x;if(!s||/internacional|extranjero/.test(n))return;
  if((x=n.match(/^(?:somos |viajamos )?(\d{1,2}) (?:personas?|viajeros|adultos)$/))||(x=n.match(/^somos (\d{1,2})$/)))return()=>set("people",Math.min(Math.max(+x[1],1),20));
  if(/^(solo yo|yo solo|solo|sola|una persona)$/.test(n))return()=>set("people",1);
  if(/^(en pareja|pareja|los dos)$/.test(n))return()=>set("people",2);
  if(x=n.match(/^en (\d{1,2}) (semanas?|meses|mes)$/))return()=>setStart(addD(today(),+x[1]*(/sem/.test(x[2])?7:30)));
  if(/^aun no se( la fecha)?$/.test(n)&&!S.start)return()=>set("start","x");
  if(x=parseD(n))return()=>setStart(x);
  if(/^\$?\s?0$|^(gratis|nada|cero)$/.test(n))return()=>set("budget",0);
  if(x=t.match(/^\$\s?([\d,]{3,})(?:\s*(?:pesos|mxn))?$/i))return()=>set("budget",+x[1].replace(/,/g,""));
  if(x=n.match(/^(\d{1,2}) dias?$/))return()=>set("days",+x[1]);
  if(x=n.match(/^(\d{1,2}|una?|dos) semanas?$/))return()=>set("days",7*({un:1,una:1,dos:2}[x[1]]||+x[1]));
  if(x=t.match(/^(?:desde\s+)?(cdmx|guadalajara|monterrey|puebla|toluca|queretaro|merida|tijuana|cancun|leon)$/i))return()=>set("origin",x[1]);
  if(/^(ya tengo|omitir) (hotel|vuelo)/.test(n))return()=>set(/hotel/.test(n)?"hotel":"flight","x");
  if(n=="mas tarde")return()=>set("plan","x");
  if(/ver (hoteles|vuelos|recomendados)$/.test(n))return()=>showOpts(/vuelos/.test(n)?"flight":"hotel");
  if(/voy en avion/.test(n))return()=>{S.mode="fly";sync();return goRoute()};
  if(/voy por tierra/.test(n))return()=>{S.mode="road";if(!S.flight)S.flight="n";sync();return goRoute()};
  if(/como llegar|llegar al aeropuerto/.test(n))return goRoute;
  if(/reintentar/.test(n))return()=>{const u=[...S.hist].reverse().find(m=>m.r=="u"&&!/reintentar/i.test(m.t))?.t;if(u)send(u);return 0};
  if(/otras opciones/.test(n))return()=>{S.ofs++;showOpts(S.opt?.k||"hotel")};
  if(/cambiar algo/.test(n))return()=>{bot("Dime qué deseas modificar: hotel, vuelo, destino, días o presupuesto.");chips(["Ver hoteles","Ver vuelos","Armar itinerario"]);return 0};
  if(/otro viaje/.test(n))return()=>{RS();sync();bot("Listo, comencemos a planear tu nuevo viaje. ¿A dónde te gustaría ir?")};
  if(/me gusta/.test(n)&&Array.isArray(S.plan))return()=>bot("Excelente, tu itinerario ha quedado guardado en el resumen.");
  if(/armar itinerario|crear itinerario|planear un viaje/.test(n))return()=>{if(S.dest&&S.days&&!/planear/.test(n)){send(`Arma mi itinerario de ${nts()} días a ${S.dest}`);return 0}};
  if(m)return()=>{bot(/barato|econom/.test(m)?"Estos son los destinos más accesibles disponibles:":"Estas opciones se ajustan a lo que buscas:");sug(m,/barato|econom/.test(m))}}
function show(r){r.dbg&&console.warn("Gemini:",r.dbg);bot(r.say||"¿En qué más puedo ayudarte?");if(r.err){chips(["Reintentar"]);save();return}
  const lu=[...S.hist].reverse().find(m=>m.r=="u")?.t||"",up=(k,v)=>(v||(k=="budget"&&v===0&&S.budget==null&&/\b0\b|gratis|cero|nada/i.test(lu)))&&v!=S[k]&&set(k,v),i=r.intent,nl=nz(lu),
   dOK=/dias?|noches?|semanas?|fin de semana|puente|quincena|\d.*\bal\b.*\d/.test(nl),
   bOK=/\d|\bmil\b|gratis|cero|nada|sin dinero/.test(nl),
   sOK=/\d|manana|pasado|proxim|navidad|ano nuevo|semana santa|verano|enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre/.test(nl),
   oOK=!!r.origin&&(nl.includes(nz(r.origin))||nz(r.origin).split(/\s+/).some(x=>x.length>=5&&nl.includes(x))||(!!oi(r.origin)&&oi(r.origin)==oi(lu))),
   wp=!!(S.days&&cur()&&(/itinerario|dia por dia|plan de|actividad|cambia (el )?dia|agenda/.test(nl)||(Array.isArray(S.plan)&&/otras ideas|otro plan|otra opcion|cambia|modifica|barato|economico/.test(nl)))),
   pOK=/\d|somos|\bsolo\b|\bsola\b|pareja|espos|novi[oa]|\b(dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\b/.test(nl);
  up("dest",r.dest);up("days",dOK&&!PR.days&&!(S.days&&i=="plan")?r.days:0);up("budget",bOK&&!PR.budget?r.budget:undefined);up("origin",oOK?r.origin:0);
  {const st=sOK&&/^\d{4}-\d{2}-\d{2}$/.test(r.start||"")&&r.start>=today()?r.start:0;up("start",st);up("people",pOK&&!PR.people?Math.min(Math.max(+r.people||0,0),20):0)}
  if(S.origin&&!oi(S.origin)&&/^[A-Z]{3}$/.test(r.oa||""))S.oa=r.oa;if(cur()&&!IA[cur().id]&&/^[A-Z]{3}$/.test(r.da||""))S.da=r.da;if(r.cost)S.cost=r.cost;if(/^[A-Za-z]{2}$/.test(r.cc||""))S.cc=r.cc.toUpperCase();if(r.mode&&S.origin&&r.mode!=S.mode){S.mode=r.mode;mode()}
  if(i=="plan"&&r.plan?.length&&wp){set("plan",r.plan.slice(0,10).map(x=>({t:String(x.t||"").slice(0,90),p:String(x.p||"").slice(0,60),m:String(x.m||"").slice(0,160),a:String(x.a||"").slice(0,160),n:String(x.n||"").slice(0,160),c:x.c==null||!isFinite(+x.c)?null:Math.max(0,Math.round(+x.c))})));showPlan()}
  else if(wp&&(i=="plan"||/itinerario/.test(nl))){
   [...M.querySelectorAll(".m")].pop()?.remove();S.hist.pop();bot("No pude generar el itinerario completo en este intento. ¿Lo intentamos de nuevo?");chips(["Armar itinerario","Más tarde"]);save();return}
  else if(i=="hotels"||i=="flights")showOpts(i=="hotels"?"hotel":"flight");
  else if(i=="route")goRoute();
  else if(i=="suggest"){if(r.ideas?.length){sh="dest";cards(r.ideas.slice(0,4).map(n=>({w:String(n).replace(/ /g,"_"),e:ICO.bigPin,t:String(n),s:"Destino sugerido",btn:[["Elegir destino","pickn",n]]})))}else sug(nz(r.mood||""))}
  fin();save()}
async function ai(){const w=add("m dots","<span></span><span></span><span></span>"),p=Array.isArray(S.plan)?S.plan.map((x,i)=>`${i+1}.${x.t}`).join("|"):"?";
  try{const u=bg.auth.currentUser,r=await(await fetch("/api/chat",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({token:await u.getIdToken(),msgs:S.hist.slice(-6),ctx:`Hoy:${today()};Inicio:${S.start||"?"};Personas:${S.people||"?"};Dest:${S.dest||"?"};Días:${S.days||"?"};Presup:${S.budget??"?"};Modo:${S.mode||"?"};Casa:${S.home&&S.home!="gps"?S.home:"?"};Sobrante:${S.budget!=null?S.budget-used():"?"};Pais:${S.cc||"?"};Origen:${S.origin||"?"};Hotel:${S.hotel?.n||(S.hotel?"x":"?")};Vuelo:${S.flight?.a||(S.flight?"x":"?")};Plan:${p}`})})).json();w.remove();show(r)}
  catch{w.remove();say("No pude conectarme en este momento. Intenta de nuevo.");chips(["Reintentar"])}}
function act(o,b){
  if(o.a=="pick"){const d=D.find(x=>x.id==o.id);set("dest",d.n);bot(`${d.n} es una excelente elección.`);fin()}
  else if(o.a=="pickn")send("Quiero ir a "+o.id);
  else if(o.a=="sh"){const k=S.opt.k,x=S.opt.l[o.id],r=S.budget!=null&&S.budget-(k=="hotel"?hc(x)+fc(S.flight):fc(x)+hc(S.hotel));
   set(k=="hotel"?"hotel":"flight",x);bot(`${k=="hotel"?"Hotel":"Vuelo"} seleccionado: ${x.n||x.a} (${mx(k=="hotel"?hc(x):fc(x))}).`+(S.budget==null?"":r>=0?` Te quedan ${mx(r)} disponibles.`:` Excede tu presupuesto por ${mx(-r)}.`));fin()}
  else if(o.a=="chg")send(`Cambia el día ${+o.id+1} por otra actividad`);
  else if(o.a=="date"){const v=b.parentNode.querySelector("input").value;if(!v){bot("Por favor selecciona una fecha en el calendario.");return}b.closest(".dp").remove();setStart(v);fin()}
  else if(o.a=="ok"){const u=bg.auth.currentUser,c="BG-"+Math.random().toString(36).slice(2,8).toUpperCase();
   bg.set(bg.ref(bg.db,`reservas/${u.uid}/${c}`),JSON.parse(JSON.stringify({dest:S.dest,days:S.days,origen:S.origin,hotel:S.hotel,vuelo:S.flight,plan:S.plan,total:used(),estado:"confirmada",ts:Date.now()}))).catch(()=>{});
   b.innerHTML=`${ICO.check} Reserva confirmada`;b.disabled=true;
   bot(`Reserva confirmada.\nCódigo de confirmación: ${c}\nDestino: ${S.dest} (${nts()} días · ${np()} pers.)\nTotal: ${mx(used())}\nLos detalles de tu itinerario y reservación han sido registrados en tu cuenta.`);
   chips([S.flight?.a?"Cómo llegar al aeropuerto":"Cómo llegar","Planear otro viaje"])}
  save()}
function go(t,show){if(S.n++>40)return say("Llegaste al límite de mensajes de esta sesión. Abre un chat nuevo.");
  say(show||t,1);S.hist.push({r:"u",t:t.slice(0,300)});sh=null;
  if(S.askHome){const g=/ubicaci[oó]n actual/i.test(t);if(!g&&(nz(t).trim()==nz(S.origin||"")||t.trim().length<8)){bot("Necesito una referencia más específica para trazar tu ruta: tu colonia, calle o punto de partida (ej. \"Metro Juanacatlán, CDMX\").");chips(["Usar mi ubicación actual"]);save();return}
  S.askHome=0;S.home=/ubicaci[oó]n actual/i.test(t)?"gps":t.replace(/[^\p{L}\p{N}\s.,#\-\/ ]/gu," ").replace(/\s+/g," ").trim().slice(0,120);bot(S.home=="gps"?"Perfecto, utilizaré tu ubicación actual.":"Anotado: punto de partida en "+S.home+".");goRoute();save();return}
  const l=local(t);l?(l()!==0&&fin(),save()):(pre(t),ai())}
let PR={};
function pre(t){const n=nz(t);let x,b=null;PR={};
  if((x=n.match(/(\d{1,2})\s*(?:personas?|adultos|viajeros|pasajeros)/))||(x=n.match(/somos\s*(\d{1,2})\b/))){const v=Math.min(Math.max(+x[1],1),20);PR.people=1;if(v!=S.people)set("people",v)}
  else if(/\b(solo yo|yo solo|viajo solo|viajo sola)\b/.test(n)&&(PR.people=1)&&S.people!=1)set("people",1);
  if(x=n.match(/(\d+(?:[.,]\d+)?)\s*(?:mil|k)\b/))b=Math.round(parseFloat(x[1].replace(",","."))*1000);
  else if(x=n.match(/(?:con|presupuesto(?: de)?|tenemos|tengo|\$)\s*\$?\s*(\d[\d,.]{2,})/))b=+x[1].replace(/[,.]/g,"");
  if(b&&/por persona|cada (uno|quien)|c\/u/.test(n))b*=S.people||1;
  if(b&&b>=100){PR.budget=1;if(b!=S.budget)set("budget",b)}
  if(!S.days&&(x=n.match(/(\d{1,2})\s*dias?/))){PR.days=1;set("days",+x[1])}
  if(!S.days&&(x=n.match(/(\d{1,2}|una?|dos)\s*semanas?/))){PR.days=1;set("days",7*({un:1,una:1,dos:2}[x[1]]||+x[1]))}}
function send(t,show){gate(()=>go(t,show),"Inicia sesión para chatear con Book&Go IA")}
let rs;async function restore(){const u=window.bg?.auth.currentUser;if(!u||rs==u.uid)return;rs=u.uid;
  try{const s=await bg.get(bg.ref(bg.db,"chats/"+u.uid));if(s.exists()&&!S.hist.length){const v=s.val();S.hist=v.m||[];[...K,"mode","cost","home","cc","lastOrigin","oa","da"].forEach(k=>S[k]=v.s?.[k]??(k=="budget"?null:0));S.hist.forEach(m=>say(m.t,m.r=="u"));sync();if(S.dest){sh="r";fin()}}}catch{}}
window.preset=({start,end}={})=>{RS();if(start&&start>=today()){S.start=start;if(end&&end>=start)S.days=Math.min(Math.round((new Date(end)-new Date(start))/864e5)+1,30)}sync()};
window.send=send;
window.openChat=()=>{$("chat").classList.add("open");$("fab").style.display="none";$("ci").focus();restore()};
$("fab").onclick=openChat;
$("x").onclick=()=>{$("chat").classList.remove("open","full");$("fab").style.display="";$("ex").innerHTML=ICO.max};
$("ex").onclick=()=>{$("ex").innerHTML=$("chat").classList.toggle("full")?ICO.min:ICO.max};
$("nc").onclick=()=>{[...M.children].slice(1).forEach(n=>n.remove());RS();Object.assign(S,{hist:[],n:0,ofs:0});sync();save()};
$("chat").onclick=e=>{const b=e.target.closest("[data-q]");b&&send(b.dataset.q)};
M.onclick=e=>{const b=e.target.closest("button");if(!b)return;
  if(b.parentNode.classList.contains("chips")){b.parentNode.remove();send(b.textContent)}else if(b.dataset.a)act(b.dataset,b)};
$("ci").maxLength=300;
$("cf").onsubmit=e=>{e.preventDefault();const v=$("ci").value.trim();if(v){$("ci").value="";send(v)}};
})();