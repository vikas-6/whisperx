import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Users } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { generateUsername, generateRoomId } from '../utils/nameGenerator';
import Logo from './Logo';

const Home: React.FC = () => {
  const [inputRoomId, setInputRoomId] = useState('');
  const [error, setError] = useState('');
  const { socket, setCurrentUser, setRoomId } = useSocket();
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    const username = generateUsername();
    const roomId = generateRoomId();
    
    const user = { id: socket?.id || 'unknown', username };
    
    setCurrentUser(user);
    setRoomId(roomId);
    
    socket?.emit('join-room', { user, roomId });
    navigate(`/chat/${roomId}`);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputRoomId) {
      setError('Please enter a room ID');
      return;
    }
    
    const username = generateUsername();
    const user = { id: socket?.id || 'unknown', username };
    
    setCurrentUser(user);
    setRoomId(inputRoomId);
    
    socket?.emit('join-room', { user, roomId: inputRoomId });
    navigate(`/chat/${inputRoomId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <Logo />
          <h1 className="text-4xl font-bold text-white mt-2">Anonymous Chat</h1>
          <p className="text-gray-400 mb-4">Create a room or join one to start chatting anonymously with others.</p>
        </div>
        
        <div className="grid gap-4 mt-6">
          <button 
            onClick={handleCreateRoom} 
            className="btn btn-primary grid grid-cols-[auto_1fr] items-center gap-3 justify-start animate-slide-up"
            style={{ animationDelay: '0.1s' }}
          >
            <MessageSquare className="h-5 w-5" />
            <span>Create a New Room</span>
          </button>
          
          <div className="text-center py-2 text-gray-500">or</div>
          
          <form onSubmit={handleJoinRoom} className="space-y-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div>
              <label htmlFor="roomId" className="sr-only">Room ID</label>
              <input
                id="roomId"
                type="text"
                value={inputRoomId}
                onChange={(e) => {
                  setInputRoomId(e.target.value.toUpperCase());
                  setError('');
                }}
                placeholder="Enter Room ID (e.g., AB12CD)"
                className="input text-center"
                maxLength={6}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            
            <button 
              type="submit" 
              className="btn btn-secondary w-full grid grid-cols-[auto_1fr] items-center gap-3 justify-start"
            >
              <Users className="h-5 w-5" />
              <span>Join Existing Room</span>
            </button>
          </form>
        </div>
        
        <p className="text-gray-500 text-sm mt-8">
          You'll be given a random anonymous username when you join.
        </p>
      </div>
    </div>
  );
};

export default Home;