
import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/Navbar.css';

const Navbar = ({ currentUser, onLogout }) => (
  <nav className="navbar">
    <div className="nav-left">
      <Link to="/home" className="logo">暨深❤️AI</Link>
      <Link to="/create-post" className="nav-link">发帖</Link>
	  <Link to="/ai-chat" className="nav-link">AI对话</Link>
	  <Link to="/learning" className="nav-link">知识园地</Link>

    </div>
    
    <div className="nav-right">
      {currentUser ? (
        <>
          <span className="username">欢迎，{currentUser.username}</span>
          <button onClick={onLogout} className="logout-btn">登出</button>
        </>
      ) : (
        <Link to="/login" className="nav-link">登录</Link>
      )}
    </div>
  </nav>
);

export default Navbar;