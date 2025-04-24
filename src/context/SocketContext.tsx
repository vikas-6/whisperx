import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';
import { Message, User } from '../types';

// List of animal avatars
const animalAvatars = [
  "🦁", "🐯", "🐮", "🐵", "🦊", "🐶", "🐱", "🐰", "🐻", "🦄", "🐼", "🐨"
];

// Function to generate random nickname and avatar
const generateRandomNickname = () => {
  const randomNickname = uniqueNamesGenerator({ dictionaries: [adjectives, animals] });
  const randomAvatar = animalAvatars[Math.floor(Math.random() * animalAvatars.length)];
  return { nickname: randomNickname, avatar: randomAvatar };
};

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  roomId: string | null;
  setRoomId: (roomId: string | null) => void;
  isTyping: Set<string>;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  connected: false,
  currentUser: null,
  setCurrentUser: () => {},
  messages: [],
  setMessages: () => {},
  roomId: null,
  setRoomId: () => {},
  isTyping: new Set(),
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState<Set<string>>(new Set());

  const handleMessage = useCallback((message: Message) => {
    setMessages(prevMessages => [...prevMessages, message]);
  }, []);

  useEffect(() => {
    const socketIo = io('http://localhost:3001', {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
      transports: ['websocket']
    });

    socketIo.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
    });

    socketIo.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    socketIo.on('message', handleMessage);

    socketIo.on('user-typing', (userId: string) => {
      setIsTyping(prevTyping => {
        const newTyping = new Set(prevTyping);
        newTyping.add(userId);
        return newTyping;
      });

      setTimeout(() => {
        setIsTyping(prevTyping => {
          const newTyping = new Set(prevTyping);
          newTyping.delete(userId);
          return newTyping;
        });
      }, 3000);
    });

    setSocket(socketIo);

    return () => {
      socketIo.off('message', handleMessage);
      socketIo.disconnect();
    };
  }, [handleMessage]);

  // Create random nickname and avatar for currentUser
  useEffect(() => {
    const { nickname, avatar } = generateRandomNickname();
    setCurrentUser({
      id: socket?.id || '',
      username: nickname,
      avatar: avatar,
    });

    // Emit user info to server when user joins
    if (socket && roomId && currentUser) {
      socket.emit('join-room', { user: { ...currentUser, username: nickname, avatar }, roomId });
    }
  }, [socket, roomId]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        currentUser,
        setCurrentUser,
        messages,
        setMessages,
        roomId,
        setRoomId,
        isTyping,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
