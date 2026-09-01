const pptxgen = require("pptxgenjs");

// ---- Paleta "Berry & Cream" ----
const BERRY = "6D2E46";
const BERRY_DARK = "43152B";
const ROSE = "A26769";
const CREAM = "ECE2D0";
const WHITE = "FFFFFF";
const INK = "2B2024";
const GREEN = "2A9D8F";
const RED_ACC = "E76F51";

const RES = "../results";

function newDeck() {
  const p = new pptxgen();
  p.layout = "LAYOUT_WIDE"; // 13.3 x 7.5
  return p;
}

const pres = newDeck();

// Helper: título padrão de conteúdo (fundo claro)
function addHeader(slide, kicker, title) {
  slide.addText(kicker.toUpperCase(), {
    x: 0.6, y: 0.35, w: 8, h: 0.35, fontSize: 12, bold: true, color: BERRY,
    charSpacing: 2, fontFace: "Calibri", isTextBox: true, margin: 0,
  });
  slide.addText(title, {
    x: 0.6, y: 0.68, w: 12.1, h: 0.75, fontSize: 30, bold: true, color: INK,
    fontFace: "Cambria", isTextBox: true, margin: 0,
  });
}

function addFooter(slide, pageNum) {
  slide.addText("Tech Challenge — Wine Quality Classification  |  POSTECH FIAP", {
    x: 0.6, y: 7.15, w: 9, h: 0.3, fontSize: 9, color: ROSE, fontFace: "Calibri", isTextBox: true, margin: 0,
  });
  slide.addText(String(pageNum), {
    x: 12.5, y: 7.15, w: 0.5, h: 0.3, fontSize: 9, color: ROSE, align: "right", fontFace: "Calibri", isTextBox: true, margin: 0,
  });
}

// ============ SLIDE 1 — CAPA ============
{
  const s = pres.addSlide();
  s.background = { color: BERRY_DARK };
  // faixa decorativa: círculos remetendo a taças/uvas, sem usar stripes proibidos
  s.addShape(pres.ShapeType.ellipse, { x: 10.7, y: -1.2, w: 5, h: 5, fill: { color: BERRY, transparency: 40 }, line: { type: "none" } });
  s.addShape(pres.ShapeType.ellipse, { x: 12.3, y: 4.5, w: 3, h: 3, fill: { color: ROSE, transparency: 55 }, line: { type: "none" } });

  s.addText("TECH CHALLENGE · POSTECH FIAP · FASE 2", {
    x: 0.8, y: 1.6, w: 8, h: 0.4, fontSize: 13, bold: true, color: CREAM, charSpacing: 2, fontFace: "Calibri", isTextBox: true, margin: 0,
  });
  s.addText("Classificando a Qualidade de Vinhos\ncom Machine Learning", {
    x: 0.8, y: 2.1, w: 10.5, h: 2, fontSize: 40, bold: true, color: WHITE, fontFace: "Cambria", isTextBox: true, margin: 0, lineSpacingMultiple: 1.08,
  });
  s.addText("Uma leitura orientada a dados sobre o que torna um vinho tinto \"Alta Qualidade\" — e o que isso significa para o processo produtivo.", {
    x: 0.8, y: 4.2, w: 8.8, h: 0.9, fontSize: 15, italic: true, color: CREAM, fontFace: "Calibri", isTextBox: true, margin: 0,
  });
  s.addText("Storytelling da Análise Exploratória de Dados", {
    x: 0.8, y: 6.5, w: 8, h: 0.4, fontSize: 13, color: ROSE, bold: true, fontFace: "Calibri", isTextBox: true, margin: 0,
  });
}

// ============ SLIDE 2 — O DESAFIO ============
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  addHeader(s, "O contexto", "Avaliar qualidade de vinho é caro, lento e subjetivo");

  const cards = [
    { t: "Hoje", d: "Especialistas avaliam aroma, sabor, acidez e equilíbrio manualmente — um processo sensorial." },
    { t: "O problema", d: "Demorado, caro e sujeito à subjetividade de cada avaliador." },
    { t: "A oportunidade", d: "Dados físico-químicos já coletados na produção podem prever a qualidade final." },
  ];
  cards.forEach((c, i) => {
    const x = 0.6 + i * 4.15;
    s.addShape(pres.ShapeType.roundRect, { x, y: 2.0, w: 3.85, h: 3.4, rectRadius: 0.12, fill: { color: CREAM }, line: { type: "none" }, shadow: { type: "outer", color: "888888", opacity: 0.25, blur: 6, offset: 3, angle: 90 } });
    s.addText(c.t, { x: x + 0.3, y: 2.3, w: 3.25, h: 0.5, fontSize: 18, bold: true, color: BERRY, fontFace: "Cambria", isTextBox: true, margin: 0 });
    s.addText(c.d, { x: x + 0.3, y: 2.9, w: 3.25, h: 2.3, fontSize: 14, color: INK, fontFace: "Calibri", isTextBox: true, margin: 0, valign: "top" });
  });

  s.addText("Pergunta central: dá para prever se um vinho será \"Alta Qualidade\" só com dados físico-químicos?", {
    x: 0.6, y: 5.7, w: 12.1, h: 0.8, fontSize: 16, italic: true, bold: true, color: BERRY_DARK, fontFace: "Cambria", isTextBox: true, margin: 0,
  });
  addFooter(s, 2);
}

// ============ SLIDE 3 — O DATASET ============
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  addHeader(s, "A base de dados", "1.599 vinhos tintos, 11 características físico-químicas");

  const stats = [
    { n: "1.599", l: "amostras de\nvinho tinto" },
    { n: "11", l: "variáveis\nfísico-químicas" },
    { n: "0", l: "valores\nfaltantes" },
    { n: "240", l: "linhas\nduplicadas" },
  ];
  stats.forEach((st, i) => {
    const x = 0.6 + i * 3.1;
    s.addText(st.n, { x, y: 2.1, w: 2.9, h: 1.1, fontSize: 52, bold: true, color: BERRY, align: "center", fontFace: "Cambria", isTextBox: true, margin: 0 });
    s.addText(st.l, { x, y: 3.15, w: 2.9, h: 0.8, fontSize: 13, color: INK, align: "center", fontFace: "Calibri", isTextBox: true, margin: 0 });
  });

  s.addText("Variáveis disponíveis:", { x: 0.6, y: 4.35, w: 4, h: 0.35, fontSize: 13, bold: true, color: BERRY_DARK, fontFace: "Calibri", isTextBox: true, margin: 0 });
  s.addText(
    "Acidez fixa · Acidez volátil · Ácido cítrico · Açúcar residual · Cloretos · Dióxido de enxofre livre · Dióxido de enxofre total · Densidade · pH · Sulfatos · Teor alcoólico",
    { x: 0.6, y: 4.75, w: 12.1, h: 1.1, fontSize: 13, color: INK, fontFace: "Calibri", isTextBox: true, margin: 0 }
  );

  s.addShape(pres.ShapeType.roundRect, { x: 0.6, y: 6.0, w: 12.1, h: 0.85, rectRadius: 0.1, fill: { color: CREAM }, line: { type: "none" } });
  s.addText("Fonte: Wine Quality Dataset (Kaggle/UCI) — Cortez et al., 2009, \"Vinho Verde\" português. Dados limpos: sem nulos; duplicadas tratadas no pré-processamento.", {
    x: 0.9, y: 6.13, w: 11.5, h: 0.6, fontSize: 12, italic: true, color: BERRY_DARK, fontFace: "Calibri", isTextBox: true, margin: 0, valign: "middle",
  });
  addFooter(s, 3);
}

// ============ SLIDE 4 — O ALVO E O DESBALANCEAMENTO ============
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  addHeader(s, "Definindo o alvo", "Vinhos \"Alta Qualidade\" são raros: só 14% da base");

  s.addImage({ path: `${RES}/02_balanceamento_classes.png`, x: 0.6, y: 1.85, w: 6.0, h: 4.6, sizing: { type: "contain", w: 6.0, h: 4.6 } });

  s.addText("Nota ≥ 7 → Alta Qualidade\nNota < 7 → Baixa/Média Qualidade", {
    x: 7.0, y: 2.1, w: 5.7, h: 1.0, fontSize: 16, bold: true, color: BERRY_DARK, fontFace: "Cambria", isTextBox: true, margin: 0,
  });
  s.addText([
    { text: "86,4%", options: { bold: true, color: ROSE, fontSize: 22 } },
    { text: " dos vinhos são Baixa/Média Qualidade\n", options: { fontSize: 14, color: INK } },
    { text: "13,6%", options: { bold: true, color: BERRY, fontSize: 22 } },
    { text: " são Alta Qualidade\n\n", options: { fontSize: 14, color: INK } },
    { text: "Por que isso importa: ", options: { bold: true, fontSize: 14, color: BERRY_DARK } },
    { text: "um modelo \"preguiçoso\" já acertaria 86% só chutando sempre \"Baixa/Média\". Por isso a avaliação foca em precisão, recall e F1 da classe rara — não só em acurácia.", options: { fontSize: 14, color: INK } },
  ], { x: 7.0, y: 3.3, w: 5.7, h: 3.2, fontFace: "Calibri", isTextBox: true, margin: 0, valign: "top", lineSpacingMultiple: 1.15 });

  addFooter(s, 4);
}

// ============ SLIDE 5 — O QUE MAIS INFLUENCIA A QUALIDADE ============
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  addHeader(s, "Correlações", "Três variáveis se destacam na relação com a qualidade");

  s.addImage({ path: `${RES}/04_correlacao_target.png`, x: 0.6, y: 1.85, w: 6.3, h: 4.9, sizing: { type: "contain", w: 6.3, h: 4.9 } });

  const bullets = [
    { icon: "▲", color: GREEN, t: "Teor alcoólico", d: "correlação positiva mais forte — vinhos com mais álcool tendem a nota mais alta." },
    { icon: "▲", color: GREEN, t: "Sulfatos", d: "conservante/antioxidante; mais presente em vinhos mais bem avaliados." },
    { icon: "▼", color: RED_ACC, t: "Acidez volátil", d: "correlação negativa mais forte — indica defeito de fermentação (avinagramento)." },
  ];
  bullets.forEach((b, i) => {
    const y = 2.0 + i * 1.55;
    s.addShape(pres.ShapeType.ellipse, { x: 7.2, y, w: 0.5, h: 0.5, fill: { color: b.color }, line: { type: "none" } });
    s.addText(b.icon, { x: 7.2, y, w: 0.5, h: 0.5, fontSize: 16, bold: true, color: WHITE, align: "center", valign: "middle", fontFace: "Calibri", isTextBox: true, margin: 0 });
    s.addText(b.t, { x: 7.9, y: y - 0.05, w: 4.8, h: 0.4, fontSize: 16, bold: true, color: BERRY_DARK, fontFace: "Cambria", isTextBox: true, margin: 0 });
    s.addText(b.d, { x: 7.9, y: y + 0.4, w: 4.8, h: 0.9, fontSize: 13, color: INK, fontFace: "Calibri", isTextBox: true, margin: 0, valign: "top" });
  });

  addFooter(s, 5);
}

// ============ SLIDE 6 — DADOS TRATADOS (PRÉ-PROCESSAMENTO) ============
{
  const s = pres.addSlide();
  s.background = { color: CREAM };
  addHeader(s, "Preparando os dados", "Quatro decisões antes de treinar qualquer modelo");

  const steps = [
    { n: "1", t: "Remover duplicadas", d: "240 linhas idênticas removidas para não enviesar o aprendizado." },
    { n: "2", t: "Novas variáveis", d: "Razões entre acidez fixa/volátil e SO₂ livre/total, capturando equilíbrios relevantes." },
    { n: "3", t: "Padronização", d: "StandardScaler nas variáveis numéricas, necessário para a Regressão Logística." },
    { n: "4", t: "Balanceamento (SMOTE)", d: "Aplicado só no treino, gerando exemplos sintéticos de Alta Qualidade." },
  ];
  steps.forEach((st, i) => {
    const x = 0.6 + (i % 2) * 6.15;
    const y = 2.0 + Math.floor(i / 2) * 2.35;
    s.addShape(pres.ShapeType.roundRect, { x, y, w: 5.8, h: 2.05, rectRadius: 0.12, fill: { color: WHITE }, line: { type: "none" }, shadow: { type: "outer", color: "888888", opacity: 0.2, blur: 5, offset: 2, angle: 90 } });
    s.addShape(pres.ShapeType.ellipse, { x: x + 0.3, y: y + 0.3, w: 0.55, h: 0.55, fill: { color: BERRY }, line: { type: "none" } });
    s.addText(st.n, { x: x + 0.3, y: y + 0.3, w: 0.55, h: 0.55, fontSize: 18, bold: true, color: WHITE, align: "center", valign: "middle", fontFace: "Cambria", isTextBox: true, margin: 0 });
    s.addText(st.t, { x: x + 1.05, y: y + 0.28, w: 4.5, h: 0.4, fontSize: 15, bold: true, color: BERRY_DARK, fontFace: "Cambria", isTextBox: true, margin: 0 });
    s.addText(st.d, { x: x + 1.05, y: y + 0.72, w: 4.55, h: 1.15, fontSize: 12.5, color: INK, fontFace: "Calibri", isTextBox: true, margin: 0, valign: "top" });
  });

  addFooter(s, 6);
}

// ============ SLIDE 7 — MODELOS E DESEMPENHO ============
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  addHeader(s, "Modelagem", "Três modelos testados — o Gradient Boosting teve o melhor equilíbrio");

  s.addImage({ path: `${RES}/08_comparativo_metricas.png`, x: 0.6, y: 1.85, w: 7.6, h: 4.9, sizing: { type: "contain", w: 7.6, h: 4.9 } });

  const rows = [
    ["Modelo", "F1 (Alta Qualidade)", "ROC-AUC"],
    ["Gradient Boosting", "0,568", "0,886"],
    ["Random Forest", "0,513", "0,879"],
    ["Regressão Logística", "0,496", "0,893"],
  ];
  s.addTable(rows.map((r, i) => r.map((c, j) => ({
    text: c,
    options: {
      bold: i === 0 || j === 0,
      color: i === 0 ? WHITE : (i === 1 ? BERRY_DARK : INK),
      fill: { color: i === 0 ? BERRY : (i === 1 ? CREAM : WHITE) },
      fontSize: 13, fontFace: "Calibri", align: j === 0 ? "left" : "center", valign: "middle",
    }
  }))), { x: 8.5, y: 2.1, w: 4.2, h: 1.8, colW: [2.0, 1.2, 1.0], border: { type: "solid", color: "D8CFC0", pt: 0.75 }, autoPage: false });

  s.addText("Gradient Boosting é o modelo recomendado: melhor equilíbrio entre encontrar vinhos de Alta Qualidade (recall) e acertar quando aponta um (precisão).", {
    x: 8.5, y: 4.3, w: 4.2, h: 2.2, fontSize: 13, italic: true, color: BERRY_DARK, fontFace: "Calibri", isTextBox: true, margin: 0, valign: "top",
  });

  addFooter(s, 7);
}

// ============ SLIDE 8 — O QUE MAIS PESA NA DECISÃO DO MODELO ============
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  addHeader(s, "Interpretação", "O modelo aprendeu o que a enologia já sabia");

  s.addImage({ path: `${RES}/09_feature_importance_rf.png`, x: 0.6, y: 1.85, w: 6.3, h: 4.9, sizing: { type: "contain", w: 6.3, h: 4.9 } });

  s.addText([
    { text: "1º Teor alcoólico\n", options: { bold: true, fontSize: 15, color: BERRY_DARK } },
    { text: "Variável mais importante em todos os modelos testados.\n\n", options: { fontSize: 13, color: INK } },
    { text: "2º Sulfatos\n", options: { bold: true, fontSize: 15, color: BERRY_DARK } },
    { text: "Conservante associado a maior estabilidade e nota.\n\n", options: { fontSize: 13, color: INK } },
    { text: "3º Acidez volátil\n", options: { bold: true, fontSize: 15, color: BERRY_DARK } },
    { text: "Principal fator negativo — sinal de defeito de fermentação.", options: { fontSize: 13, color: INK } },
  ], { x: 7.2, y: 2.0, w: 5.5, h: 4.7, fontFace: "Calibri", isTextBox: true, margin: 0, valign: "top", lineSpacingMultiple: 1.15 });

  addFooter(s, 8);
}

// ============ SLIDE 9 — IMPLICAÇÕES PARA A PRODUÇÃO ============
{
  const s = pres.addSlide();
  s.background = { color: BERRY_DARK };
  s.addText("O QUE ISSO MUDA NA PRÁTICA", {
    x: 0.6, y: 0.5, w: 8, h: 0.4, fontSize: 12, bold: true, color: CREAM, charSpacing: 2, fontFace: "Calibri", isTextBox: true, margin: 0,
  });
  s.addText("Três alavancas para o processo produtivo", {
    x: 0.6, y: 0.85, w: 12, h: 0.7, fontSize: 28, bold: true, color: WHITE, fontFace: "Cambria", isTextBox: true, margin: 0,
  });

  const items = [
    { t: "Colheita e fermentação", d: "Ajustar o ponto de colheita e a condução da fermentação para atingir teores alcoólicos mais altos (dentro do estilo do vinho)." },
    { t: "Controle de contaminação", d: "Priorizar o controle de temperatura e higiene que evitam a formação de acidez volátil (ácido acético)." },
    { t: "Dosagem de sulfatos", d: "Ajustar dentro dos limites regulatórios/sensoriais para ganhar estabilidade e qualidade percebida." },
  ];
  items.forEach((it, i) => {
    const x = 0.6 + i * 4.15;
    s.addShape(pres.ShapeType.roundRect, { x, y: 2.1, w: 3.85, h: 3.6, rectRadius: 0.12, fill: { color: BERRY, transparency: 15 }, line: { type: "none" } });
    s.addText(it.t, { x: x + 0.3, y: 2.4, w: 3.25, h: 0.7, fontSize: 17, bold: true, color: WHITE, fontFace: "Cambria", isTextBox: true, margin: 0 });
    s.addText(it.d, { x: x + 0.3, y: 3.15, w: 3.25, h: 2.4, fontSize: 13, color: CREAM, fontFace: "Calibri", isTextBox: true, margin: 0, valign: "top" });
  });

  s.addText("Uso recomendado: ferramenta de priorização (quais lotes merecem avaliação sensorial aprofundada), não substituto do enólogo.", {
    x: 0.6, y: 6.0, w: 12.1, h: 0.8, fontSize: 14, italic: true, color: ROSE, fontFace: "Calibri", isTextBox: true, margin: 0,
  });
  addFooter(s, 9);
}

// ============ SLIDE 10 — FECHAMENTO ============
{
  const s = pres.addSlide();
  s.background = { color: CREAM };
  s.addText("EM RESUMO", {
    x: 0.8, y: 1.3, w: 8, h: 0.4, fontSize: 13, bold: true, color: BERRY, charSpacing: 2, fontFace: "Calibri", isTextBox: true, margin: 0,
  });
  s.addText("Sim, dá para prever a qualidade do vinho\ncom dados físico-químicos", {
    x: 0.8, y: 1.7, w: 11, h: 1.6, fontSize: 32, bold: true, color: INK, fontFace: "Cambria", isTextBox: true, margin: 0, lineSpacingMultiple: 1.08,
  });
  s.addText([
    { text: "Gradient Boosting", options: { bold: true, color: BERRY } },
    { text: " foi o modelo mais equilibrado (F1 = 0,57 · ROC-AUC = 0,89), com ", options: {} },
    { text: "teor alcoólico, sulfatos e acidez volátil", options: { bold: true, color: BERRY } },
    { text: " como principais variáveis explicativas — resultado coerente com o conhecimento enológico de domínio.", options: {} },
  ], { x: 0.8, y: 3.5, w: 10.5, h: 1.5, fontSize: 16, color: INK, fontFace: "Calibri", isTextBox: true, margin: 0, valign: "top", lineSpacingMultiple: 1.2 });

  s.addText("Repositório completo, notebook e código-fonte disponíveis no GitHub do projeto.", {
    x: 0.8, y: 6.6, w: 10, h: 0.4, fontSize: 13, italic: true, color: ROSE, fontFace: "Calibri", isTextBox: true, margin: 0,
  });
}

pres.writeFile({ fileName: "wine_quality_storytelling.pptx" }).then(() => console.log("done"));
