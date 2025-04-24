import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useSocket } from '../context/SocketContext';

interface ChatInputProps {
  roomId: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ roomId }) => {
  const [message, setMessage] = useState('');
  const { socket, currentUser } = useSocket();
  const inputRef = useRef<HTMLInputElement>(null);
  const [typing, setTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !socket || !currentUser) return;
    
    const messageData = {
      content: message,
      sender: currentUser,
      roomId,
      timestamp: Date.now(),
      type: 'user' as const,
    };
    
    socket.emit('send-message', messageData);
    setMessage('');
    setTyping(false);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };
  
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    
    if (!typing && e.target.value.trim() && socket && currentUser) {
      setTyping(true);
      socket.emit('typing', { userId: currentUser.id, roomId });
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
    }, 3000);
  };
  
  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-gray-900 px-4 py-3 border-t border-gray-800"
    >
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={handleTyping}
          placeholder="Type a message..."
          className="input flex-1"
        />
        
        <button 
          type="submit" 
          className={`rounded-full p-3 transition-all ${
            message.trim() 
              ? 'bg-primary-500 text-white hover:bg-primary-600' 
              : 'bg-gray-800 text-gray-500'
          }`}
          disabled={!message.trim()}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;