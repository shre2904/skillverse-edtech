import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { chatbotAPI } from '../../services/api';
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon,
  PaperAirplaneIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
// import Button from '../ui/Button';
// import LoadingSpinner from '../ui/LoadingSpinner';
import ProfilePicture from '../ui/ProfilePicture';

const Chatbot = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [quickReplies, setQuickReplies] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && user) {
      initializeChat();
    }
  }, [isOpen, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = async () => {
    try {
      // Create new session
      const sessionResponse = await chatbotAPI.createSession();
      if (sessionResponse.success) {
        setSessionId(sessionResponse.sessionId);
        
        // Add welcome message
        const welcomeMessage = {
          id: Date.now(),
          message: "Hello! I'm your SkillVerse assistant. How can I help you today?",
          sender: 'bot',
          timestamp: new Date(),
          messageType: 'text'
        };
        setMessages([welcomeMessage]);
      }

      // Load quick replies
      const quickRepliesResponse = await chatbotAPI.getQuickReplies();
      if (quickRepliesResponse.success) {
        setQuickReplies(quickRepliesResponse.quickReplies);
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
    }
  };

  const sendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim() || !sessionId || isLoading) return;

    const userMessage = {
      id: Date.now(),
      message: messageText,
      sender: 'user',
      timestamp: new Date(),
      messageType: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await chatbotAPI.sendMessage({
        message: messageText,
        sessionId
      });

      if (response.success) {
        const botMessage = {
          id: Date.now() + 1,
          message: response.message,
          sender: 'bot',
          timestamp: new Date(),
          messageType: response.messageType,
          metadata: response.metadata
        };

        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        message: "I'm sorry, I encountered an error. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
        messageType: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickReply = (payload) => {
    sendMessage(payload);
  };

  const renderMessage = (message) => {
    const isUser = message.sender === 'user';
    
    return (
      <div
        key={message.id}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2 max-w-xs lg:max-w-md`}>
          {/* Avatar */}
          {isUser ? (
            <ProfilePicture size="sm" showEdit={false} />
          ) : (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
              <SparklesIcon className="h-4 w-4 text-white" />
            </div>
          )}
          
          {/* Message Bubble */}
          <div
            className={`px-4 py-3 rounded-2xl ${
              isUser
                ? 'bg-primary text-white rounded-br-md'
                : 'bg-surface text-text-primary rounded-bl-md border border-border/50'
            }`}
          >
            {message.messageType === 'course_suggestion' && message.metadata?.courses ? (
              <div className="space-y-3">
                <p className="text-sm">{message.message}</p>
                {message.metadata.courses.map((course) => (
                  <div key={course.id} className="bg-background/50 p-3 rounded-xl border border-border/30 hover:bg-background/70 transition-colors">
                    <div className="flex items-center space-x-3">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {course.title}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {course.category} • ₹{course.price}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-relaxed">{message.message}</p>
            )}
            <p className={`text-xs mt-2 ${isUser ? 'text-white/60' : 'text-text-secondary'}`}>
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (!user) return null;

  return (
    <>
      {/* Modern Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-primary to-accent text-white p-4 rounded-full shadow-2xl hover:shadow-primary/25 hover:scale-105 transition-all duration-300 z-50 group"
        >
          <ChatBubbleLeftRightIcon className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse"></div>
        </button>
      )}

      {/* Modern Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-background/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/50 flex flex-col z-50 overflow-hidden">
          {/* Modern Header */}
          <div className="bg-gradient-to-r from-primary to-accent text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <SparklesIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">SkillVerse Assistant</h3>
                <p className="text-xs text-white/80">Online now</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all duration-200"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background to-background/50">
            {messages.map(renderMessage)}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-end space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                    <SparklesIcon className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-surface text-text-primary px-4 py-3 rounded-2xl rounded-bl-md border border-border/50">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {quickReplies.length > 0 && messages.length <= 2 && (
            <div className="p-3 border-t border-border/50 bg-surface/30">
              <div className="flex flex-wrap gap-2">
                {quickReplies.slice(0, 4).map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply.payload)}
                    className="text-xs bg-surface hover:bg-primary/10 text-text-primary px-3 py-2 rounded-full border border-border/50 hover:border-primary/50 transition-all duration-200 hover:scale-105"
                  >
                    {reply.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Modern Input Area */}
          <div className="p-4 border-t border-border/50 bg-background/50">
            <div className="flex items-center space-x-3 bg-surface rounded-2xl p-2 border border-border/50 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-transparent text-text-primary placeholder-text-secondary text-sm outline-none px-3 py-2"
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-r from-primary to-accent text-white p-2 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <PaperAirplaneIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
