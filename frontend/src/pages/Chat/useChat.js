// useChat.js
import { useState, useRef, useEffect } from 'react';
import { sendMessage } from './api';

export default function useChat() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    try {
      setIsLoading(true);
      const userMessage = { 
        text: inputText, 
        isUser: true, 
        timestamp: new Date() 
      };

      setMessages(prev => [...prev, userMessage]);
      
      const response = await sendMessage({
        message: inputText,
        session_id: sessionId
      });

      setSessionId(response.session_id);
      
      const aiMessage = {
        text: response.response,
        isUser: false,
        timestamp: new Date(),
        history: response.history
      };

      setMessages(prev => [...prev, aiMessage]);
      setInputText('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    inputText,
    isLoading,
    error,
    setInputText,
    handleSend,
    messagesEndRef
  };
}