/* Tracking do funil — Rasga Xana / Método Rasga Xana
   Gera session id, dispara view / answer / click / checkout_click para a API e
   mantém backup local. Usa fetch no-cors + text/plain (evita preflight CORS).

   A/B de PREÇO ENCERRADO (2026-07-10): preço oficial único = R$34,90 (checkout B).
   `abPick()` sempre retorna 'B'; o campo `ab='B'` segue nos eventos por continuidade. */
(function(){
  /* Backend de analytics (Supabase Edge Function rx-api) */
  var GAS = 'https://nyuycffqncuavzuhyofq.supabase.co/functions/v1/rx-api';

  /* ===== A/B de preço ===== */
  var CHECKOUT_A = 'https://checkout.payt.com.br/c/L9OX3O';   // Variante A — R$29,90
  var CHECKOUT_B = 'https://checkout.payt.com.br/c/LPV9AK';   // Variante B — R$34,90
  var PRICE_A = 29.90, PRICE_B = 34.90;
  /* A/B ENCERRADO (2026-07-10): preço oficial único = R$34,90 (variante B).
     Mantido o rótulo ab='B' nos eventos pra continuidade dos dados históricos. */
  function abPick(){ return 'B'; }
  var AB = abPick();
  function checkoutUrl(){ return AB==='B' ? CHECKOUT_B : CHECKOUT_A; }
  function checkoutPrice(){ return AB==='B' ? PRICE_B : PRICE_A; }

  function uid(){ return 'xxxxxxxx'.replace(/x/g,function(){return (Math.random()*16|0).toString(16);})+Date.now().toString(36); }
  function sid(){ var k='rx_sid'; var v=localStorage.getItem(k); if(!v){ v=uid(); try{ localStorage.setItem(k,v); }catch(x){} } return v; }
  function cookie(n){ var m=document.cookie.match('(^|;)\\s*'+n+'\\s*=\\s*([^;]+)'); return m?m.pop():''; }
  function setCookie(n,v){ try{ document.cookie = n+'='+v+'; path=/; max-age=7776000; SameSite=Lax'; }catch(x){} }  // 90 dias
  function qp(n){ try{ return new URLSearchParams(location.search).get(n)||''; }catch(x){ return ''; } }

  /* ---- identificadores da Meta (fbp/fbc) ----------------------------------
     O fbevents.js grava esses cookies de forma assíncrona — e some de vez quando
     é bloqueado por adblock/ITP. O track.js lia o cookie antes de existir, então
     a CAPI (server-side) saía sem fbc (0% dos eventos) e quase sempre sem fbp.
     Aqui a gente garante os dois no formato oficial (fb.1.<ts>.<id>) e grava o
     cookie: se o pixel carregar depois, ele reaproveita o mesmo valor. */
  function ensureFbp(){
    var v = cookie('_fbp');
    if(!v){ v = 'fb.1.'+Date.now()+'.'+Math.floor(Math.random()*1e10); setCookie('_fbp', v); }
    return v;
  }
  function ensureFbc(){
    var v = cookie('_fbc');
    if(v){ try{ localStorage.setItem('rx_fbc', v); }catch(x){} return v; }
    var cl = qp('fbclid');
    if(cl){                                   // clique de anúncio: monta o fbc agora
      v = 'fb.1.'+Date.now()+'.'+cl;
      setCookie('_fbc', v);
      try{ localStorage.setItem('rx_fbc', v); }catch(x){}
      return v;
    }
    try{ return localStorage.getItem('rx_fbc')||''; }catch(x){ return ''; }  // páginas seguintes do funil
  }
  var FBP = ensureFbp(), FBC = ensureFbc();
  function backup(e){ try{ var a=JSON.parse(localStorage.getItem('rx_ev')||'[]'); a.push(e); if(a.length>500)a=a.slice(-500); localStorage.setItem('rx_ev',JSON.stringify(a)); }catch(x){} }
  function seen(key){ var k='rx_seen_'+sid()+'_'+key; if(localStorage.getItem(k))return true; try{localStorage.setItem(k,'1');}catch(x){} return false; }

  function send(ev, p){
    p = p||{};
    var e = {
      ev: ev, s: sid(),
      step: (p.step!=null ? p.step : ''),
      name: p.name||'', ans: p.ans||'', ms: p.ms||0,
      ref: document.referrer||'', ua: navigator.userAgent, url: location.href,
      event_id: p.event_id || uid(), fbp: cookie('_fbp')||FBP, fbc: cookie('_fbc')||FBC, ab: AB
    };
    backup(e);
    if(!GAS || /COLE_AQUI/.test(GAS)) return;   // ainda sem backend: só backup local
    try{ fetch(GAS, { method:'POST', mode:'no-cors', keepalive:true, headers:{'Content-Type':'text/plain;charset=UTF-8'}, body: JSON.stringify(e) }); }catch(x){}
  }

  /* dispara evento padrão da Meta (Pixel) SE ele estiver carregado na página.
     eid = MESMO event_id enviado ao backend → a CAPI (server) manda o mesmo id
     e a Meta deduplica navegador+servidor em vez de contar em dobro. */
  function fbTrack(ev, p, eid){ if(window.fbq){ try{ fbq('track', ev, p||{}, eid?{eventID:eid}:undefined); }catch(x){} } }

  /* ---- UTMs: captura na entrada, persiste e repassa pelo funil ---- */
  function utmRelevant(k){ k=(k||'').toLowerCase(); return /^utm_/.test(k) || ['fbclid','gclid','ttclid','sck','src','xcod','utm_id'].indexOf(k)>-1; }
  function utmCapture(){
    try{
      var cur={}, p=new URLSearchParams(location.search);
      p.forEach(function(v,k){ if(v && utmRelevant(k)) cur[k]=v; });
      var hasNew=false; for(var n in cur){ if(/^utm_/i.test(n)){ hasNew=true; break; } }
      if(hasNew){ localStorage.setItem('rx_utms', JSON.stringify(cur)); return cur; }   // clique novo = last-click
      var stored={}; try{ stored=JSON.parse(localStorage.getItem('rx_utms')||'{}'); }catch(e){}
      for(var j in cur) stored[j]=cur[j];
      return stored;
    }catch(x){ return {}; }
  }
  var _utms = utmCapture();
  function utmQS(){ var a=[]; for(var k in _utms){ if(_utms[k]!=null && _utms[k]!==''){ a.push(encodeURIComponent(k)+'='+encodeURIComponent(_utms[k])); } } return a.join('&'); }
  function utmAppend(url){ var qs=utmQS(); if(!qs||!url) return url; var hash='',h=url.indexOf('#'); if(h>-1){ hash=url.slice(h); url=url.slice(0,h); } url += (url.indexOf('?')>-1?'&':'?')+qs; return url+hash; }
  window.rxUtm = { get:function(){ return _utms; }, qs:utmQS, append:utmAppend };

  /* url/value refletem a variante sorteada; a PV lê rxCheckout.url pra injetar nos CTAs. */
  window.rxCheckout = { url: checkoutUrl(), value: checkoutPrice(), ab: AB };

  var _viewed = {};  // dedup de view por CARREGAMENTO de página (não persiste — cada nova visita reconta)
  window.rxTrack = {
    getAb:    function(){ return AB; },
    view:     function(step){ var vk='v'+step; if(_viewed[vk]) return; _viewed[vk]=1; var eid=uid(); send('view', {step:step, event_id:eid});
                 if(String(step)==='diagnostico') fbTrack('Lead', null, eid);            // concluiu o quiz
                 else if(String(step)==='pv')      fbTrack('ViewContent', null, eid); }, // abriu a página de vendas
    answer:   function(step,text,ms){ send('answer', {step:step, ans:text, ms:ms}); },
    click:    function(step,label,ms){ send('click', {step:step, name:label||'Botão', ms:ms}); },
    checkout: function(label){ var eid=uid(); send('checkout_click', {name:label||'CTA', event_id:eid}); fbTrack('InitiateCheckout', {value:checkoutPrice(), currency:'BRL'}, eid); }
  };
})();
