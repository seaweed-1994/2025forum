from django.test import TestCase
from chatbot.services.ernie_service import ErnieBot


class ErnieServiceTest(TestCase):
    def test_token_acquisition(self):
        """测试access token获取"""
        bot = ErnieBot()
        self.assertIsNotNone(bot.access_token, "Token获取失败")

    def test_api_connection(self):
        """测试API基础响应"""
        bot = ErnieBot()
        test_messages = [{
            "role": "user",
            "content": "你好，请说'服务正常'"
        }]

        response = bot.generate_response(test_messages)
        self.assertIn('result', response, f"API响应异常: {response}")
        self.assertIn('服务正常', response['result'], "API返回内容不符合预期")