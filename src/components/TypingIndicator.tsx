import React from 'react';
import { useSocket } from '../context/SocketContext';

const TypingIndicator: React.FC = () => {
  const { isTyping, usersInRoom, currentUser } = useSocket();

  // Defensive checks to avoid crash
  if (!usersInRoom || !currentUser || isTyping.size === 0) return null;

  // Filter out current user and check who is typing
  const typingUsers = usersInRoom.filter(
    (user) => isTyping.has(user.id) && user.id !== currentUser.id
  );

  if (typingUsers.length === 0) return null;

  const typingText =
    typingUsers.length === 1
      ? `${typingUsers[0].username} is typing`
      : 'Multiple people are typing';

  return (
    <div className="px-4 py-1 text-xs text-gray-400 flex items-center animate-fade-in">
      {typingText}
      <div className="typing-indicator ml-2">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default TypingIndicator;
