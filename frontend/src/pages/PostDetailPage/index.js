import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/PostDetailPage.css';
import dayjs from 'dayjs';
import utcPlugin from 'dayjs/plugin/utc';
import timezonePlugin from 'dayjs/plugin/timezone';

dayjs.extend(utcPlugin);
dayjs.extend(timezonePlugin);

const formatDate = (createdAt) => {
  return dayjs(createdAt).utc().tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss');
};

const PostDetailPage = () => {
  const { postId } = useParams(); // 获取 URL 参数 postId
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null); // 新增用户状态

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('Token');
      if (!token) {
        navigate('/login');
        return;
      }
	  try {
        // 获取用户信息
        const userResponse = await api.get('/api/auth/users/me/');
        setCurrentUser(userResponse.data);

        const response = await api.get(`/api/posts/${postId}/`);
        setPost(response.data);
        setLoading(false);
      } catch (err) {
        setError('加载帖子失败');
        setLoading(false);
        if (err.response?.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchData();
  }, [postId, navigate]);

  if (loading) return <div className="loading">加载中...</div>;
  if (error) return <div className="error">{error}</div>;

  const formattedDate = post ? formatDate(post.created_at) : '';

  return (
    <div className="post-detail-container">
      <Navbar currentUser={currentUser} onLogout={() => {
        localStorage.removeItem('Token');
        navigate('/login');
      }} />
 
      <div className="post-detail">
        <h1>{post.title}</h1>
        <div className="post-meta">
          <span>作者：{post.author}</span>
          <span>发布时间：{formattedDate}</span>
        </div>
        <div className="post-content">{post.content}</div>
        <div className="post-stats">
          <span>❤️ {post.likes}</span>
          <span>💬 {post.comments}</span>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;