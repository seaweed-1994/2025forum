from django.db import models
from users.models import CustomUser

class DialogueSession(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

class ChatMessage(models.Model):
    session = models.ForeignKey(DialogueSession, related_name='messages', on_delete=models.CASCADE)
    user_message = models.TextField()
    ai_response = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    meta_data = models.JSONField(default=dict)