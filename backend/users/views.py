from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import CustomUser
from .serializers import CustomTokenObtainPairSerializer, UserRegistrationSerializer,CurrentUserSerializer
from rest_framework import generics

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]

class RegisterView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    def post(self, request):
        print("请求数据:", request.data)  # 查看实际接收的数据
        serializer = UserRegistrationSerializer(data=request.data)
        print("序列化器校验结果:", serializer.is_valid())  # 检查校验状态
        print("校验错误:", serializer.errors)  # 打印具体错误
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "注册成功"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CurrentUserView(generics.RetrieveUpdateAPIView):  # 继承 RetrieveUpdateAPIView
    serializer_class = CurrentUserSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'patch']  # 限制允许的HTTP方法

    def get_object(self):
        return self.request.user  # 直接返回当前用户对象

    def update(self, request, *args, **kwargs):
        # 自定义更新逻辑（例如过滤可修改字段）
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial,
            # 明确指定可修改字段
            fields=['username', 'avatar']
        )
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)