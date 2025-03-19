import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import api from '../../services/api';
import '../../assets/styles/CreatePostPage.css';
import Navbar from '../../components/Navbar';

const CreatePostPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('Token');
      if (!token) {
        navigate('/login'); 
        return;
      }
	  try {
        const response = await api.get('/api/auth/users/me/');
        setCurrentUser(response.data); 
      } catch (error) {
        if (error.response && error.response.status === 401) {
          message.error('认证失效，请重新登录');
          localStorage.removeItem('Token'); 
          navigate('/login'); 
        } else {
          message.error('获取用户信息失败');
        }
      }
    };

    fetchCurrentUser();
  }, [navigate]);
  


  const onFinish = async (values) => {
    setLoading(true);
    try {
      await api.post('/api/posts/', values);
      message.success('发帖成功');
      navigate('/home'); // 发帖成功后跳转回首页
    } catch (error) {
      message.error(error.response?.data?.detail || '发帖失败');
    } finally {
      setLoading(false);
    }
  };

  return (
 
    <div className="create-post-container">
	       <Navbar currentUser={currentUser} onLogout={() => {
        localStorage.removeItem('Token');
        navigate('/login');
      }} />
      <h2>发布新帖子</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="title"
          label="标题"
          rules={[{ required: true, message: '请输入标题' }]}
        >
          <Input placeholder="请输入标题" />
        </Form.Item>
        <Form.Item
          name="content"
          label="内容"
          rules={[{ required: true, message: '请输入内容' }]}
        >
          <Input.TextArea rows={6} placeholder="请输入内容" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            发布
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreatePostPage;