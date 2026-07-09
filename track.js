/* Tracking do funil — Rasga Xana / Método Rasga Xana
   Gera session id, dispara view / answer / click / checkout_click para a API e
   mantém backup local. Usa fetch no-cors + text/plain (evita preflight CORS).
   Sem A/B (preço único) — ver decisão "no-ab-tests". */
(function(){
  /* Backend de analytics (Supabase Edge Function rx-api) */
  var GAS = 'https://nyuycffqncuavzuhyofq.supabase.co/functions/v1/rx-api';

  /* Checkout único. [CHECKOUT] trocar pelo link real (Payt/Kiwify/Cakto) quando existir. */
  var CHECKOUT = '#';
  var PRICE = 29.90;

  function uid(){ return 'xxxxxxxx'.replace(/x/g,function(){return (Math.random()*16|0).toString(16);})+Date.now().toString(36); }
  function sid(){ var k='rx_sid'; var v=localStorage.getItem(k); if(!v){ v=uid(); try{ localStorage.setItem(k,v); }catch(x){} } return v; }
  function cookie(n){ var m=document.cookie.match('(^|;)\\s*'+n+'\\s*=\\s*([^;]+)'); return m?m.pop():''; }
  function backup(e){ try{ var a=JSON.parse(localStorage.getItem('rx_ev')||'[]'); a.push(e); if(a.length>500)a=a.slice(-500); localStorage.setItem('rx_ev',JSON.stringify(a)); }catch(x){} }
  function seen(key){ var k='rx_seen_'+sid()+'_'+key; if(localStorage.getItem(k))return true; try{localStorage.setItem(k,'1');}catch(x){} return false; }

  function send(ev, p){
    p = p||{};
    var e = {
      ev: ev, s: sid(),
      step: (p.step!=null ? p.step : ''),
      name: p.name||'', ans: p.ans||'', ms: p.ms||0,
      ref: document.referrer||'', ua: navigator.userAgent, url: location.href,
      event_id: p.event_id || uid(), fbp: cookie('_fbp'), fbc: cookie('_fbc'), ab: ''
    };
    backup(e);
    if(!GAS || /COLE_AQUI/.test(GAS)) return;   // ainda sem backend: só backup local
    try{ fetch(GAS, { method:'POST', mode:'no-cors', keepalive:true, headers:{'Content-Type':'text/plain;charset=UTF-8'}, body: JSON.stringify(e) }); }catch(x){}
  }

  /* dispara evento padrão da Meta (Pixel) SE ele estiver carregado na página.
     eid = MESMO event_id enviado ao backend → a CAPI (server) manda o mesmo id
     e a Meta deduplica navegador+servidor em vez de contar em dobro.
     (Sem pixel do Rasga Xana por enquanto — fica inerte até o fbq existir.) */
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

  window.rxCheckout = { url: CHECKOUT, value: PRICE };

  window.rxTrack = {
    view:     function(step){ if(seen('v'+step)) return; var eid=uid(); send('view', {step:step, event_id:eid});
                 if(String(step)==='diagnostico') fbTrack('Lead', null, eid);            // concluiu o quiz
                 else if(String(step)==='pv')      fbTrack('ViewContent', null, eid); }, // abriu a página de vendas
    answer:   function(step,text,ms){ send('answer', {step:step, ans:text, ms:ms}); },
    click:    function(step,label,ms){ send('click', {step:step, name:label||'Botão', ms:ms}); },
    checkout: function(label){ var eid=uid(); send('checkout_click', {name:label||'CTA', event_id:eid}); fbTrack('InitiateCheckout', {value:PRICE, currency:'BRL'}, eid); }
  };
})();
