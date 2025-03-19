from django.urls import path
from chatbot.api.views import ChatAPIView

urlpatterns = [
    path('api/chat/', ChatAPIView.as_view(), name='chat-api'),
]