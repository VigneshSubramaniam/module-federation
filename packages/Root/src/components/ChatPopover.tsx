import React, { useState } from 'react';
import { Card, TextField, Button, Stack, Text, Badge } from '@shopify/polaris';
import { useChatStore } from '../store/chatStore';
import './ChatPopover.css';

const ChatPopover: React.FC = () => {
  const { 
    isOpen, 
    messages, 
    unreadCount, 
    toggleChat, 
    addMessage, 
    clearMessages 
  } = useChatStore();
  
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      addMessage(inputValue.trim());
      setInputValue('');
      
      // Simulate a system response after 1 second
      setTimeout(() => {
        addMessage(`Echo: ${inputValue.trim()}`, 'system');
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="chat-toggle-button">
        <Button 
          primary 
          onClick={toggleChat}
          size="large"
        >
          💬 Chat
          {unreadCount > 0 && (
            <Badge status="critical" size="small">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Chat Popover */}
      {isOpen && (
        <div className="chat-popover">
          <Card>
            <div className="chat-header">
              <Stack distribution="equalSpacing" alignment="center">
                <Text variant="headingMd">Global Chat</Text>
                <Stack spacing="tight">
                  <Button size="slim" onClick={clearMessages}>
                    Clear
                  </Button>
                  <Button size="slim" onClick={toggleChat}>
                    ✕
                  </Button>
                </Stack>
              </Stack>
            </div>
            
            <div className="chat-messages">
              {messages.length === 0 ? (
                <Text color="subdued">No messages yet. Start a conversation!</Text>
              ) : (
                messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`chat-message ${message.sender === 'user' ? 'user' : 'system'}`}
                  >
                    <Text variant="bodyMd">{message.text}</Text>
                    <Text variant="caption" color="subdued">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </Text>
                  </div>
                ))
              )}
            </div>
            
            <div className="chat-input">
              <Stack>
                <TextField
                  label=""
                  value={inputValue}
                  onChange={setInputValue}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  autoComplete="off"
                />
                <Button primary onClick={handleSendMessage}>
                  Send
                </Button>
              </Stack>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default ChatPopover; 