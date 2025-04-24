import React from 'react';
import { Link } from 'react-router-dom';
import { Copy, ChevronLeft } from 'lucide-react';
import Logo from './Logo';

interface ChatHeaderProps {
  roomId: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ roomId }) => {
  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    alert('Room ID copied to clipboard!');
  };
  
  return (
    <div className="bg-gray-900 px-4 py-3 flex items-center justify-between border-b border-gray-800">
      <div className="flex items-center gap-2">
        <Link to="/" className="text-gray-400 hover:text-white mr-1">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <Logo />
      </div>
      
      <div 
        className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-700 transition-colors"
        onClick={copyRoomId}
      >
        <span className="text-white font-medium">{roomId}</span>
        <Copy className="h-3.5 w-3.5 text-gray-400" />
      </div>
    </div>
  );
};

export default ChatHeader