import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';

const Chat: React.FC = () => {
  const { roomId: urlRoomId } = useParams<{ roomId: string }>();
  const { socket, messages, currentUser, roomId, setRoomId } = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!urlRoomId) {
      navigate('/');
      return;
    }
    
    if (!roomId && urlRoomId) {
      setRoomId(urlRoomId);
    }
    
    if (!currentUser || !socket) {
      navigate('/');
    }
  }, [urlRoomId, roomId, currentUser, socket, navigate, setRoomId]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  useEffect(() => {
    return () => {
      if (socket && currentUser && roomId) {
        socket.emit('leave-room', { userId: currentUser.id, roomId });
      }
    };
  }, [socket, currentUser, roomId]);
  
  if (!urlRoomId || !currentUser) return null;
  
  return (
    <div className="flex flex-col h-screen bg-gray-950">
      <ChatHeader roomId={urlRoomId} />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map(message => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              currentUserId={currentUser.id}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <TypingIndicator />
      <ChatInput roomId={urlRoomId} />
    </div>
  );
};

export default Chat;