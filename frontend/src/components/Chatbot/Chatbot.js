import React, { useState, useEffect } from 'react';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your banking assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // Listen for custom event from sidebar
  useEffect(() => {
    const handleOpenChatbot = () => {
      setIsOpen(true);
    };

    window.addEventListener('openChatbot', handleOpenChatbot);
    
    return () => {
      window.removeEventListener('openChatbot', handleOpenChatbot);
    };
  }, []);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputMessage,
        sender: 'user',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
      setInputMessage('');
      
      // Simulate bot response
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          text: "Thank you for your message! Our AI-powered chatbot feature is coming soon. For now, please contact our customer service team at 1-800-PRAGYAN or visit our help center.",
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chatbot-container">
      {/* Chatbot Toggle Button */}
      <button 
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={toggleChatbot}
        title="Open Banking Assistant"
      >
        {isOpen ? <FaTimes /> : <FaRobot />}
      </button>

      {/* Chatbot Window */}
      <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <FaRobot className="chatbot-icon" />
            <div className="chatbot-title">
              <h3>Banking Assistant</h3>
              <span className="chatbot-status">
                <span className="status-dot"></span>
                Coming Soon
              </span>
            </div>
          </div>
          <button 
            className="chatbot-close"
            onClick={toggleChatbot}
          >
            <FaTimes />
          </button>
        </div>

        <div className="chatbot-messages">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`message ${message.sender}`}
            >
              <div className="message-content">
                <p>{message.text}</p>
                <span className="message-time">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="chatbot-footer">
          <form onSubmit={handleSendMessage} className="chatbot-form">
            <div className="input-container">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="chatbot-input"
                disabled
              />
              <button 
                type="submit" 
                className="chatbot-send"
                disabled
              >
                <FaPaperPlane />
              </button>
            </div>
          </form>
          <div className="coming-soon-notice">
            <p>🚀 AI-powered chatbot coming soon!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
