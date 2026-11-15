(()=>{
const $=id=>document.getElementById(id),M=$("msgs"),K=["dest","days","budget","origin","hotel","flight","plan"],S={hist:[],n:0,ofs:0,done:0};let sh=null;
const esc=s=>String(s).replace(/[&<>"']/g,c=>"&#"+c.charCodeAt(0)+";"),
nz=s=>String(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),
H=s=>[...s].reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,7),
mx=p=>"$"+(+p).toLocaleString("es-MX")+" MXN",
// [id, nombre, etiquetas, costo/día MXN, título de Wikipedia para la foto]
D=[["pv","Puerto Vallarta","playa romantico tranquilo",1800,"Puerto_Vallarta"],["cun","Cancún","playa familia aventura",2200,"Cancún"],["oax","Oaxaca","cultura gastronomia tranquilo",1300,"Oaxaca_de_Juárez"],["sc","San Cristóbal","cultura aventura tranquilo",1100,"San_Cristóbal_de_las_Casas"],["gto","Guanajuato","cultura romantico tranquilo",1200,"Guanajuato_(Guanajuato)"],["tul","Tulum","playa romantico aventura",2400,"Tulum"],["bac","Bacalar","tranquilo romantico playa",1500,"Bacalar"],["cdmx","Ciudad de México","cultura gastronomia familia",1500,"Ciudad_de_México"],["mty","Monterrey","aventura familia",1600,"Monterrey"],["lap","La Paz","playa tranquilo aventura",1700,"La_Paz_(Baja_California_Sur)"]].map(([id,n,t,c,k])=>({id,n,t,c,k})),
find=n=>n&&D.find(x=>nz(x.n).includes(nz(n))||nz(n).includes(nz(x.n))),
cur=()=>S.dest&&(find(S.dest)||{id:"g",n:S.dest,t:"",c:S.cost||(S.mode=="intl"?2800:1600),k:S.dest.replace(/ /g,"_")}),
nts=()=>S.days||3,used=()=>(S.hotel?.p||0)*nts()+(S.flight?.p||0),
HN=["Casa del Sol","Hotel Brisa","Posada Real","Gran Marina","Villa Azul","Hotel Centro"],FI=["Aeroméxico","United","American","Iberia","Air France","LATAM"],FN=["Volaris","Aeroméxico","Viva","Calafia","Magni","TAR"],
ht=d=>[0,1,2].map(k=>{const i=(S.ofs*3+k)%6,n=`${HN[i]} ${d.n}`;return{n,st:3+i%3,p:Math.round(d.c*[.45,.75,1.1][i%3]*(1+H(n)%20/100)/50)*50}}),
fl=d=>{const i=S.mode=="intl";return[0,1,2].map(k=>{const a=(i?FI:FN)[(S.ofs*3+k)%6];return{a,p:(i?7500:1800)+H(a+d.n)%(i?14000:3200),h:`${6+H(a+d.n)%14}:${["00","15","30","45"][H(a+"m")%4]}`}})},
lab=(v,f)=>!v?"Pendiente":v=="n"?"No necesario 😄":v=="x"?"Por tu cuenta":esc(v[f]);

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
 u&&el.insertAdjacentHTML("afterbegin",`<img src="${esc(u)}" alt="">`+(cr?`<small style="position:absolute;left:6px;bottom:4px;z-index:1;font-size:10px;background:#000a;color:#fff;padding:1px 6px;border-radius:6px">📷 <a style="color:#fff" href="${esc(cr.link||"https://unsplash.com")}?utm_source=bookandgo&utm_medium=referral" target="_blank" rel="noopener">${esc(cr.name||"Unsplash")}</a> · <a style="color:#fff" href="https://unsplash.com/?utm_source=bookandgo&utm_medium=referral" target="_blank" rel="noopener">Unsplash</a></small>`:""))}catch{}}
const cards=a=>{const e=add("cards",a.map(x=>`<div class="cc"><div class="im" data-w="${esc(x.w||"")}" data-q="${esc(x.q||"")}" data-img="${esc(x.img||"")}"><i>${x.e||"🌎"}</i>${x.p!=null?`<b>${mx(x.p)}${x.pl||""}</b>`:""}</div><div class="bd"><h4>${esc(x.t)}</h4><p>${esc(x.s)}</p>${x.d?.length?`<ul style="margin:4px 0 0;padding-left:16px;font-size:12px;color:var(--muted)">${x.d.map(l=>`<li style="margin-bottom:4px">${esc(l)}</li>`).join("")}</ul>`:""}<div class="bt2">${x.btn.map(([l,a,i])=>`<button data-a="${a}" data-id="${esc(i)}">${l}</button>`).join("")}</div></div></div>`).join(""));e.querySelectorAll(".im").forEach(pic)};
function sync(){$("td").textContent=S.dest||"Sin destino";$("tb").textContent=S.budget!=null?mx(S.budget):"Por definir";let t=$("tp");if(!t){t=document.createElement("div");t.id="tp";$("tb").parentNode.append(t)}
 t.innerHTML=`<br>🧳 ${S.days||"—"} días · desde ${esc(S.origin||"—")}<br>🏨 ${lab(S.hotel,"n")}<br>✈️ ${lab(S.flight,"a")}<br>💸 Restante: ${S.budget!=null?mx(S.budget-used()):"—"}`}
function save(){const u=window.bg?.auth.currentUser;if(!u)return;const s={};[...K,"mode","cost","home"].forEach(k=>s[k]=S[k]??null);
 bg.set(bg.ref(bg.db,"chats/"+u.uid),JSON.parse(JSON.stringify({m:S.hist.slice(-20),s}))).catch(()=>{})}
function set(k,v){if(k=="dest"&&S.dest&&nz(S.dest)!=nz(v))S.hotel=S.flight=S.plan=S.mode=S.pp=S.cc=0;if(/^(dest|days|origin)$/.test(k))S.rc=0;S[k]=v;S.done=0;sync()}

const RS=()=>{K.forEach(k=>S[k]=0);S.budget=null;S.mode=S.cost=S.pp=S.done=S.askHome=0};
// ---------- Flujo del viaje (no estricto: siempre sabe qué falta) ----------
const Q={dest:["¿A dónde te gustaría ir? Dime un destino o elige un estilo 👇",["💞 Romántico","🌴 Tranquilo","🧗 Aventura","🌍 Internacional"]],
days:["¿Cuántos días durará tu viaje?",["2 días","3 días","5 días","7 días"]],
budget:[()=>`¿Con qué presupuesto cuentas para ${S.dest}? (total, en pesos)`,["💵 $5,000","💵 $10,000","💵 $15,000","💵 $25,000"]],
origin:["¿Desde qué ciudad saldrías?",["📍 CDMX","📍 Guadalajara","📍 Monterrey","📍 Puebla"]],
hotel:["¿Tienes algún hotel en mente?",["🏨 Ver recomendados","Ya tengo hotel","Omitir hotel"]],
flight:[()=>`¿Buscamos tu vuelo desde ${S.origin}?`,["✈️ Ver vuelos","Ya tengo vuelo","Omitir vuelo"]],
plan:["¿Quieres que arme tu itinerario?",["📅 Armar itinerario","Más tarde"]]};
function fin(){if(S.askHome)return;const p=K.find(k=>k=="budget"?S.budget==null:!S[k]);
 if(!p){if(!S.done){S.done=1;sum()}return}
 if(sh==p)return;const[q,c]=Q[p];bot((sh?"📌 Nos quedamos en: ":"")+(typeof q=="function"?q():q));chips(c)}
function sum(){const r=S.budget-used(),h=S.hotel.n?`${esc(S.hotel.n)} · ${mx(S.hotel.p*nts())}`:lab(S.hotel),f=S.flight.a?`${esc(S.flight.a)} · ${mx(S.flight.p)}`:lab(S.flight);
 M.querySelectorAll(".sm").forEach(e=>e.remove());add("it sm",`<div><b>🧳 Resumen</b><span>${esc(S.dest)} · ${nts()} días · desde ${esc(S.origin)}</span></div><div><b>🏨 Hotel</b><span>${h}</span></div><div><b>✈️ Vuelo</b><span>${f}</span></div><div><b>📅 Plan</b><span>${Array.isArray(S.plan)?S.plan.length+" días":"Sin itinerario"}</span></div><div><b>💸 Total</b><span>${mx(used())} de ${mx(S.budget)} ${r<0?"⚠️":"✅"}</span></div><button data-a="ok">✅ Confirmar reserva simulada</button>`);bot(S.flight?.a?"🗺️ ¿Quieres ver cómo llegar desde tu casa al aeropuerto?":"🗺️ ¿Quieres ver cómo llegar?");chips([S.flight?.a?"🗺️ Cómo llegar al aeropuerto":"🗺️ Cómo llegar","✏️ Cambiar algo","🔁 Otras ideas"])}
const AP=o=>/cdmx|ciudad de m[eé]xico|mexico city|df\b/i.test(o)?"Aeropuerto Internacional Benito Juárez, Ciudad de México":"Aeropuerto "+(o||""),
route=(d,t)=>{const h=S.home&&S.home!="gps"?S.home:"",o=h?`&origin=${encodeURIComponent(h)}`:"";add("it",`<div><b>🗺️ ${esc(t)}</b><span>Desde ${h?esc(h):"tu ubicación actual"} (Google Maps)</span></div><div class="ln">${[["🚇 Transporte","transit"],["🚗 Auto","driving"],["🚶 A pie","walking"]].map(([l,m])=>`<a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(d)}${o}&travelmode=${m}" target="_blank" rel="noopener">${l}</a>`).join("")}</div>`)};
function goRoute(){if(!S.dest){bot("Primero dime a dónde quieres ir 🌎");return}
 if(!S.home){S.askHome=1;bot("🏠 ¿Desde dónde sales? Escríbeme tu colonia o dirección (ej. \"Col. Juárez, CDMX\") o usa tu ubicación actual 👇");chips(["📡 Usar mi ubicación actual"]);return 0}
 const air=S.flight?.a||S.flight=="x"||/fly|intl/.test(S.mode),land=/local|road/.test(S.mode)||S.flight=="n";
 if(!air&&!land){bot("¿Cómo viajarás a "+S.dest+"? Así te muestro la ruta correcta 👇");chips(["✈️ Voy en avión","🚗 Voy por tierra"]);return 0}
 if(air){const h=S.flight?.h,e=S.mode=="intl"?3:2;let a="";if(h){const[x,y]=h.split(":").map(Number),t=(x*60+y-e*60+1440)%1440;a=` (≈ ${t/60|0}:${String(t%60).padStart(2,"0")})`}
  bot(`Llega al aeropuerto ${e} h antes de tu vuelo${h?` de las ${h}`:""}${a}. Así llegas 👇`);route(AP(S.origin),"Ruta a tu aeropuerto")}
 else{bot(`Así llegas a ${S.dest} 👇`);route(S.dest,"Ruta a "+S.dest)}}
function mode(){const m=S.mode;S.done=0;
 if(/local|road/.test(m)){if(!S.flight)S.flight="n";if(m=="local"){if(!S.hotel)S.hotel="n";if(!S.days)S.days=1}goRoute()}
 if(m=="intl"&&!S.pp){S.pp=1;bot("🛂 Es un viaje internacional: revisa que tu pasaporte esté vigente y los requisitos de entrada (visa, seguro) del país.")}sync()}
const IA={pv:"PVR",cun:"CUN",oax:"OAX",sc:"TGZ",gto:"BJX",tul:"TQO",bac:"CTM",cdmx:"MEX",mty:"MTY",lap:"LAP"},
oi=o=>{o=nz(o||"");return/cdmx|ciudad de mexico|neza|\bdf\b/.test(o)?"MEX":/guadalajara/.test(o)?"GDL":/monterrey/.test(o)?"MTY":/puebla/.test(o)?"PBC":""},
fd=s=>new Date(s+"T12:00").toLocaleDateString("es-MX",{day:"numeric",month:"short"});
async function real(k,d){try{const u=bg.auth.currentUser;if(!u)return null;
 const r=await(await fetch("/api/"+(k=="hotel"?"hotels":"flights"),{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({token:await u.getIdToken(),dest:d.n,origin:S.origin||"Ciudad de México",days:nts(),cc:find(d.n)?"MX":S.cc||"",dc:IA[d.id]||"",oc:oi(S.origin)})})).json();
 if(r.err)console.warn("API "+k+":",r.err);return r.items?.length?r:null}catch(e){console.warn(e);return null}}
async function showOpts(k){const d=cur();if(!d){bot("Primero dime a dónde quieres ir 🌎");return fin()}
 sh=k;S.rc||={};let L=S.rc[k];
 if(L===undefined){const w=add("m dots","<span></span><span></span><span></span>");L=S.rc[k]=await real(k,d);w.remove()}
 let l;if(L?.items?.length){const n=L.items.length,s=(S.ofs*3)%n;l=[...L.items,...L.items].slice(s,s+3).slice(0,n)}else l=(k=="hotel"?ht:fl)(d);
 S.opt={k,l};
 cards(l.map((o,i)=>k=="hotel"?{w:d.k,img:o.img,e:"🏨",t:o.n,s:`${"★".repeat(o.st)} · ${nts()} noches = ${mx(o.p*nts())}`,p:o.p,pl:"/noche",btn:[["✅ Elegir","sh",i]]}:{e:"✈️",t:o.a,s:`${S.origin||"Tu ciudad"} → ${d.n} · ${o.h||""} · ${o.st==null?(S.mode=="intl"?"internacional":"directo"):o.st?o.st+" escala"+(o.st>1?"s":""):"directo"}`,p:o.p,pl:" redondo",btn:[["✅ Elegir","sh",i]]}));
 say(!L?.items?.length?"ℹ️ Mostrando datos de ejemplo (no pude consultar precios reales ahora).":k=="hotel"?(L.sandbox?"🏨 Datos de prueba de LiteAPI (sandbox): los precios no son reales todavía.":`🏨 Tarifas de LiteAPI para ${fd(L.dep)} – ${fd(L.out)} (2 adultos). Cambian según la fecha.`):`✈️ Precios reales de ${L.src} para salir el ${fd(L.dep)} y volver el ${fd(L.ret)}, 1 persona. Cambian según la fecha.`);
 chips(["🔄 Ver otras opciones"])}
function showPlan(){sh="plan";const d=cur();
 cards(S.plan.map((x,i)=>({w:d?.k,q:`${x.p} ${S.dest}`,e:"📅",t:`Día ${i+1}`+(x.m?`: ${x.t}`:""),s:x.m?(x.c!=null?`≈ ${mx(x.c)} ese día`:""):x.t,d:[x.m&&"🌅 "+x.m,x.a&&"☀️ "+x.a,x.n&&"🌙 "+x.n].filter(Boolean),btn:[["✏️ Cambiar","chg",i]]})));
 if(S.plan.some(x=>x.c!=null)){const tot=S.plan.reduce((a,x)=>a+(+x.c||0),0),rest=S.budget!=null?Math.max(S.budget-used(),0):null;
  say(`💸 Comidas, entradas y transporte local estimados: ${mx(tot)}`+(rest!=null?` de ${mx(rest)} que te sobran ${tot<=rest?"✅":"⚠️"}`:""))}
 chips(["👍 Me gusta","🔁 Otras ideas"])}
const dc=d=>({w:d.k,e:"📍",t:d.n,s:(S.budget?`≈ ${mx(d.c*nts())} por ${nts()} días · `:"")+d.t.split(" ").join(" · "),p:d.c,pl:"/día",btn:[["✅ Elegir","pick",d.id]]});
function sug(m,b){sh="dest";let l=b?[...D].sort((a,c)=>a.c-c.c):D.filter(x=>(!m||x.t.includes(m.slice(0,6)))&&(!S.budget||x.c*nts()<=S.budget));if(!l.length)l=[...D].sort((a,c)=>a.c-c.c);cards(l.slice(0,4).map(dc))}

// ---------- Botones/frases cortas: se resuelven en local (0 tokens) ----------
const mood=t=>(nz(t).match(/romantic|aventura|tranquil|familia|playa|cultura|gastronom|barato|econom/)||[])[0];
function local(t){const n=nz(t),s=t.length<40,m=mood(t);let x;if(!s||/internacional|extranjero/.test(n))return;
 if(/^\$?\s?0$|^(gratis|nada|cero)$/.test(n))return()=>set("budget",0);
 if(x=t.match(/\$\s?([\d,]{3,})/))return()=>set("budget",+x[1].replace(/,/g,""));
 if(x=n.match(/^(\d{1,2}) dias?$/))return()=>set("days",+x[1]);
 if(x=n.match(/^(\d{1,2}|una?|dos) semanas?$/))return()=>set("days",7*({un:1,una:1,dos:2}[x[1]]||+x[1]));
 if(x=t.match(/^📍\s*(.+)$/u))return()=>set("origin",x[1]);
 if(/^(ya tengo|omitir) (hotel|vuelo)/.test(n))return()=>set(/hotel/.test(n)?"hotel":"flight","x");
 if(n=="mas tarde")return()=>set("plan","x");
 if(/ver (hoteles|vuelos|recomendados)$/.test(n))return()=>showOpts(/vuelos/.test(n)?"flight":"hotel");
 if(/voy en avion/.test(n))return()=>{S.mode="fly";sync();return goRoute()};
 if(/voy por tierra/.test(n))return()=>{S.mode="road";if(!S.flight)S.flight="n";sync();return goRoute()};
 if(/como llegar|llegar al aeropuerto/.test(n))return goRoute;
 if(/otras opciones/.test(n))return()=>{S.ofs++;showOpts(S.opt?.k||"hotel")};
 if(/cambiar algo/.test(n))return()=>{bot("Dime qué quieres cambiar: hotel, vuelo, destino, días o presupuesto 😉");chips(["🏨 Ver hoteles","✈️ Ver vuelos","📅 Armar itinerario"]);return 0};
 if(/otro viaje/.test(n))return()=>{RS();sync()};
 if(/me gusta/.test(n)&&Array.isArray(S.plan))return()=>bot("¡Genial! 🎉");
 if(/armar itinerario|crear itinerario|planear un viaje/.test(n))return()=>{if(S.dest&&S.days&&!/planear/.test(n)){send(`Arma mi itinerario de ${nts()} días a ${S.dest}`);return 0}};
 if(m)return()=>{bot(/barato|econom/.test(m)?"Los destinos más económicos 💰":"Estas opciones te pueden gustar ✨");sug(m,/barato|econom/.test(m))}}

function show(r){r.dbg&&console.warn("Gemini:",r.dbg);bot(r.say||"…");
 const lu=[...S.hist].reverse().find(m=>m.r=="u")?.t||"",up=(k,v)=>(v||(k=="budget"&&v===0&&S.budget==null&&/\b0\b|gratis|cero|nada/i.test(lu)))&&v!=S[k]&&set(k,v),i=r.intent;up("dest",r.dest);up("days",r.days);up("budget",r.budget);up("origin",r.origin);if(r.cost)S.cost=r.cost;if(/^[A-Za-z]{2}$/.test(r.cc||""))S.cc=r.cc.toUpperCase();if(r.mode&&r.mode!=S.mode){S.mode=r.mode;mode()}
 if(i=="plan"&&r.plan?.length&&cur()){set("plan",r.plan.slice(0,10).map(x=>({t:String(x.t||"").slice(0,90),p:String(x.p||"").slice(0,60),m:String(x.m||"").slice(0,160),a:String(x.a||"").slice(0,160),n:String(x.n||"").slice(0,160),c:x.c==null||!isFinite(+x.c)?null:Math.max(0,Math.round(+x.c))})));showPlan()}
 else if(i=="hotels"||i=="flights")showOpts(i=="hotels"?"hotel":"flight");
 else if(i=="route")goRoute();
 else if(i=="suggest"){if(r.ideas?.length){sh="dest";cards(r.ideas.slice(0,4).map(n=>({w:String(n).replace(/ /g,"_"),e:"🌍",t:String(n),s:"Destino sugerido",btn:[["✅ Elegir","pickn",n]]})))}else sug(nz(r.mood||""))}
 fin();save()}
async function ai(){const w=add("m dots","<span></span><span></span><span></span>"),p=Array.isArray(S.plan)?S.plan.map((x,i)=>`${i+1}.${x.t}`).join("|"):"?";
 try{const u=bg.auth.currentUser,r=await(await fetch("/api/chat",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({token:await u.getIdToken(),msgs:S.hist.slice(-6),ctx:`Dest:${S.dest||"?"};Días:${S.days||"?"};Presup:${S.budget??"?"};Modo:${S.mode||"?"};Casa:${S.home&&S.home!="gps"?S.home:"?"};Sobrante:${S.budget!=null?S.budget-used():"?"};Pais:${S.cc||"?"};Origen:${S.origin||"?"};Hotel:${S.hotel?.n||(S.hotel?"x":"?")};Vuelo:${S.flight?.a||(S.flight?"x":"?")};Plan:${p}`})})).json();w.remove();show(r)}
 catch{w.remove();say("No pude conectarme 😕 Intenta de nuevo en un momento.")}}

function act(o,b){
 if(o.a=="pick"){const d=D.find(x=>x.id==o.id);set("dest",d.n);bot(`¡${d.n} es una gran elección! 🌴`);fin()}
 else if(o.a=="pickn")send("Quiero ir a "+o.id);
 else if(o.a=="sh"){const k=S.opt.k,x=S.opt.l[o.id],r=S.budget!=null&&S.budget-(k=="hotel"?x.p*nts()+(S.flight?.p||0):x.p+(S.hotel?.p||0)*nts());
  set(k=="hotel"?"hotel":"flight",x);bot(`✅ ${k=="hotel"?"Hotel":"Vuelo"} elegido: ${x.n||x.a} (${mx(k=="hotel"?x.p*nts():x.p)}).`+(S.budget==null?"":r>=0?` Te quedan ${mx(r)}.`:` ⚠️ Te pasas por ${mx(-r)} de tu presupuesto.`));fin()}
 else if(o.a=="chg")send(`Cambia el día ${+o.id+1} por otra actividad`);
 else if(o.a=="ok"){const u=bg.auth.currentUser,c="BG-"+Math.random().toString(36).slice(2,8).toUpperCase();
  bg.set(bg.ref(bg.db,`reservas/${u.uid}/${c}`),JSON.parse(JSON.stringify({dest:S.dest,days:S.days,origen:S.origin,hotel:S.hotel,vuelo:S.flight,plan:S.plan,total:used(),e:"simulada",ts:Date.now()}))).catch(()=>{});
  b.textContent="✔ Reservado";b.disabled=true;bot(`🎉 ¡Reserva simulada confirmada!\nCódigo: ${c}\n${S.dest} · ${nts()} días\nTotal: ${mx(used())}\n(No se cobró nada: es una simulación)`);chips([S.flight?.a?"🗺️ Cómo llegar al aeropuerto":"🗺️ Cómo llegar","🆕 Planear otro viaje"])}
 save()}

function go(t,show){if(S.n++>40)return say("Llegaste al límite de mensajes de esta sesión 🙏 Abre un chat nuevo.");
 say(show||t,1);S.hist.push({r:"u",t:t.slice(0,300)});sh=null;
 if(S.askHome){const g=/ubicaci[oó]n actual/i.test(t);if(!g&&(nz(t).trim()==nz(S.origin||"")||t.trim().length<8)){bot("Necesito algo más específico para trazar tu ruta: tu colonia, calle o un punto de referencia 🏠 (ej. \"Metro Juanacatlán, CDMX\")");chips(["📡 Usar mi ubicación actual"]);save();return}
 S.askHome=0;S.home=/ubicaci[oó]n actual/i.test(t)?"gps":t.slice(0,120);bot(S.home=="gps"?"Perfecto, usaré tu ubicación actual 📡":`Anotado: sales desde ${S.home} 🏠`);goRoute();save();return}
 if(t.length>=40){let x;if(S.budget==null&&(x=t.match(/(?:con|presupuesto(?: de)?|\$)\s*\$?\s*(\d[\d,.]{3,})/i)))set("budget",+x[1].replace(/[,.]/g,""));if(!S.days&&(x=nz(t).match(/(\d{1,2})\s*dias?/)))set("days",+x[1]);if(!S.days&&(x=nz(t).match(/(\d{1,2}|una?|dos)\s*semanas?/)))set("days",7*({un:1,una:1,dos:2}[x[1]]||+x[1]))}
 const l=local(t);l?(l()!==0&&fin(),save()):ai()}
function send(t,show){gate(()=>go(t,show),"Inicia sesión para chatear con Book&Go IA ✨")}

let rs;async function restore(){const u=window.bg?.auth.currentUser;if(!u||rs==u.uid)return;rs=u.uid;
 try{const s=await bg.get(bg.ref(bg.db,"chats/"+u.uid));if(s.exists()&&!S.hist.length){const v=s.val();S.hist=v.m||[];[...K,"mode","cost","home"].forEach(k=>S[k]=v.s?.[k]??(k=="budget"?null:0));S.hist.forEach(m=>say(m.t,m.r=="u"));sync();if(S.dest){sh="r";fin()}}}catch{}}

window.send=send;
window.openChat=()=>{$("chat").classList.add("open");$("fab").style.display="none";$("ci").focus();restore()};
$("fab").onclick=openChat;
$("x").onclick=()=>{$("chat").classList.remove("open","full");$("fab").style.display="";$("ex").textContent="⤢"};
$("ex").onclick=()=>{$("ex").textContent=$("chat").classList.toggle("full")?"⤡":"⤢"};
$("nc").onclick=()=>{[...M.children].slice(1).forEach(n=>n.remove());RS();Object.assign(S,{hist:[],n:0,ofs:0});sync();save()};
$("chat").onclick=e=>{const b=e.target.closest("[data-q]");b&&send(b.dataset.q)};
M.onclick=e=>{const b=e.target.closest("button");if(!b)return;
 if(b.parentNode.classList.contains("chips")){b.parentNode.remove();send(b.textContent)}else if(b.dataset.a)act(b.dataset,b)};
$("ci").maxLength=300;
$("cf").onsubmit=e=>{e.preventDefault();const v=$("ci").value.trim();if(v){$("ci").value="";send(v)}};
})();
