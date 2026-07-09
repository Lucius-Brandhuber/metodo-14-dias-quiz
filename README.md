# Funil Rasga Xana — Método Rasga Xana (quiz + PV + admin)

Funil de quiz otimizado (16 telas, metodologia funil-quiz/Schwartz) + página de vendas + painel de analytics. SPA estático (sem build).

**No ar:** Vercel `https://rasga-xana.vercel.app` (projeto `rasga-xana`, team lucius-team2) e GitHub Pages `https://lucius-brandhuber.github.io/metodo-14-dias-quiz/`.

## Rodar localmente
```
python3 -m http.server 4790 --directory "."
```
(No app: preview config `rasga-xana`, porta 4790.)

## Arquivos
- `index.html` — casca do quiz (header com logo + barra de progresso)
- `js/quiz.js` — array `STEPS` (16 telas) + engine de render/navegação
- `css/style.css` — design system unificado, mobile-first (azul `#1060F0`)
- `track.js` — tracking do funil (`window.rxTrack`/`rxUtm`, backend `rx-api`, sem A/B)
- `pv/index.html` — página de vendas (CSS inline; imagens do quiz NÃO se repetem aqui — prova/mecanismo/autoridade são HTML/CSS/SVG)
- `admin.html` — painel de analytics (mesma senha dos outros admins; chave de API TOFU no 1º login)

## Estrutura do quiz (16 telas)
1. Idade *(engajamento)* · 2. Tipo de corpo · 3–6. Problema (duração, frequência, ereção, tempo) · 7. Educação músculo (img10) · 8. Pornô (causa-raiz, ancora Bônus 2) · 9. Notícia anti-pílula (img11) · 10. Objetivos *(desejo)* · 11. Pergunta-ponte · 12. Gráfico "até 7x" · 13. Prova 84% + depoimento · 14. Anatomia (img12) · 15. Autoridade (img14) · 16. Transição forte → PV.

Deep-link p/ QA: `index.html#9` abre a tela 9.

## Tracking / Admin
- Backend: Supabase Edge Function **`rx-api`** (projeto `nyuycffqncuavzuhyofq`, tabelas `rx_*`).
- Eventos: `view 0` → `answer 1..15` → `view diagnostico` → `click cta_pv` → `view pv` → `checkout_click`.
- Meta CAPI desligada até setar os secrets `RX_PIXEL_ID` e `RX_META_CAPI_TOKEN` (não reusar IDs de outros funis).
- Postback de venda do checkout: `POST rx-api?src=venda`.

## Pendências
- `[CHECKOUT]`: colar o link real nos CTAs da PV (const `CHECKOUT` no `track.js` reescreve os 3 botões).
- Trocar `imagens/img7.webp` (marca d'água dreamstime).
- Pixel Meta / Utmify próprios (placeholders no `<head>` do quiz e da PV).

## Imagens não usadas (reserva)
- `img9` (notícia Kegel — a versão enxuta ficou com uma tela de notícia só), `img13` (tabela original, refeita em código), `img5` agora é só da PV (hero).
