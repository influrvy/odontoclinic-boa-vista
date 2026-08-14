"use client";

import { FormEvent, useEffect, useState } from "react";

const whatsapp = "https://api.whatsapp.com/send/?phone=5595991203397";
const checkout = "https://influrbusiness.com.br/comprar";
const organizationId = process.env.NEXT_PUBLIC_INFLUR_ORGANIZATION_ID;
const siteKey = process.env.NEXT_PUBLIC_INFLUR_SITE_KEY;
const showPurchase = process.env.NEXT_PUBLIC_SHOW_PURCHASE !== "false";

function Arrow() { return <span aria-hidden="true">↗</span>; }

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [dark, setDark] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [sound, setSound] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [cursor, setCursor] = useState({ x: -80, y: -80, active: false });

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    document.documentElement.dataset.reduced = reduced ? "true" : "false";
  }, [dark, reduced]);
  useEffect(() => {
    const reveal = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("inview"); }), { threshold: .12 });
    document.querySelectorAll(".reveal").forEach((el) => reveal.observe(el));
    const move = (event: MouseEvent) => setCursor((current) => ({ ...current, x: event.clientX, y: event.clientY }));
    const enter = () => setCursor((current) => ({ ...current, active: true })); const leave = () => setCursor((current) => ({ ...current, active: false }));
    window.addEventListener("mousemove", move); document.querySelectorAll("a,button,.service-card").forEach((el) => { el.addEventListener("mouseenter", enter); el.addEventListener("mouseleave", leave); });
    return () => { reveal.disconnect(); window.removeEventListener("mousemove", move); };
  }, []);

  function clickSound() {
    if (!sound || typeof AudioContext === "undefined") return;
    const ctx = new AudioContext(); const o = ctx.createOscillator(); const g = ctx.createGain();
    o.frequency.value = 740; g.gain.setValueAtTime(.025, ctx.currentTime); g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .08);
    o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + .08);
  }
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setStatus("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const payload = JSON.stringify({ ...data, organization_id: organizationId, site_key: siteKey, source: "website" });
      const responses = await Promise.all(["leads", "appointments"].map((type) => fetch(`https://influrbusiness.com.br/api/public/${type}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: payload })));
      if (responses.some((response) => !response.ok)) throw new Error();
      setStatus("done"); e.currentTarget.reset(); clickSound();
    } catch { setStatus("error"); }
  }
  return <main><div className={`cursor ${cursor.active ? "cursor-active" : ""}`} style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }} aria-hidden="true"><i /></div>
    <header className="header"><a className="brand" href="#inicio" aria-label="Odontoclinic Boa Vista"><span className="brand-mark">o</span><span>odonto<strong>clinic</strong><small>BOA VISTA</small></span></a>
      <nav className={menu ? "open" : ""}><a href="#sobre">A clínica</a><a href="#tratamentos">Tratamentos</a><a href="#contato">Contato</a><a className="nav-cta" href={whatsapp} target="_blank" rel="noreferrer" onClick={clickSound}>Agendar avaliação <Arrow /></a></nav>
      <button className="menu" onClick={() => setMenu(!menu)} aria-label="Abrir menu">{menu ? "×" : "☰"}</button></header>

    <section className="hero" id="inicio"><div className="hero-copy reveal"><p className="eyebrow">ODONTOLOGIA EM BOA VISTA · RR</p><h1>Seu sorriso merece um cuidado <em>extraordinário.</em></h1><p className="lead">Atendimento odontológico humano, preciso e pensado para você se sentir bem em cada etapa.</p><div className="actions"><a className="button" href={whatsapp} target="_blank" rel="noreferrer" onClick={clickSound}>Agende sua avaliação <Arrow /></a><a className="text-link" href="#tratamentos">Conheça a clínica <span>↓</span></a></div></div><div className="hero-image reveal"><img src="https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1200&q=85" alt="Atendimento odontológico acolhedor"/><div className="floating">Cuidado que<br/><strong>transforma</strong></div></div></section>

    <section className="intro reveal" id="sobre"><p className="eyebrow">A ODONTOCLINIC</p><div><h2>Mais do que cuidar dos dentes, cuidamos de pessoas.</h2><p>Um espaço feito para tornar sua jornada odontológica mais tranquila, com escuta, transparência e atenção aos detalhes.</p><a href={whatsapp} target="_blank" rel="noreferrer" className="under">Falar com a equipe <Arrow /></a></div></section>

    <section className="services" id="tratamentos"><div className="section-head reveal"><p className="eyebrow">CUIDADOS PARA O SEU SORRISO</p><h2>Tratamentos que unem saúde, estética e bem-estar.</h2><p>Conheça as possibilidades e converse com nossa equipe para entender o melhor caminho para você.</p></div><div className="service-grid">
      {[['Prevenção e rotina','Acompanhamento e cuidados para manter sua saúde bucal em dia.'],['Estética do sorriso','Soluções personalizadas para um sorriso que combina com você.'],['Reabilitação oral','Planejamento cuidadoso para devolver conforto e função.'],['Odontologia para a família','Atenção acolhedora para diferentes fases da vida.']].map(([title,text], i)=><article className="service-card reveal" key={title}><span>0{i+1}</span><h3>{title}</h3><p>{text}</p><a href={whatsapp} target="_blank" rel="noreferrer" aria-label={`Saiba mais sobre ${title}`}>→</a></article>)}</div></section>

    <section className="care"><div className="care-image reveal"><img src="https://images.unsplash.com/photo-1606265752439-1f18756aa2b6?auto=format&fit=crop&w=1000&q=85" alt="Consultório odontológico moderno"/></div><div className="care-copy reveal"><p className="eyebrow">ATENDIMENTO COM PROPÓSITO</p><h2>Clareza, conforto e presença em cada escolha.</h2><div className="steps"><p><b>01</b><span><strong>Escutamos você</strong>Antes de qualquer plano, entendemos seus objetivos e necessidades.</span></p><p><b>02</b><span><strong>Planejamos juntos</strong>Você entende cada etapa e toma decisões com segurança.</span></p><p><b>03</b><span><strong>Cuidamos com leveza</strong>Uma experiência atenciosa do primeiro contato ao acompanhamento.</span></p></div></div></section>

    <section className="reviews" id="avaliacoes"><div className="section-head reveal"><p className="eyebrow">EXPERIÊNCIAS REAIS</p><h2>A confiança se constrói em cada atendimento.</h2><p>Esta área está pronta para receber avaliações autorizadas de pacientes e dados verificados do Google.</p></div><div className="review-empty reveal"><span>✦</span><div><h3>Depoimentos em breve</h3><p>Para preservar a transparência, não publicamos avaliações sem confirmação do cliente. Assim que forem enviadas, elas aparecem aqui.</p></div><a className="under" href={whatsapp} target="_blank" rel="noreferrer">Compartilhar uma experiência <Arrow /></a></div></section>

    <section className="faq"><div className="reveal"><p className="eyebrow">DÚVIDAS FREQUENTES</p><h2>Informação também é uma forma de cuidado.</h2></div><div className="faq-list reveal"><details><summary>Como funciona o primeiro atendimento?<span>+</span></summary><p>Você conversa com a equipe para entender as opções de avaliação e o melhor horário disponível.</p></details><details><summary>Posso tirar dúvidas antes de agendar?<span>+</span></summary><p>Sim. Chame a equipe pelo WhatsApp e receba orientação para o seu primeiro passo.</p></details><details><summary>Onde encontro a clínica?<span>+</span></summary><p>Na seção de contato, você encontra o mapa integrado e acesso à localização pelo Google Maps.</p></details></div></section>

    <section className="booking" id="agendamento"><div className="booking-copy reveal"><p className="eyebrow">PRONTO PARA COMEÇAR?</p><h2>Reserve um momento para cuidar do seu sorriso.</h2><p>Envie seus dados. Nossa equipe retorna para alinhar a melhor data e horário.</p></div><form className="reveal" onSubmit={submit}><label>Seu nome<input required name="name" placeholder="Como podemos chamar você?" /></label><label>WhatsApp<input required name="phone" type="tel" placeholder="(00) 00000-0000" /></label><label>O que você procura?<select name="interest"><option>Quero agendar uma avaliação</option><option>Tenho uma dúvida</option><option>Quero saber sobre tratamentos</option></select></label><button className="button" disabled={status === "sending"}>{status === "sending" ? "Enviando..." : "Solicitar agendamento"} <Arrow /></button>{status === "done" && <p className="form-status success">Recebemos seu pedido. Em breve a equipe entra em contato.</p>}{status === "error" && <p className="form-status">Não foi possível enviar agora. Fale conosco pelo WhatsApp.</p>}<small>Ao enviar, você concorda em ser contatado pela equipe.</small></form></section>

    <section className="contact" id="contato"><div className="contact-info reveal"><p className="eyebrow">ENCONTRE A GENTE</p><h2>Odontoclinic<br/>Boa Vista</h2><a className="under" href="https://www.google.com/maps/place/Odontoclinic+-+Boa+Vista/@2.8282457,-60.6694354,17z" target="_blank" rel="noreferrer">Ver localização no mapa <Arrow /></a><p className="contact-note">Para confirmar endereço, horários e disponibilidade, fale com nossa equipe pelo WhatsApp.</p><a className="button light" href={whatsapp} target="_blank" rel="noreferrer">Chamar no WhatsApp <Arrow /></a></div><div className="map reveal"><iframe title="Mapa da Odontoclinic Boa Vista" src="https://www.google.com/maps/embed?pb=!4v1786736528563!6m8!1m7!1shk0gFB1_PR7BoGoqmxinCA!2m2!1d2.828129329765923!2d-60.66965940219922!3f184.23119690885363!4f5.381144740530857!5f1.5804932749593585" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div></section>

    {showPurchase && <section className="purchase"><p>Este é um projeto Influr Business.</p><a href={checkout} target="_blank" rel="noreferrer">Quero este site <Arrow /></a></section>}
    <footer><a className="brand" href="#inicio"><span className="brand-mark">o</span><span>odonto<strong>clinic</strong><small>BOA VISTA</small></span></a><p>© {new Date().getFullYear()} Odontoclinic Boa Vista. Todos os direitos reservados.</p><div><button onClick={() => setDark(!dark)} aria-label="Alternar aparência">{dark ? "☀" : "◐"}</button><button onClick={() => setReduced(!reduced)} aria-label="Reduzir animações">◌</button><button onClick={() => setSound(!sound)} aria-label="Ativar ou desativar sons">{sound ? "♫" : "♩"}</button></div></footer>
  </main>;
}
