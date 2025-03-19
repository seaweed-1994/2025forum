from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from chatbot.services.ernie_service import ErnieBot
from chatbot.models import DialogueSession, ChatMessage


class ChatAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        message = request.data.get('message')
        session_id = request.data.get('session_id')

        # 获取或创建对话session
        if session_id:
            try:
                session = DialogueSession.objects.get(id=session_id, user=user)
            except DialogueSession.DoesNotExist:
                return Response({"error": "会话不存在"}, status=400)
        else:
            session = DialogueSession.objects.create(user=user)

        # 调用ERNIE服务
        ernie = ErnieBot()

        # 获取历史消息（最近5条）
        history = ChatMessage.objects.filter(session=session).order_by('-timestamp')[:5]
        messages = [{"role": "user", "content": msg.user_message} for msg in reversed(history)]
        messages.append({"role": "user", "content": message})

        response = ernie.generate_response(messages)

        if "error" in response:
            return Response(response, status=500)

        # 保存对话记录
        ChatMessage.objects.create(
            session=session,
            user_message=message,
            ai_response=response['result'],
            meta_data={
                'token_usage': response.get('usage'),
                'request_id': response.get('id')
            }
        )

        return Response({
            "session_id": session.id,
            "response": response['result'],
            "history": [msg.user_message for msg in history]
        })