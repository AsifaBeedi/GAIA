import random

class NewsStream:
    def __init__(self):
        self.scenarios = {
            "ai_panic": [
                {"text": "AI Regulation Bill causes market panic", "lang": "en", "lat": 40.7128, "lng": -74.0060},
                {"text": "El miedo a la IA paraliza las inversiones", "lang": "es", "lat": 40.4168, "lng": -3.7038},
                {"text": "AIによる失業率の増加が懸念される", "lang": "ja", "lat": 35.6762, "lng": 139.6503},
                {"text": "L'IA générative menace les emplois créatifs", "lang": "fr", "lat": 48.8566, "lng": 2.3522},
                {"text": "الذكاء الاصطناعي يثير المخاوف الأمنية", "lang": "ar", "lat": 25.2048, "lng": 55.2708}
            ],
            "mars_colony": [
                {"text": "Humanity establishes first Mars colony", "lang": "en", "lat": 28.5383, "lng": -81.3792},
                {"text": "Éxito histórico en la misión a Marte", "lang": "es", "lat": -34.6037, "lng": -58.3816},
                {"text": "人类首次登陆火星取得巨大成功", "lang": "zh", "lat": 39.9042, "lng": 116.4074},
                {"text": "Historic step for mankind in space", "lang": "en", "lat": 51.5074, "lng": -0.1278},
                {"text": "मंगल ग्रह पर पहली मानव बस्ती", "lang": "hi", "lat": 28.6139, "lng": 77.2090}
            ]
        }
        self.current_scenario = "ai_panic"
        self.live_events = []

    def add_live_event(self, event):
        """Inject a real-time event from a user."""
        self.live_events.insert(0, event)
        # Keep only last 10 live events
        if len(self.live_events) > 10:
            self.live_events.pop()

    def get_batch(self, size=3):
        # Prioritize live events
        batch = []
        if self.live_events:
            # Take up to 'size' events from live_events
            count = min(len(self.live_events), size)
            batch.extend(self.live_events[:count])
            
            # Allow them to be picked up again? Or remove them? 
            # For this demo, let's keep them in the 'stream' for a bit but we usually want fresh polling.
            # To ensure they show up in the poll, we just return them. 
            # The frontend handles deduplication by ID.
            pass

        # Fill the rest with scenario data
        if len(batch) < size:
            scenario_data = self.scenarios[self.current_scenario]
            needed = size - len(batch)
            batch.extend(random.sample(scenario_data, min(needed, len(scenario_data))))
            
        return batch

    def switch_scenario(self, scenario_name):
        if scenario_name in self.scenarios:
            self.current_scenario = scenario_name
            return True
        return False
