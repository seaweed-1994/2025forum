import React, { useState } from 'react';
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../../assets/styles/auth.css';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await api.post('/api/auth/register/', values);
      message.success('注册成功');
      navigate('/login');
    } catch (error) {
      message.error(error.response?.data?.message || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="page-background">
    <div className="auth-container">
      <div className="auth-form">
	  <h2 align="center">暨深❤️AI</h2>
        <h2 align="center">论坛用户注册</h2>
        <Form
          name="register"
          onFinish={onFinish}
          scrollToFirstError
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名!' },
              { min: 2, message: '用户名至少2个字符' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入用户名"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱!' },
              { type: 'email', message: '邮箱格式不正确' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="请输入邮箱"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码!' },
              { min: 6, message: '密码至少6个字符' }
            ]}
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
              注册
            </Button>
          </Form.Item>
        </Form>
        <div className="auth-footer">
          已有账号？<a href="/login">立即登录</a>
        </div>
      </div>
    </div>
</div>
  );
};

export default Register;