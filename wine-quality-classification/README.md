# Wine Quality Classification 🍷

Tech Challenge — Fase 2 | POSTECH FIAP — Data Analytics

## Descrição

Modelo de classificação binária para prever a qualidade de vinhos tintos (**Alta Qualidade** vs. **Baixa/Média Qualidade**) a partir de suas características físico-químicas, usando o [Wine Quality Dataset](https://www.kaggle.com/datasets/anairamcosta/winequality-red-csv) (variante *red*, Cortez et al., 2009 — "Vinho Verde" português).

A variável original `quality` (nota de 0 a 10 atribuída por especialistas) foi transformada em classe binária:

- **Alta Qualidade**: `quality >= 7`
- **Baixa/Média Qualidade**: `quality < 7`

## Estrutura do repositório

```
wine-quality-classification/
│
├── data/                 # Base de dados utilizada (raw + processada)
├── notebooks/             # Notebook com a análise exploratória e modelagem completa
├── src/                    # Scripts auxiliares (EDA, pré-processamento, modelagem, geração do notebook)
├── results/                # Gráficos e métricas dos modelos
├── requirements.txt        # Bibliotecas utilizadas
└── README.md                # Este arquivo
```

## Pipeline

1. **Compreensão do problema** e definição da variável alvo binária.
2. **EDA**: distribuição das variáveis, correlações, balanceamento de classes, detecção de outliers (regra IQR).
3. **Pré-processamento**: remoção de duplicadas, feature engineering (`free_total_so2_ratio`, `acidity_ratio`), split estratificado, padronização (`StandardScaler`), balanceamento via **SMOTE** (aplicado apenas no treino).
4. **Modelagem**: Regressão Logística, Random Forest e Gradient Boosting.
5. **Avaliação**: accuracy, precision, recall, F1, ROC-AUC, matriz de confusão e validação cruzada estratificada (5-fold).
6. **Interpretação**: importância de variáveis (Random Forest) e coeficientes (Regressão Logística), com implicações para o processo produtivo.

## Principais resultados

| Modelo | Accuracy | Precision | Recall | F1 | ROC-AUC |
|---|---|---|---|---|---|
| Gradient Boosting | 0.849 | 0.466 | 0.730 | **0.568** | 0.886 |
| Random Forest | 0.860 | 0.488 | 0.541 | 0.513 | 0.879 |
| Regressão Logística | 0.768 | 0.352 | 0.838 | 0.496 | **0.893** |

**Variáveis mais influentes:** teor alcoólico (`alcohol`), sulfatos (`sulphates`) e acidez volátil (`volatile acidity`, com efeito negativo).

Detalhes completos da análise, gráficos e discussão em [`notebooks/wine_quality_classification.ipynb`](notebooks/wine_quality_classification.ipynb).

## Como rodar

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
jupyter notebook notebooks/wine_quality_classification.ipynb
```

## Dataset

- Fonte: Wine Quality Dataset (Kaggle / UCI Machine Learning Repository)
- Referência: P. Cortez, A. Cerdeira, F. Almeida, T. Matos and J. Reis, "Modeling wine preferences by data mining from physicochemical properties", *Decision Support Systems*, 2009.
- 1.599 amostras de vinho tinto, 11 variáveis físico-químicas + nota de qualidade.

## Autores

Grupo — POSTECH FIAP, Data Analytics, Fase 2.
