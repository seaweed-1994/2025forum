import os
import requests
import json
from django.conf import settings


class ErnieBot:
    def __init__(self):
        self.api_key = os.getenv('ERNIE_API_KEY')
        self.secret_key = os.getenv('ERNIE_SECRET_KEY')
        self.token_url = "https://aip.baidubce.com/oauth/2.0/token"
        self.api_url = os.getenv('ERNIE_API_URL')
        self.access_token = self._get_access_token()

    def _get_access_token(self):
        params = {
            'grant_type': 'client_credentials',
            'client_id': self.api_key,
            'client_secret': self.secret_key
        }
        response = requests.post(self.token_url, params=params)
        return response.json().get('access_token')

    def generate_response(self, messages):
        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }

        payload = {
            "messages": messages,
            "temperature": 0.95,
            "top_p": 0.8
        }

        response = requests.post(
            f"{self.api_url}?access_token={self.access_token}",
            headers=headers,
            data=json.dumps(payload)
        )

        if response.status_code == 200:
            return response.json()
        return {"error": "API请求失败"}