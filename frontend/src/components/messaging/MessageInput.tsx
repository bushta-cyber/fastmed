import React, { useState } from 'react';
import { Send, Paperclip, Smile, Mic } from 'lucide-react';
import Button from '../ui/Button';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage,
  isLoading = false
}) => {
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };
  
  return (
    <form 
      onSubmit={handleSubmit}
      className="border-t border-gray-200 bg-white p-4"
    >
      <div className="flex items-center space-x-2">
        <button 
          type="button"
          className="p-2 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <Paperclip className="h-5 w-5" />
        </button>
        
        <div className="flex-1 border border-gray-300 rounded-full overflow-hidden flex items-center bg-white">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 focus:outline-none"
            disabled={isLoading}
          />
          
          <button 
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            disabled={isLoading}
          >
            <Smile className="h-5 w-5" />
          </button>
          
          <button 
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            disabled={isLoading}
          >
            <Mic className="h-5 w-5" />
          </button>
        </div>
        
        <Button
          type="submit"
          variant="primary"
          className="!p-2 !rounded-full"
          disabled={!message.trim() || isLoading}
          isLoading={isLoading}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};

export default MessageInput;