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

    def get_batch(self, size=3):
        scenario_data = self.scenarios[self.current_scenario]
        return random.sample(scenario_data, min(size, len(scenario_data)))

    def switch_scenario(self, scenario_name):
        if scenario_name in self.scenarios:
            self.current_scenario = scenario_name
            return True
        return False
