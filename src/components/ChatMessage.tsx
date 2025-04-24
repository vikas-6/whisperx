import React from 'react';
import { Message } from '../types';
import { formatTime } from '../utils/formatTime';

interface ChatMessageProps {
  message: Message;
  currentUserId: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, currentUserId }) => {
  // Check if it's a system message
  if (message.type === 'system') {
    return (
      <div className="system-message animate-fade-in">
        {message.content}
      </div>
    );
  }
  
  const isSentByMe = message.sender.id === currentUserId;
  const animationClass = isSentByMe ? 'animate-slide-in-left' : 'animate-slide-in-right';
  const messageClass = isSentByMe ? 'message-bubble-sent' : 'message-bubble-received';
  
  return (
    <div className={`flex flex-col mb-2 ${isSentByMe ? 'items-end' : 'items-start'} ${animationClass}`}>
      {/* Display the sender's username and avatar */}
      {!isSentByMe && (
        <div className="flex items-center">
          <span className="text-xl">{message.sender.avatar}</span> {/* Display the avatar */}
          <span className="text-xs text-gray-400 ml-2 mb-1">{message.sender.username}</span> {/* Display the username */}
        </div>
      )}
      
      {/* Display the message bubble */}
      <div className={messageClass}>
        <p>{message.content}</p>
      </div>
      
      {/* Display the message timestamp */}
      <span className="text-xs text-gray-500 mt-1 mx-2">
        {formatTime(message.timestamp)}
      </span>
    </div>
  );
};

export default ChatMessage;
