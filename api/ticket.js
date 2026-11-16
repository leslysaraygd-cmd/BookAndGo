// Vercel Serverless: envía el comprobante (PDF) al correo del usuario con sesión.
// Variables de entorno: RESEND_API_KEY (obligatoria), MAIL_FROM (opcional, ej. "Book&Go IA <reservas@tudominio.com>").
const FB=process.env.FIREBASE_API_KEY||"AIzaSyBY0KCEgBwrKV02kiFTGZLtWOxO9ozzSso"; // pública por diseño
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>"&#"+c.charCodeAt(0)+";");

module.exports=async(req,res)=>{
  if(req.method!=="POST")return res.status(405).end();
  const b=req.body||{};
  if(!b.token)return res.status(401).json({err:"auth"});
  // El destinatario sale de la cuenta verificada, nunca del cliente: solo puede enviarse a sí mismo.
  let u;
  try{
    const r=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FB}`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({idToken:b.token})});
    if(!r.ok)return res.status(401).json({err:"auth"});
    u=(await r.json()).users?.[0];
  }catch{return res.status(502).json({err:"auth"})}
  if(!u?.email||!u.emailVerified)return res.status(403).json({err:"correo no verificado"});
  const key=process.env.RESEND_API_KEY;
  if(!key)return res.status(500).json({err:"correo no configurado"});
  const code=String(b.code||"");
  const pdf=String(b.pdf||"");
  if(!/^BG-[A-Z0-9]{6}$/.test(code)||!/^JVBER[A-Za-z0-9+\/=]+$/.test(pdf)||pdf.length>900000)return res.status(400).json({err:"datos inválidos"});
  const name=esc(String(b.name||"viajero").slice(0,40)),dest=esc(String(b.dest||"").slice(0,80)),total=esc(String(b.total??"").slice(0,20));
  try{
    const r=await fetch("https://api.resend.com/emails",{method:"POST",headers:{"content-type":"application/json",authorization:"Bearer "+key},body:JSON.stringify({
      from:process.env.MAIL_FROM||"Book&Go IA <onboarding@resend.dev>",
      to:[u.email],
      subject:`Tu comprobante Book&Go IA ${code}`,
      html:`<div style="font-family:Segoe UI,Arial,sans-serif;max-width:520px;margin:auto;color:#111827">
        <h2 style="color:#7c5cff;margin:0 0 12px">Book&amp;Go IA</h2>
        <p>Hola, ${name}. Aquí tienes el comprobante de tu reserva a <b>${dest}</b>.</p>
        <p>Código: <b>${esc(code)}</b><br>Total: <b>$${Number(total).toLocaleString("es-MX")} MXN</b></p>
        <p>El PDF va adjunto.</p>
        <p style="font-size:12px;color:#6b7280">Modo demostración: este comprobante no es un boleto ni una confirmación de hotel, y no se realizó ningún cargo real.</p></div>`,
      attachments:[{filename:`Comprobante-${code}.pdf`,content:pdf}]
    })});
    if(!r.ok){const j=await r.json().catch(()=>({}));console.error("resend",r.status,j);return res.status(502).json({err:String(j.message||r.status).slice(0,150)})}
    res.json({ok:1});
  }catch(e){console.error(e);res.status(502).json({err:"envío"})}
};