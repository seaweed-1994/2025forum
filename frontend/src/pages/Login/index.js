import React, { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../../assets/styles/auth.css';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  

const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await api.post('/api/auth/login/', values);
      message.success('登录成功');
      
      try {
        localStorage.setItem('Token', response.data.access);
		
      } catch (storageError) {
        message.error('本地存储失败，请检查浏览器设置');
        return;
      }
      
      navigate('/home'); 
    } catch (error) {
      message.error(error.response?.data?.detail || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="page-background">
    <div className="auth-container">
      <div className="auth-form">
        <h2 align="center">暨深❤️AI</h2>
		<h2 align="center"> 论坛用户登录</h2>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱!' },
              { type: 'email', message: '邮箱格式不正确' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入邮箱"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
        <div className="auth-footer">
          没有账号？<a href="/register">立即注册</a>
        </div>
      </div>
    </div>
</div>
  );
};

export default Login;