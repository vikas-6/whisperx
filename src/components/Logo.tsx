import React from 'react';
import { MessageSquare } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <MessageSquare className="h-7 w-7 text-primary-500" />
      <span className="font-bold text-2xl text-white tracking-tight">Whispr</span>
    </div>
  );
};

export default Logo;