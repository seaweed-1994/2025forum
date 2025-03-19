import { useEffect,useState } from 'react';
import MessageBubble from './MessageBubble';
import styles from '../../assets/styles/Chat.module.css';
import useChat from './useChat';
import Navbar from '../../components/Navbar';
import api from '../../services/api';

const ChatWindow = () => {
  const {
    messages,
    inputText,
    isLoading,
    error,
    setInputText,
    handleSend,
    messagesEndRef
  } = useChat();
  
   const [currentUser, setCurrentUser] = useState(null);

 
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('Token'); 
      if (!token) {
        window.location.href = '/login';
        return;
      }
	  try {
        const response = await api.get('/api/auth/users/me/');
        setCurrentUser(response.data); 
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('Token');
          window.location.href = '/login';
        } else {
          console.error('获取用户信息失败:', error);
        }
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <div className={styles.chatContainer}>
	<Navbar
	 currentUser={currentUser} onLogout={() => {
        localStorage.removeItem('Token');
        window.location.href = '/login';
      }}/>
      <div className={styles.messagesPanel}>
        {messages.map((msg, index) => (
          <MessageBubble
            key={index}
            text={msg.text}
            isUser={msg.isUser}
            timestamp={msg.timestamp}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputPanel}>
        <div className={styles.inputGroup}>
          <textarea
            className={styles.textarea}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="输入消息..."
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            disabled={isLoading}
            rows={2}
          />
          <button
            className={styles.sendButton}
            onClick={handleSend}
            disabled={isLoading}
          >
            {isLoading ? '发送中...' : '发送'}
          </button>
        </div>
        {error && <div className={styles.error}>{error}</div>}
      </div>
    </div>
  );
};

export default ChatWindow;