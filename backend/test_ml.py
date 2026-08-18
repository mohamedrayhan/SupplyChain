from app.ml_engine import ml_risk_engine, ml_copilot_engine

def test_ml():
    print("--- 1. Predictive Risk ML Engine ---")
    prob, tier, factors, hrs = ml_risk_engine.predict_risk(
        traffic=85.0, 
        wh_delay_mins=90.0, 
        veh_risk=60.0
    )
    print(f"ML Delay Risk Prediction: {prob}% ({tier}) | Predicted Delay: +{hrs} hrs")
    print("Top Contributing Features from Random Forest:")
    for f in factors:
        print(f"  - {f['name']}: Impact Score {f['impact_score']} (Weight: {f['weight']})")

    print("\n--- 2. Copilot TF-IDF + Cosine Similarity Intent Classifier ---")
    test_queries = [
        "Why is Chennai warehouse delayed and what is the bottleneck?",
        "Which shipments are late in transit right now?",
        "Simulate backup vehicle recovery ROI and savings",
        "What is the inventory truth confidence for SKU-IND-001?"
    ]
    for query in test_queries:
        intent, score = ml_copilot_engine.classify_intent(query)
        print(f"Query: '{query}' -> Intent: {intent} (Cosine Similarity: {score})")

if __name__ == "__main__":
    test_ml()
