import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Login from './pages/Login';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import CreatePostPage from './pages/CreatePostPage';
import PostDetailPage from './pages/PostDetailPage';
import ChatWindow from './pages/Chat';
import LearningResources from './pages/LearningResources';

function App() {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#1890ff' } }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />
		  <Route path="/home" element={<HomePage />} />
		  <Route path="/create-post" element={<CreatePostPage />} />
		  <Route path="/posts/:postId" element={<PostDetailPage />} />
		  <Route path="/ai-chat" element={<ChatWindow />} />
		  <Route path="/Learning" element={<LearningResources />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;