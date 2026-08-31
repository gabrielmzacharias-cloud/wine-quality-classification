import pandas as pd
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns

sns.set_theme(style="whitegrid")

df = pd.read_csv("data/winequality-red.csv", sep=";")
print("Shape:", df.shape)
print(df.dtypes)
print("\nNulos por coluna:\n", df.isnull().sum())
print("\nDuplicadas:", df.duplicated().sum())
print("\nDescribe:\n", df.describe().T)

# Classe alvo binária
df["quality_label"] = np.where(df["quality"] >= 7, "Alta Qualidade", "Baixa/Média Qualidade")
df["target"] = (df["quality"] >= 7).astype(int)

print("\nBalanceamento classes:\n", df["quality_label"].value_counts())
print("\nBalanceamento %:\n", (df["quality_label"].value_counts(normalize=True) * 100).round(2))

print("\nDistribuição original de quality:\n", df["quality"].value_counts().sort_index())

# Correlação com o target
corr = df.drop(columns=["quality_label"]).corr(numeric_only=True)["target"].sort_values(ascending=False)
print("\nCorrelação com target:\n", corr)

# Salvar dataset processado (com target) para etapas seguintes
df.to_csv("data/wine_with_target.csv", index=False)

# --- Gráficos ---
# 1. Distribuição da variável quality original
plt.figure(figsize=(7,4.5))
sns.countplot(x="quality", data=df, color="#7b1e3a")
plt.title("Distribuição da nota de qualidade (original)")
plt.xlabel("Quality (nota)")
plt.ylabel("Contagem")
plt.tight_layout()
plt.savefig("results/01_dist_quality_original.png", dpi=150)
plt.close()

# 2. Balanceamento da classe binária
plt.figure(figsize=(6,4.5))
order = ["Baixa/Média Qualidade", "Alta Qualidade"]
ax = sns.countplot(x="quality_label", data=df, order=order, palette=["#4a4e69", "#7b1e3a"])
plt.title("Balanceamento das classes (binário)")
plt.xlabel("")
plt.ylabel("Contagem")
for p in ax.patches:
    ax.annotate(f'{int(p.get_height())}', (p.get_x()+p.get_width()/2, p.get_height()),
                ha='center', va='bottom')
plt.tight_layout()
plt.savefig("results/02_balanceamento_classes.png", dpi=150)
plt.close()

# 3. Heatmap de correlação
plt.figure(figsize=(10,8))
corr_matrix = df.drop(columns=["quality_label", "target"]).corr(numeric_only=True)
sns.heatmap(corr_matrix, annot=True, fmt=".2f", cmap="RdBu_r", center=0, square=True, cbar_kws={"shrink":.8})
plt.title("Matriz de correlação entre variáveis")
plt.tight_layout()
plt.savefig("results/03_heatmap_correlacao.png", dpi=150)
plt.close()

# 4. Correlação com target (barras)
plt.figure(figsize=(7,5))
corr_target = corr.drop(["target"])
colors = ["#2a9d8f" if v > 0 else "#e76f51" for v in corr_target.values]
sns.barplot(x=corr_target.values, y=corr_target.index, palette=colors)
plt.title("Correlação de cada variável com a classe Alta Qualidade")
plt.xlabel("Correlação (point-biserial)")
plt.tight_layout()
plt.savefig("results/04_correlacao_target.png", dpi=150)
plt.close()

# 5. Boxplots das variáveis mais correlacionadas por classe
top_vars = corr_target.abs().sort_values(ascending=False).head(6).index.tolist()
fig, axes = plt.subplots(2, 3, figsize=(15, 8))
for ax, var in zip(axes.flat, top_vars):
    sns.boxplot(x="quality_label", y=var, data=df, order=order, ax=ax, palette=["#4a4e69", "#7b1e3a"])
    ax.set_xlabel("")
plt.suptitle("Distribuição das variáveis mais relevantes por classe")
plt.tight_layout()
plt.savefig("results/05_boxplots_top_variaveis.png", dpi=150)
plt.close()

# 6. Outliers - detecção via IQR
print("\n--- Outliers (regra IQR 1.5x) ---")
outlier_summary = {}
for col in df.select_dtypes(include=[np.number]).columns:
    if col in ["quality", "target"]:
        continue
    Q1, Q3 = df[col].quantile(0.25), df[col].quantile(0.75)
    IQR = Q3 - Q1
    lower, upper = Q1 - 1.5*IQR, Q3 + 1.5*IQR
    n_out = ((df[col] < lower) | (df[col] > upper)).sum()
    outlier_summary[col] = n_out
    print(f"{col}: {n_out} outliers ({n_out/len(df)*100:.1f}%)")

pd.Series(outlier_summary).sort_values(ascending=False).to_csv("results/outliers_summary.csv")
