try:
    print("Importing nlp_engine...")
    from nlp_engine import NLPEngine
    print("Import successful. Initializing Engine...")
    engine = NLPEngine()
    print("Initialization successful.")
    res = engine.analyze("I love AI")
    print(f"Analysis Result: {res}")
except Exception as e:
    print(f"CRITICAL ERROR: {e}")
    import traceback
    traceback.print_exc()
