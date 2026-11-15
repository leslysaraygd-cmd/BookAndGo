(()=>{
const $=id=>document.getElementById(id),M=$("msgs"),S={hist:[],n:0,sh:{}},
esc=s=>String(s).replace(/[&<>"']/g,c=>"&#"+c.charCodeAt(0)+";"),
nz=s=>String(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),
H=s=>[...s].reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,7),
mx=p=>"$"+(+p).toLocaleString("es-MX")+" MXN",
// [id, nombre, etiquetas, costo/día MXN, palabras clave de imagen]
D=[["pv","Puerto Vallarta","playa romantico tranquilo",1800,"Puerto_Vallarta"],["cun","Cancún","playa familia aventura",2200,"Cancún"],["oax","Oaxaca","cultura gastronomia tranquilo",1300,"Oaxaca_de_Juárez"],["sc","San Cristóbal","cultura aventura tranquilo",1100,"San_Cristóbal_de_las_Casas"],["gto","Guanajuato","cultura romantico tranquilo",1200,"Guanajuato_(Guanajuato)"],["tul","Tulum","playa romantico aventura",2400,"Tulum"],["bac","Bacalar","tranquilo romantico playa",1500,"Bacalar"],["cdmx","Ciudad de México","cultura gastronomia familia",1500,"Ciudad_de_México"],["mty","Monterrey","aventura familia",1600,"Monterrey"],["lap","La Paz","playa tranquilo aventura",1700,"La_Paz_(Baja_California_Sur)"]].map(([id,n,t,c,k])=>({id,n,t,c,k})),
find=n=>n&&D.find(x=>nz(x.n).includes(nz(n))||nz(n).includes(nz(x.n))),
dc=d=>({w:d.k,e:"📍",t:d.n,s:d.t.split(" ").join(" · "),p:d.c,pl:"/día",btn:[["Itinerario","plan",d.id],["✈️ Vuelos","fl",d.id],["🏨 Hoteles","ht",d.id]]}),
// Simulación determinista de vuelos y hoteles (sin API externa)
fl=d=>["Volaris","Aeroméxico","Viva"].map((a,i)=>({e:"✈️",t:a,s:`Salida ${7+i*4}:${H(a)%6}0 · directo`,p:1300+H(d.id+a)%2700,pl:" ida",btn:[["Reservar","bk",d.id,`Vuelo ${a} → ${d.n}`,1300+H(d.id+a)%2700]]})),
ht=d=>["Casa del Sol","Hotel Brisa","Posada Real"].map((n,i)=>{const p=Math.round(d.c*(.5+i*.45)/50)*50;return{w:d.k,e:"🏨",t:`${n} ${d.n.split(" ")[0]}`,s:"★".repeat(3+i)+" · desayuno incluido",p,pl:"/noche",btn:[["Reservar","bk",d.id,`Hotel ${n} (${d.n})`,p]]}});

const WK={};async function pic(el){const w=el.dataset.w;if(!w)return;try{WK[w]??=fetch("https://es.wikipedia.org/api/rest_v1/page/summary/"+encodeURIComponent(w)).then(r=>r.json()).then(j=>j.thumbnail?.source);const u=await WK[w];u&&el.insertAdjacentHTML("afterbegin",`<img src="${u}" alt="">`)}catch{}}
const add=(c,h)=>{const e=document.createElement("div");e.className=c;e.innerHTML=h;M.append(e);M.scrollTop=1e9;return e};
function say(t,me){const d=document.createElement("div");d.className="m"+(me?" me":"");d.textContent=t;d.dataset.t=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});M.append(d);M.scrollTop=1e9}
const bot=t=>{say(t);S.hist.push({r:"m",t})},
chips=a=>add("chips",a.slice(0,4).map(x=>`<button>${esc(x)}</button>`).join("")),
plan=p=>add("it",p.map((x,i)=>`<div><b>Día ${i+1}</b><span>${esc(x)}</span></div>`).join("")),
cards=a=>{const e=add("cards",a.map(x=>`<div class="cc"><div class="im" data-w="${x.w||""}"><i>${x.e||"🌎"}</i><b>${mx(x.p)}${x.pl||""}</b></div><div class="bd"><h4>${esc(x.t)}</h4><p>${esc(x.s)}</p><div class="bt2">${x.btn.map(([l,a,i,k,p])=>`<button data-a="${a}" data-id="${i}" data-k="${esc(k||"")}" data-p="${p||0}">${l}</button>`).join("")}</div></div></div>`).join(""));e.querySelectorAll(".im").forEach(pic)},
sync=()=>{$("td").textContent=S.dest||"Sin destino";$("tb").textContent=S.budget?mx(S.budget):"Por definir"},
save=()=>{const u=bg.auth.currentUser;u&&bg.set(bg.ref(bg.db,"chats/"+u.uid),{m:S.hist.slice(-20),s:{dest:S.dest||null,days:S.days||null,budget:S.budget||null}}).catch(()=>{})};

// Botones y frases cortas se resuelven en local: 0 tokens
const mood=t=>(nz(t).match(/romantic|aventura|tranquil|familia|playa|cultura|gastronom|barato|econom/)||[])[0];
function local(t){const m=mood(t),n=nz(t),f=/vuelo|hotel/.exec(n),d=find(S.dest);
 if(t.length<40&&m)return()=>{const b=/barato|econom/.test(m);bot(b?"Los destinos más económicos 💰":"Estas opciones te pueden gustar ✨");cards((b?[...D].sort((a,c)=>a.c-c.c):D.filter(x=>x.t.includes(m.slice(0,6)))).slice(0,4).map(dc));chips(["📅 Crear itinerario","🏖️ Playas"])};
 if(t.length<30&&/planear un viaje|crear itinerario/.test(n))return()=>{bot(d?`¿Cuántos días vas a ${S.dest}?`:"¿A dónde te gustaría ir? Si no sabes, elige un estilo 👇");chips(d?["2 días","3 días","5 días","7 días"]:["💞 Romántico","🌴 Tranquilo","🧗 Aventura","👪 Familia"])};
 if(f&&d&&t.length<30)return()=>act({a:f[0]=="vuelo"?"fl":"ht",id:d.id})}

function show(r){r.dbg&&console.warn('Gemini:',r.dbg);bot(r.say||"…");if(r.dest)S.dest=r.dest;if(r.days)S.days=r.days;if(r.budget)S.budget=r.budget;sync();
 const d=find(r.dest)||find(S.dest);
 if(r.intent=="plan"&&r.plan?.length){plan(r.plan);d&&chips(["✈️ Ver vuelos","🏨 Ver hoteles"])}
 else if(r.intent=="flights"&&d)act({a:"fl",id:d.id});
 else if(r.intent=="hotels"&&d)act({a:"ht",id:d.id});
 else if(r.intent=="suggest"){const m=nz(r.mood||""),l=D.filter(x=>m&&x.t.includes(m.slice(0,6))).slice(0,4);cards((l.length?l:D.slice(0,4)).map(dc))}
 else if(r.intent!="off"&&find(r.dest)&&!S.sh[d.id]){S.sh[d.id]=1;cards([dc(d)])}
 r.chips?.length&&chips(r.chips);save()}

async function ai(){const w=add("m dots","<span></span><span></span><span></span>");
 try{const u=bg.auth.currentUser,r=await(await fetch("/api/chat",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({token:await u.getIdToken(),msgs:S.hist.slice(-6),ctx:`Destino:${S.dest||"?"};días:${S.days||"?"};presupuesto:${S.budget||"?"}`})})).json();w.remove();show(r)}
 catch{w.remove();say("No pude conectarme 😕 Intenta de nuevo en un momento.")}}

function act(o,b){const d=D.find(x=>x.id==o.id);
 if(o.a=="plan"){S.dest=d.n;sync();send(`Itinerario de ${S.days||3} días a ${d.n}`)}
 else if(o.a=="fl"||o.a=="ht"){S.dest=d.n;sync();cards((o.a=="fl"?fl:ht)(d))}
 else if(o.a=="bk"){const u=bg.auth.currentUser,c="BG-"+Math.random().toString(36).slice(2,8).toUpperCase();
  bg.set(bg.ref(bg.db,`reservas/${u.uid}/${c}`),{d:o.k,p:+o.p,e:"simulada",ts:Date.now()}).catch(()=>{});
  if(b){b.textContent="✔ Reservado";b.disabled=true}
  bot(`✅ Reserva simulada confirmada\n${o.k}\nTotal: ${mx(o.p)}\nCódigo: ${c}\n(No se cobró nada: es una simulación)`);chips(["🏨 Ver hoteles","✈️ Ver vuelos","📅 Crear itinerario"]);save()}}

function go(t,show){if(S.n++>40)return say("Llegaste al límite de mensajes de esta sesión 🙏 Abre un chat nuevo.");
 say(show||t,1);S.hist.push({r:"u",t:t.slice(0,300)});const l=local(t);l?(l(),save()):ai()}
function send(t,show){gate(()=>go(t,show),"Inicia sesión para chatear con Book&Go IA ✨")}

let rs;async function restore(){const u=window.bg?.auth.currentUser;if(!u||rs==u.uid)return;rs=u.uid;
 try{const s=await bg.get(bg.ref(bg.db,"chats/"+u.uid));if(s.exists()&&!S.hist.length){const v=s.val();S.hist=v.m||[];Object.assign(S,v.s||{});S.hist.forEach(m=>say(m.t,m.r=="u"));sync()}}catch{}}

window.send=send;
window.openChat=()=>{$("chat").classList.add("open");$("fab").style.display="none";$("ci").focus();restore()};
$("fab").onclick=openChat;
$("x").onclick=()=>{$("chat").classList.remove("open","full");$("fab").style.display="";$("ex").textContent="⤢"};
$("ex").onclick=()=>{$("ex").textContent=$("chat").classList.toggle("full")?"⤡":"⤢"};
$("nc").onclick=()=>{[...M.children].slice(1).forEach(n=>n.remove());Object.assign(S,{hist:[],n:0,sh:{},dest:null,days:null,budget:null});sync();save()};
$("chat").onclick=e=>{const b=e.target.closest("[data-q]");b&&send(b.dataset.q)};
M.onclick=e=>{const b=e.target.closest("button");if(!b)return;
 if(b.parentNode.classList.contains("chips")){b.parentNode.remove();send(b.textContent)}else if(b.dataset.a)act(b.dataset,b)};
$("ci").maxLength=300;
$("cf").onsubmit=e=>{e.preventDefault();const v=$("ci").value.trim();if(v){$("ci").value="";send(v)}};
})();
