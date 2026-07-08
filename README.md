# Quiz — Método 14 Dias (RASGA XANA)

Réplica funcional do funil de quiz de referência (marca NEVI), reconstruída com **design unificado**, marca **RASGA XANA / Método 14 Dias** (azul/preto) e as telas "feias" do original corrigidas. SPA estático (sem build).

## Rodar localmente
```
python3 -m http.server 4750 --directory "."
```
Abre em `http://localhost:4750`. (No app: preview config `kegel`, porta 4750.)

## Arquivos
- `index.html` — casca (header com logo + barra de progresso, main, rodapé)
- `css/style.css` — design system unificado, mobile-first
- `js/quiz.js` — array `STEPS` (27 etapas) + engine de render/navegação
- `imagens/logo.png` — logo RASGA XANA (xadrez de falsa transparência já removido)

## Deep-link (QA / retomar)
`index.html#9` abre direto a etapa 9 (útil pra testar/revisar telas específicas).

---

## Imagens (já integradas ✅)

As imagens do usuário estão em `imagens/` e já ligadas em cada etapa:

| Etapa | Tela | Arquivo |
|-------|------|---------|
| 1 | Idade (4 fotos) | `img1.png` 18-30 · `img2.png` 31-45 · `img3.png` 46-55 · `img4.png` +56 |
| 2 | Prova social DIA 1/14/24 | `img5.png` |
| 3 | Tipo de corpo | `img6.jpg` Magro · `img7.png` Médio/Forte · `img8.jpg` Acima do peso |
| 4 | Notícia Kegel | `img9.png` |
| 6 | Força do músculo dia 1/7/14/28 | `img10.png` |
| 10 | Notícia contra pílula | `img11.png` |
| 12 | Gráfico "até 7×" | *(SVG em código — sem imagem)* |
| 18 | Anatomia | `img12.png` |
| 19 | Tabela + depoimento | *(tabela e depoimento em código — sem imagem)* |
| 26 | Autoridade (logos) | `img14.png` |

**Pontos de atenção:**
- `img7.png` (tipo de corpo Médio/Forte) tem **marca d'água "dreamstime"** — recomendado trocar por uma sem marca.
- `img13.png` é a **tabela comparativa** original (etapa 19). Não está em uso: a tabela foi refeita em código (responsiva). Fica de reserva caso prefira a imagem.

## Fim do quiz
A etapa 27 (loading) termina com o CTA **"Ver meu plano"** apontando para `../pv/` (página de vendas — pasta ainda vazia, fora do escopo deste build).

## Copy: NEVI → RASGA XANA
Todas as menções à marca "NEVI" do original foram trocadas por **Método 14 Dias / RASGA XANA**. O accent verde do original virou o **azul da marca** (`#1060F0`).
