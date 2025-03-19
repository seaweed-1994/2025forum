import { useNavigate, Link } from 'react-router-dom';
import styles from '../../assets/styles/LearningResources.css';
import api from '../../services/api';
import Navbar from '../../components/Navbar.js';
import React, { useEffect, useState } from 'react';

const resources = [
  {
    id: 1,
    title: 'Deep Learning Specialization (Coursera)',
    category: '在线课程',
    description: '吴恩达的深度学习专项课程，涵盖深度学习基础到进阶内容。',
    url: 'https://www.coursera.org/specializations/deep-learning',
    tags: ['神经网络', '计算机视觉', '序列模型']
  },
  {
    id: 2,
    title: '《动手学深度学习》',
    category: '开源教材',
    description: 'MXNet/Gluon中文教学资料，包含代码和实战案例。',
    url: 'https://zh.d2l.ai/',
    tags: ['机器学习基础', '代码实践']
  },
  {
    id: 3,
    title: 'arXiv AI Papers',
    category: '论文集合',
    description: '最新人工智能领域学术论文预印本平台。',
    url: 'https://arxiv.org/list/cs.AI/recent',
    tags: ['学术研究', '前沿技术']
  },
    {
    id: 4,
    title: '机器学习基石',
    category: '在线课程',
    description: '台湾大学林轩田老师的《机器学习基石》课程由浅入深、内容全面，基本涵盖了机器学习领域的很多方面。其作为机器学习的入门和进阶资料非常适合。',
    url: 'https://www.bilibili.com/video/av36731342',
    tags: ['机器学习基础']
  },
    {
    id: 5,
    title: '海螺AI创意视频平台',
    category: 'AI工具',
    description: 'MiniMax公司推出的AI视频生成工具，能根据文本提示快速生成高质量的视频片段。',
    url: 'https://hailuoai.com/video',
    tags: ['视频生成']
  },
    {
    id: 6,
    title: '《Deep Learning》',
    category: '开源教材',
    description: '《深度学习》通常又被称为花书，深度学习领域最经典的畅销书。由全球知名的三位专家IanGoodfellow、YoshuaBengio和AaronCourville撰写，是深度学习领域奠基性的经典教材。该书被大众尊称为“AI圣经”。',
    url: 'https://www.deeplearningbook.org/',
    tags: ['深度学习','英文原版']
  },
];

const LearningResources = () => {
	const [currentUser, setCurrentUser] = useState(null);
	const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
	const navigate = useNavigate();
	const [selectedCategory, setSelectedCategory] = useState('全部');
	
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
  
  const resourceCount = resources.length;
  const categoryCountObj = {};
  resources.forEach(resource => {
    const category = resource.category;
    if (categoryCountObj[category]) {
      categoryCountObj[category]++;
    } else {
      categoryCountObj[category] = 1;
    }
  });

  const categoryCount = Object.keys(categoryCountObj).length;
  const filteredResources = selectedCategory === '全部'
    ? resources
    : resources.filter(resource => resource.category === selectedCategory);

  return (
  
    <div className="resource-container">
	<Navbar currentUser={currentUser} onLogout={handleLogout} />
    <h3 align="center">
        AI学习资源中心
	</h3>

        <p align="center" className="resource-subtitle">（当前资源总数：{resourceCount}，持续更新中…）</p>
      <div className="category-count-info" align="center">
        {Object.entries(categoryCountObj).map(([category, count]) => (
          <span key={category}>
            {category}：{count}
            &nbsp;&nbsp;
          </span>
        ))}
      </div>
	  <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="全部">全部</option>
        {Object.keys(categoryCountObj).map(category => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
	  <p></p>
      
      {filteredResources.map(resource => (
        <div 
          className="resource-card"
          key={resource.id}
        >
          <div className="card-header">
            <a
              className="resource-link"
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {resource.title}
            </a>
            <div className="category-tag-wrapper">
              <span className={`category-tag category-${resource.category}`}>
                {resource.category}
              </span>
            </div>
          </div>
          <p className="resource-description">{resource.description}</p>
          <div className="tag-container">
            {resource.tags.map(tag => (
              <span 
                key={tag}
                className="resource-tag"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LearningResources;