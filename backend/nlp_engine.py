from transformers import pipeline
import torch

class NLPEngine:
    def __init__(self):
        print("Loading NLP Model...")
        # using a smaller, faster model for real-time demo purposes
        # 'nlptown/bert-base-multilingual-uncased-sentiment' maps text to 1-5 stars
        self.sentiment_analyzer = pipeline(
            "sentiment-analysis", 
            model="nlptown/bert-base-multilingual-uncased-sentiment",
            tokenizer="nlptown/bert-base-multilingual-uncased-sentiment"
        )
        print("NLP Model Loaded.")

    def analyze(self, text):
        result = self.sentiment_analyzer(text)[0]
        # result look like: {'label': '1 star', 'score': 0.95}
        
        star_rating = int(result['label'].split(' ')[0])
        sentiment_category = self._map_stars_to_sentiment(star_rating)
        
        return {
            "score": result['score'],
            "stars": star_rating,
            "sentiment": sentiment_category
        }

    def _map_stars_to_sentiment(self, stars):
        if stars <= 2:
            return "fear" # or anger/negative
        elif stars == 3:
            return "neutral" # or anticipation
        else:
            return "joy" # positive
