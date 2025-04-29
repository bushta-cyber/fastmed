import React, { useRef, useEffect } from 'react';
import { User, Message } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface MessageListProps {
  messages: Message[];
  participants: User[];
}

const MessageList: React.FC<MessageListProps> = ({ messages, participants }) => {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const getUser = (userId: string) => {
    return participants.find(p => p.id === userId);
  };
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };
  
  const isNewDay = (current: string, previous?: string) => {
    if (!previous) return true;
    
    const currentDate = new Date(current).setHours(0, 0, 0, 0);
    const previousDate = new Date(previous).setHours(0, 0, 0, 0);
    
    return currentDate !== previousDate;
  };
  
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((message, index) => {
        const isCurrentUser = message.senderId === user?.id;
        const sender = getUser(message.senderId);
        const showNewDay = isNewDay(
          message.timestamp, 
          index > 0 ? messages[index - 1].timestamp : undefined
        );
        
        return (
          <React.Fragment key={message.id}>
            {showNewDay && (
              <div className="flex justify-center my-4">
                <div className="bg-gray-200 text-gray-600 text-sm px-3 py-1 rounded-full">
                  {formatDate(message.timestamp)}
                </div>
              </div>
            )}
            
            <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
              <div className="flex flex-col max-w-[75%]">
                {!isCurrentUser && (
                  <div className="flex items-center mb-1 text-xs text-gray-500">
                    {sender?.profileImage ? (
                      <img 
                        src={sender.profileImage} 
                        alt={sender.name} 
                        className="h-5 w-5 rounded-full mr-1"
                      />
                    ) : (
                      <div className="h-5 w-5 rounded-full bg-gray-300 mr-1"></div>
                    )}
                    <span>{sender?.name}</span>
                  </div>
                )}
                <div
                  className={`rounded-lg px-4 py-2 inline-block ${
                    isCurrentUser
                      ? 'bg-teal-600 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                <span className={`text-xs text-gray-500 mt-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          </React.Fragment>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;