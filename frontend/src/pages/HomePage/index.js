import React, { useEffect, useState } from 'react';

import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar.js';
import api from '../../services/api';
import '../../assets/styles/HomePage.css';
import dayjs from 'dayjs';
import utcPlugin from 'dayjs/plugin/utc';
import timezonePlugin from 'dayjs/plugin/timezone';

dayjs.extend(utcPlugin);
dayjs.extend(timezonePlugin);


const HomePage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('Token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await api.get('/api/auth/users/me/');
        setCurrentUser(response.data);

        const postsResponse = await api.get('/api/posts/');
        setPosts(postsResponse.data);
      } catch (err) {
        setError('获取数据失败，请稍后重试。');
        console.error('获取数据出错:', err);
        if (err.response && err.response.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('Token');
    navigate('/login');
  };

  return (
    <div className="home-container">
      <Navbar currentUser={currentUser} onLogout={handleLogout} />
      {error && <p style={{ color:'red' }}>{error}</p>}
      <main className="main-content">
        <div className="post-list">
          {posts.map(post => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      </main>
    </div>
  );
};

const PostItem = ({ post }) => {
const formattedDate = dayjs(post.created_at).utc().tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss');

return(
  <div className="post-card">
    <div className="post-header">
      <h3>
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h3>
      <span className="post-author">帖主：{post.author}</span>
    </div>
    <p className="post-excerpt">{post.content.substring(0, 100)}...</p>
    <div className="post-footer">
      <span className="post-date">{formattedDate}</span>
      <div className="post-stats">
        <span>❤️ {post.likes}</span>
        <span>💬 {post.comments}</span>
      </div>
    </div>
  </div>
);
};

export default HomePage;
  
 