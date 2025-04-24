export interface User {
  id: string;
  username: string;
}

export interface Message {
  id: string;
  content: string;
  sender: User;
  timestamp: number;
  type: 'user' | 'system';
}

export interface Room {
  id: string;
  users: User[];
}