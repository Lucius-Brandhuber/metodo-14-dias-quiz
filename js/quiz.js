/* ===========================================================
   Método Rasga Xana — Quiz engine (27 etapas)
   Réplica fiel do funil de referência, design unificado.
   Placeholders (.img-ph) marcam onde entram as imagens do usuário.
   =========================================================== */
(function () {
  "use strict";

  // Para onde o quiz leva ao final (página de vendas — ainda vazia).
  var PV_URL = "pv/";

  /* ---------- helper de imagem de conteúdo ---------- */
  function img(src, alt, cls) {
    return '<img class="content-img' + (cls ? " " + cls : "") + '" src="' + src + '" alt="' + (alt || "") + '" loading="lazy" decoding="async" />';
  }

  /* =========================================================
     DADOS DAS 27 ETAPAS
     ========================================================= */
  var STEPS = [
    // 1 — Engajamento: idade
    {
      type: "age",
      title: 'Programa de exercícios para elevar sua <span class="hl">potência sexual</span>',
      sub: "Quiz de 1 minuto",
      options: [
        { label: "18 - 30 anos", img: "imagens/img1.webp" },
        { label: "31 - 45 anos", img: "imagens/img2.webp" },
        { label: "46 - 55 anos", img: "imagens/img3.webp" },
        { label: "+ 56 anos", img: "imagens/img4.webp" }
      ],
      note: "Ao escolher sua idade e continuar, você concorda com nossos Termos de Serviço | Política de Privacidade"
    },

    // 2 — Prova social
    {
      type: "content",
      title: '<span class="hl">Mais de 1 milhão de homens brasileiros..</span>',
      sub: "escolheram o Método Rasga Xana em 2026",
      blocks: [img("imagens/img5.webp", "Evolução dos exercícios — DIA 1 / DIA 14 / DIA 24")],
      note: "Nós ajudamos mais de <b>150.000 homens</b> a melhorar seu desempenho sexual.",
      btn: "Continuar"
    },

    // 3 — Tipo de corpo
    {
      type: "imageOptions",
      title: "Escolha seu tipo de corpo",
      options: [
        { label: "Magro", img: "imagens/img6.webp" },
        { label: "Médio/Forte", img: "imagens/img7.webp" },
        { label: "Acima do Peso", img: "imagens/img8.webp" }
      ],
      btn: "Continuar"
    },

    // 4 — Notícia (mecanismo Kegel)
    {
      type: "content",
      title: 'O método <span class="hl">100% natural</span> para vencer a ejaculação precoce',
      blocks: [img("imagens/img9.webp", "Notícia: Exercícios de Kegel — o segredo para ereções mais firmes")],
      note: "Feito 5 minutos em casa, sem equipamento, sem remédios. Resultados comprovados em 14 dias.",
      btn: "Continuar"
    },

    // 5 — Objetivos (multi)
    {
      type: "multiSelect",
      title: "Escolha seus objetivos",
      sub: "Selecione todos os que se aplicam",
      options: ["Durar mais durante o sexo", "Ter orgasmos mais intensos", "Ter ereções mais firmes"],
      btn: "Continuar"
    },

    // 6 — Educação: força do músculo
    {
      type: "content",
      lead:
        "Seu jeito de durar mais tempo vem da força e saúde dos músculos do assoalho pélvico." +
        "<br><br>E quanto mais você envelhece, mais fraco fica seu músculo masculino." +
        "<br><br>Músculos fortes ajudam você a ter ereções duras novamente, controlar a ejaculação e a durar mais na cama.",
      blocks: [img("imagens/img10.webp", "Comparativo dia 1 / dia 7 / dia 14 / dia 28")],
      btn: "Continuar"
    },

    // 7 — Problema: duração
    {
      type: "single",
      title: "Quanto tempo, em média, dura sua relação sexual?",
      options: ["Menos de 2 minutos", "De 2 a 7 minutos", "De 7 a 15 minutos", "Mais de 15 minutos"]
    },

    // 8 — Problema: ejaculação
    {
      type: "single",
      title: "Com que frequência você ejacula antes do que gostaria?",
      sub: "Escolhe uma opção para avançar",
      options: ["Nunca", "Às vezes", "Na maior parte das vezes"]
    },

    // 9 — Escala: controle da ejaculação
    {
      type: "scale",
      title: "Quanto é difícil para você controlar a ejaculação durante o sexo?",
      sub: "De 1 (baixo) a 5 (alto)",
      ends: ["Baixo", "Alto"]
    },

    // 10 — Notícia: contra pílulas
    {
      type: "content",
      blocks: [img("imagens/img11.webp", "Notícia: mortes por infarto ligadas a azulzinho/tadalafila")],
      title: '<span class="hl">Não arrisque sua saúde com soluções temporárias.</span>',
      note: "Continue para receber o <b>protocolo natural</b> mais indicado para sua idade e baseado nas suas respostas.",
      btn: "Continuar"
    },

    // 11 — Problema: já treinou?
    {
      type: "single",
      title: "Já fez algum tipo de treino para melhorar o desempenho sexual?",
      sub: "Escolhe uma opção para avançar",
      options: ["Sim, já fiz", "Não, nunca treinei", "Não, mas já ouvi falar sobre", "O que são os músculos do assoalho pélvico?"]
    },

    // 12 — Desejo: gráfico (até 7x)
    {
      type: "chart",
      title: 'O programa do Método Rasga Xana fortalece os músculos do assoalho pélvico e pode aumentar o tempo médio de relação em <span class="hl">até 7 vezes</span>',
      note: "Esse método ajuda os homens a elevarem sua vida íntima a um novo nível, mesmo com o passar dos anos.",
      btn: "Continuar"
    },

    // 13 — Problema: força da ereção
    {
      type: "single",
      title: "Como anda a força da sua ereção durante o sexo?",
      sub: "Escolhe uma opção para avançar",
      options: ["Está tudo bem, mas quero melhorar", "Às vezes tenho dificuldades", "Costumo ter dificuldades com frequência"]
    },

    // 14 — Problema: há quanto tempo
    {
      type: "single",
      title: "Há quanto tempo você vem tendo dificuldades com ereção?",
      sub: "Escolhe uma opção para avançar",
      options: ["Menos de 6 meses", "De 6 a 12 meses", "De 1 a 3 anos", "De 3 a 5 anos", "Mais de 5 anos"]
    },

    // 15 — Problema: ereções matinais  (reconstruída no template padrão)
    {
      type: "single",
      title: "Com que frequência você tem ereções matinais?",
      options: ["Sempre", "Com frequência", "Raramente", "Nunca"]
    },

    // 16 — Problema: dificuldade antes do sexo
    {
      type: "single",
      title: "Com que frequência você tem dificuldade para ter uma ereção antes do sexo?",
      options: ["Sempre", "Com frequência", "Raramente", "Nunca"]
    },

    // 17 — Problema: duas vezes seguidas  (reconstruída no template padrão)
    {
      type: "single",
      title: "Você consegue transar duas vezes seguidas?",
      options: ["Sim, sem problemas", "Sim, mas preciso me esforçar", "Não, não consigo"]
    },

    // 18 — Educação: anatomia
    {
      type: "content",
      title: "A qualidade da ereção está diretamente ligada à força dos músculos do assoalho pélvico.",
      blocks: [img("imagens/img12.webp", "Anatomia do assoalho pélvico — músculo bulbocavernoso")],
      note:
        "Um dos três principais músculos dessa região, essencial para a saúde sexual masculina, é o <b>músculo bulbocavernoso</b>. " +
        "Ele permite que o pênis se encha de sangue e mantenha a firmeza.",
      btn: "Continuar"
    },

    // 19 — Prova: tabela comparativa + depoimento
    {
      type: "comparison",
      title: "84% dos homens melhoraram significativamente sua função erétil seguindo o plano de exercícios do Método Rasga Xana.",
      cols: ["Sozinho", "Método Rasga Xana"],
      rows: [
        { label: "Durar mais na cama", a: true, b: true },
        { label: "Melhorar a ereção", a: false, b: true },
        { label: "Resultados duradouros", a: false, b: true },
        { label: "Sem efeitos colaterais", a: false, b: true },
        { label: "Mais confiança", a: false, b: true }
      ],
      review: {
        name: "Mario Almeida",
        text:
          "Pouco é falado de como é bom fazer exercícios assim, fica com a confiança alta, dá uma baita diferença no dia a dia. " +
          "Sem falar que dá pra fazer em casa, faço em 10 minutos em um canto do meu quarto mesmo. Minha mulher fica maluca com a dureza."
      },
      btn: "Continuar"
    },

    // 20 — Qualificação: atividade física
    {
      type: "single",
      title: "Qual é o seu nível de atividade física?",
      options: ["Eu me exercito regularmente", "Eu me exercito de vez em quando", "Sou pouco ativo", "Não me exercito nunca"]
    },

    // 21 — Qualificação: pornô
    {
      type: "single",
      title: "Com que frequência você assiste pornô?",
      options: ["Pelo menos uma vez por dia", "3 a 4 vezes por semana", "Uma vez por semana", "De 1 a 2 vezes por mês", "Nunca"]
    },

    // 22 — Qualificação: estado civil  (reconstruída no template padrão)
    {
      type: "single",
      title: "Qual é o seu estado civil?",
      options: ["Casado", "Namorando", "Solteiro", "Prefiro não responder"]
    },

    // 23 — Qualificação: frequência sexual
    {
      type: "single",
      title: "Em média, quantas vezes por mês você tem relações sexuais?",
      options: ["Menos de 3 vezes por mês", "De 3 a 6 vezes por mês", "De 7 a 15 vezes por mês", "Mais de 15 vezes por mês", "Prefiro não responder"]
    },

    // 24 — Escala: libido
    {
      type: "scale",
      title: "Como você avaliaria sua libido (desejo sexual) nos últimos 3 meses?",
      sub: "De 1 (baixo) a 5 (alto)",
      ends: ["Baixo", "Alto"]
    },

    // 25 — Qualificação: soluções rápidas  (reconstruída no template padrão)
    {
      type: "single",
      title: "Você já tentou soluções de efeito rápido para melhorar sua vida íntima?",
      options: ["Sim, uso com frequência", "Sim, já usei algumas vezes", "Não, nunca usei"]
    },

    // 26 — Autoridade
    {
      type: "content",
      title: "O plano do Método Rasga Xana foi desenvolvido por médicos de todo o mundo certificados em função erétil",
      sub: "Sua jornada é baseada em décadas de pesquisa",
      blocks: [img("imagens/img14.webp", "Cambridge · Harvard · Oxford", "content-img--logos")],
      btn: "Continuar"
    },

    // 27 — Transição final (loading → PV)
    {
      type: "loading",
      title: "Seu Plano será avaliado por um especialista em saúde íntima masculina",
      loadingLabel: "Preparando seu Plano Personalizado…",
      cta: "Ver meu plano"
    }
  ];

  /* =========================================================
     ESTADO + ENGINE
     ========================================================= */
  var state = { i: 0, answers: {} };
  var main = document.getElementById("quizMain");
  var progressBar = document.getElementById("progressBar");

  function setProgress() {
    var pct = ((state.i + 1) / STEPS.length) * 100;
    progressBar.style.width = pct.toFixed(2) + "%";
  }

  function next() {
    if (state.i < STEPS.length - 1) {
      state.i++;
      render();
    }
  }

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ---------- renderizadores por tipo ---------- */
  function head(step) {
    var h = "";
    if (step.title) h += '<h1 class="step-title">' + step.title + "</h1>";
    if (step.sub) h += '<p class="step-sub">' + step.sub + "</p>";
    return h;
  }

  function renderAge(step) {
    var cards = step.options
      .map(function (o, idx) {
        return (
          '<button class="age-card" data-idx="' + idx + '">' +
          '<div class="age-card__frame"><img class="age-card__img" src="' + o.img + '" alt="' + o.label + '" decoding="async" /></div>' +
          '<div class="age-card__label">' + o.label + "</div>" +
          "</button>"
        );
      })
      .join("");
    var html =
      head(step) +
      '<div class="age-grid">' + cards + "</div>" +
      (step.note ? '<p class="step-note">' + step.note + "</p>" : "");
    main.innerHTML = html;
    main.querySelectorAll(".age-card").forEach(function (el) {
      el.addEventListener("click", function () {
        state.answers[state.i] = step.options[+el.dataset.idx].label;
        next();
      });
    });
  }

  function renderSingle(step) {
    var opts = step.options
      .map(function (label, idx) {
        return (
          '<button class="option" data-idx="' + idx + '">' +
          '<span class="option__mark"></span>' +
          "<span>" + label + "</span>" +
          "</button>"
        );
      })
      .join("");
    main.innerHTML = head(step) + '<div class="options">' + opts + "</div>";
    main.querySelectorAll(".option").forEach(function (el) {
      el.addEventListener("click", function () {
        main.querySelectorAll(".option").forEach(function (o) { o.classList.remove("is-selected"); });
        el.classList.add("is-selected");
        state.answers[state.i] = step.options[+el.dataset.idx];
        setTimeout(next, 260);
      });
    });
  }

  function renderImageOptions(step) {
    var opts = step.options
      .map(function (o, idx) {
        return (
          '<button class="option option--check" data-idx="' + idx + '">' +
          '<img class="option__thumb" src="' + o.img + '" alt="' + o.label + '" loading="lazy" decoding="async" />' +
          '<span class="option__mark"></span>' +
          "<span>" + o.label + "</span>" +
          "</button>"
        );
      })
      .join("");
    main.innerHTML =
      head(step) +
      '<div class="options">' + opts + "</div>" +
      '<button class="btn" id="continueBtn" disabled>' + step.btn + "</button>";
    var btn = document.getElementById("continueBtn");
    main.querySelectorAll(".option").forEach(function (el) {
      el.addEventListener("click", function () {
        main.querySelectorAll(".option").forEach(function (o) { o.classList.remove("is-selected"); });
        el.classList.add("is-selected");
        state.answers[state.i] = step.options[+el.dataset.idx].label;
        btn.disabled = false;
      });
    });
    btn.addEventListener("click", next);
  }

  function renderMultiSelect(step) {
    var chosen = {};
    var opts = step.options
      .map(function (label, idx) {
        return (
          '<button class="option option--check" data-idx="' + idx + '">' +
          '<span class="option__mark"></span>' +
          "<span>" + label + "</span>" +
          "</button>"
        );
      })
      .join("");
    main.innerHTML =
      head(step) +
      '<div class="options">' + opts + "</div>" +
      '<button class="btn" id="continueBtn" disabled>' + step.btn + "</button>";
    var btn = document.getElementById("continueBtn");
    main.querySelectorAll(".option").forEach(function (el) {
      el.addEventListener("click", function () {
        var idx = +el.dataset.idx;
        chosen[idx] = !chosen[idx];
        el.classList.toggle("is-selected", chosen[idx]);
        var any = Object.keys(chosen).some(function (k) { return chosen[k]; });
        btn.disabled = !any;
      });
    });
    btn.addEventListener("click", function () {
      state.answers[state.i] = Object.keys(chosen)
        .filter(function (k) { return chosen[k]; })
        .map(function (k) { return step.options[k]; });
      next();
    });
  }

  function renderScale(step) {
    var btns = "";
    for (var n = 1; n <= 5; n++) {
      btns += '<button class="scale__btn" data-val="' + n + '">' + n + "</button>";
    }
    main.innerHTML =
      head(step) +
      '<div class="scale">' + btns + "</div>" +
      '<div class="scale__ends"><span>' + step.ends[0] + "</span><span>" + step.ends[1] + "</span></div>";
    main.querySelectorAll(".scale__btn").forEach(function (el) {
      el.addEventListener("click", function () {
        main.querySelectorAll(".scale__btn").forEach(function (o) { o.classList.remove("is-selected"); });
        el.classList.add("is-selected");
        state.answers[state.i] = +el.dataset.val;
        setTimeout(next, 260);
      });
    });
  }

  function renderContent(step) {
    var html = '<div class="content-block">';
    html += head(step);
    if (step.lead) html += '<p class="step-lead">' + step.lead + "</p>";
    (step.blocks || []).forEach(function (b) { html += b; });
    if (step.note) html += '<p class="step-note">' + step.note + "</p>";
    html += "</div>";
    html += '<button class="btn" id="continueBtn">' + (step.btn || "Continuar") + "</button>";
    main.innerHTML = html;
    document.getElementById("continueBtn").addEventListener("click", next);
  }

  function chartSVG() {
    // comparativo de barras: Você antes (baixo, vermelho) × Você depois (alto, verde, até 7x)
    // baseline y=255; barras crescem de baixo p/ cima (scaleY animado, origem embaixo)
    return (
      '<div class="chart-wrap"><svg viewBox="0 0 560 300" role="img" aria-label="Comparativo: você antes e depois do método">' +
      '<defs>' +
      '<linearGradient id="barBefore" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#F87171"/><stop offset="1" stop-color="#EF4444"/>' +
      "</linearGradient>" +
      '<linearGradient id="barAfter" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#34D399"/><stop offset="1" stop-color="#16A34A"/>' +
      "</linearGradient>" +
      "</defs>" +
      // grades horizontais
      '<g stroke="#E4E7EC" stroke-dasharray="4 6">' +
      '<line x1="60" y1="70" x2="500" y2="70"/><line x1="60" y1="130" x2="500" y2="130"/>' +
      '<line x1="60" y1="190" x2="500" y2="190"/>' +
      "</g>" +
      // linha de base
      '<line x1="60" y1="255" x2="500" y2="255" stroke="#CBD2DA" stroke-width="2"/>' +
      // barra ANTES (baixa)
      '<rect class="ch-bar" style="animation-delay:.15s" x="120" y="207" width="120" height="48" rx="10" fill="url(#barBefore)"/>' +
      // barra DEPOIS (alta ~7x)
      '<rect class="ch-bar" style="animation-delay:.5s" x="320" y="60" width="120" height="195" rx="10" fill="url(#barAfter)"/>' +
      // badge "até 7x" sobre a barra depois
      '<g class="ch-label" style="animation-delay:1.1s">' +
      '<rect x="342" y="24" width="76" height="26" rx="13" fill="#16A34A"/>' +
      '<text x="380" y="42" text-anchor="middle" font-size="14" font-weight="900" fill="#fff">até 7x</text>' +
      "</g>" +
      // rótulos das barras (eixo x)
      '<text x="180" y="278" text-anchor="middle" font-size="13" font-weight="700" fill="#6B7280">Você antes</text>' +
      '<text x="380" y="278" text-anchor="middle" font-size="13" font-weight="800" fill="#16A34A">Você depois</text>' +
      "</svg></div>"
    );
  }

  function renderChart(step) {
    main.innerHTML =
      head(step) +
      chartSVG() +
      (step.note ? '<p class="step-note">' + step.note + "</p>" : "") +
      '<button class="btn" id="continueBtn">' + step.btn + "</button>";
    document.getElementById("continueBtn").addEventListener("click", next);
  }

  function renderComparison(step) {
    var mark = function (v) {
      return v ? '<span class="yes">&#10004;</span>' : '<span class="no">&#10008;</span>';
    };
    var rows = step.rows
      .map(function (r) {
        return "<tr><td>" + r.label + "</td><td>" + mark(r.a) + "</td><td>" + mark(r.b) + "</td></tr>";
      })
      .join("");
    var table =
      '<table class="cmp"><thead><tr><td></td><td>' + step.cols[0] + "</td><td>" + step.cols[1] + "</td></tr></thead>" +
      "<tbody>" + rows + "</tbody></table>";
    var review =
      '<div class="review"><div class="review__stars">★★★★★</div>' +
      '<div class="review__name">' + step.review.name + "</div>" +
      '<div class="review__text">' + step.review.text + "</div></div>";
    main.innerHTML =
      head(step) + table + review + '<button class="btn" id="continueBtn">' + step.btn + "</button>";
    document.getElementById("continueBtn").addEventListener("click", next);
  }

  function renderLoading(step) {
    main.innerHTML =
      '<div class="spacer"></div>' +
      head(step) +
      '<div class="loader-wrap">' +
      '<div class="loader-row"><span>' + step.loadingLabel + '</span><span id="loaderPct">0%</span></div>' +
      '<div class="loader-track"><div class="loader-fill" id="loaderFill"></div></div>' +
      "</div>" +
      '<div id="ctaHolder"></div>' +
      '<div class="spacer"></div>';
    var fill = document.getElementById("loaderFill");
    var pctEl = document.getElementById("loaderPct");
    var p = 0;
    var timer = setInterval(function () {
      p += Math.random() * 7 + 3;
      if (p >= 100) {
        p = 100;
        clearInterval(timer);
        document.getElementById("ctaHolder").innerHTML =
          '<a class="btn" style="display:block;text-align:center;text-decoration:none;" href="' + PV_URL + '">' + step.cta + "</a>";
      }
      fill.style.width = p + "%";
      pctEl.textContent = Math.round(p) + "%";
    }, 180);
  }

  var RENDERERS = {
    age: renderAge,
    single: renderSingle,
    imageOptions: renderImageOptions,
    multiSelect: renderMultiSelect,
    scale: renderScale,
    content: renderContent,
    chart: renderChart,
    comparison: renderComparison,
    loading: renderLoading
  };

  function render() {
    var step = STEPS[state.i];
    setProgress();
    // centraliza verticalmente os slides de conteúdo (evita vazio embaixo)
    var centered = step.type === "content" || step.type === "chart" || step.type === "comparison";
    main.classList.toggle("quiz-main--center", centered);
    (RENDERERS[step.type] || renderContent)(step);
    scrollTop();
  }

  // Deep-link opcional p/ QA e retomada: /#9 abre a etapa 9
  var deep = parseInt((location.hash || "").replace("#", ""), 10);
  if (deep >= 1 && deep <= STEPS.length) state.i = deep - 1;
  window.addEventListener("hashchange", function () {
    var n = parseInt((location.hash || "").replace("#", ""), 10);
    if (n >= 1 && n <= STEPS.length) { state.i = n - 1; render(); }
  });

  render();
})();
