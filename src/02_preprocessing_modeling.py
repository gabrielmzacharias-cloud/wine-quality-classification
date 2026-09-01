import pandas as pd
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
import json

from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import (accuracy_score, precision_score, recall_score, f1_score,
                              roc_auc_score, confusion_matrix, classification_report, roc_curve)
from imblearn.over_sampling import SMOTE

sns.set_theme(style="whitegrid")
RANDOM_STATE = 42

df = pd.read_csv("data/wine_with_target.csv")

# --- Pré-processamento ---
# 1) Duplicadas: remover (não são erro de captura, mas distorcem a distribuição/treino)
n_dup = df.drop(columns=["quality_label"]).duplicated().sum()
df = df.drop_duplicates(subset=[c for c in df.columns if c not in ["quality_label"]]).reset_index(drop=True)
print(f"Duplicadas removidas: {n_dup} | shape final: {df.shape}")

# 2) Feature engineering simples: razão SO2 livre / SO2 total (proxy de eficácia do conservante)
df["free_total_so2_ratio"] = df["free sulfur dioxide"] / df["total sulfur dioxide"]
df["acidity_ratio"] = df["fixed acidity"] / (df["volatile acidity"] + 1e-6)

feature_cols = [c for c in df.columns if c not in ["quality", "quality_label", "target"]]
X = df[feature_cols]
y = df["target"]

# 3) Split treino/teste estratificado (preserva proporção de classes)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=RANDOM_STATE, stratify=y
)
print(f"Treino: {X_train.shape}, Teste: {X_test.shape}")
print("Proporção treino:", y_train.mean().round(3), "| teste:", y_test.mean().round(3))

# 4) Padronização (necessária para Regressão Logística; árvores não exigem, mas não prejudica)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 5) Balanceamento de classes via SMOTE (apenas no treino, para não vazar informação pro teste)
smote = SMOTE(random_state=RANDOM_STATE)
X_train_bal, y_train_bal = smote.fit_resample(X_train_scaled, y_train)
print("Distribuição pós-SMOTE (treino):", np.bincount(y_train_bal))

# --- Modelagem ---
models = {
    "Regressão Logística": LogisticRegression(max_iter=1000, random_state=RANDOM_STATE),
    "Random Forest": RandomForestClassifier(n_estimators=300, random_state=RANDOM_STATE, n_jobs=-1),
    "Gradient Boosting": GradientBoostingClassifier(random_state=RANDOM_STATE),
}

results = []
roc_data = {}
cm_figs = {}

for name, model in models.items():
    model.fit(X_train_bal, y_train_bal)
    y_pred = model.predict(X_test_scaled)
    y_proba = model.predict_proba(X_test_scaled)[:, 1]

    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred)
    rec = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    auc = roc_auc_score(y_test, y_proba)

    # Validação cruzada (5-fold) sobre treino balanceado, métrica F1
    cv_scores = cross_val_score(model, X_train_bal, y_train_bal, cv=StratifiedKFold(5, shuffle=True, random_state=RANDOM_STATE), scoring="f1")

    results.append({
        "modelo": name, "accuracy": acc, "precision": prec, "recall": rec,
        "f1": f1, "roc_auc": auc, "f1_cv_mean": cv_scores.mean(), "f1_cv_std": cv_scores.std()
    })

    roc_data[name] = roc_curve(y_test, y_proba)
    cm_figs[name] = confusion_matrix(y_test, y_pred)

    print(f"\n=== {name} ===")
    print(classification_report(y_test, y_pred, target_names=["Baixa/Média", "Alta Qualidade"]))

results_df = pd.DataFrame(results).sort_values("f1", ascending=False)
print("\n\n=== COMPARATIVO FINAL ===")
print(results_df.round(4).to_string(index=False))
results_df.to_csv("results/metrics_comparativo.csv", index=False)

# --- Gráficos de avaliação ---
# Matrizes de confusão
fig, axes = plt.subplots(1, 3, figsize=(16, 5))
for ax, (name, cm) in zip(axes, cm_figs.items()):
    sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", ax=ax,
                xticklabels=["Baixa/Média", "Alta"], yticklabels=["Baixa/Média", "Alta"])
    ax.set_title(name)
    ax.set_xlabel("Predito")
    ax.set_ylabel("Real")
plt.tight_layout()
plt.savefig("results/06_matrizes_confusao.png", dpi=150)
plt.close()

# Curvas ROC
plt.figure(figsize=(7, 6))
for name, (fpr, tpr, _) in roc_data.items():
    auc_val = results_df.loc[results_df["modelo"] == name, "roc_auc"].values[0]
    plt.plot(fpr, tpr, label=f"{name} (AUC={auc_val:.3f})")
plt.plot([0, 1], [0, 1], "k--", alpha=0.4)
plt.xlabel("Taxa de Falsos Positivos")
plt.ylabel("Taxa de Verdadeiros Positivos")
plt.title("Curvas ROC — Comparativo de Modelos")
plt.legend()
plt.tight_layout()
plt.savefig("results/07_curvas_roc.png", dpi=150)
plt.close()

# Comparativo de métricas (barras agrupadas)
metrics_melt = results_df.melt(id_vars="modelo", value_vars=["accuracy","precision","recall","f1","roc_auc"],
                                  var_name="métrica", value_name="valor")
plt.figure(figsize=(10, 5.5))
sns.barplot(data=metrics_melt, x="métrica", y="valor", hue="modelo")
plt.ylim(0, 1)
plt.title("Comparativo de métricas entre modelos")
plt.legend(loc="lower right")
plt.tight_layout()
plt.savefig("results/08_comparativo_metricas.png", dpi=150)
plt.close()

# Feature importance (Random Forest) e coeficientes (Regressão Logística)
rf_model = models["Random Forest"]
importances = pd.Series(rf_model.feature_importances_, index=feature_cols).sort_values(ascending=False)
plt.figure(figsize=(8, 6))
sns.barplot(x=importances.values, y=importances.index, color="#7b1e3a")
plt.title("Importância das variáveis (Random Forest)")
plt.xlabel("Importância")
plt.tight_layout()
plt.savefig("results/09_feature_importance_rf.png", dpi=150)
plt.close()
importances.to_csv("results/feature_importance_rf.csv")

logit_model = models["Regressão Logística"]
coefs = pd.Series(logit_model.coef_[0], index=feature_cols).sort_values()
plt.figure(figsize=(8, 6))
colors = ["#e76f51" if v < 0 else "#2a9d8f" for v in coefs.values]
sns.barplot(x=coefs.values, y=coefs.index, palette=colors)
plt.title("Coeficientes da Regressão Logística (padronizados)")
plt.xlabel("Coeficiente")
plt.tight_layout()
plt.savefig("results/10_coeficientes_logit.png", dpi=150)
plt.close()

# Salvar tudo que o notebook vai precisar reutilizar
summary = {
    "n_duplicatas_removidas": int(n_dup),
    "shape_final": list(df.shape),
    "melhor_modelo_por_f1": results_df.iloc[0]["modelo"],
    "top5_features_rf": importances.head(5).round(4).to_dict(),
}
with open("results/summary.json", "w", encoding="utf-8") as f:
    json.dump(summary, f, ensure_ascii=False, indent=2)

print("\nResumo salvo em results/summary.json")
print(json.dumps(summary, ensure_ascii=False, indent=2))
