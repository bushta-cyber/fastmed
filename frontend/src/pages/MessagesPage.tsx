import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockUsers, mockConversations, mockMessages } from '../data/mockData';
import Card from '../components/ui/Card';
import MessageList from '../components/messaging/MessageList';
import MessageInput from '../components/messaging/MessageInput';
import { User, Search } from 'lucide-react';

const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    mockConversations.length > 0 ? mockConversations[0].id : null
  );
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter conversations relevant to the current user
  const userConversations = mockConversations.filter(conv => 
    conv.participants.includes(user?.id || '')
  );
  
  // Filter messages for the selected conversation
  const conversationMessages = mockMessages.filter(msg => {
    const conversation = userConversations.find(conv => conv.id === selectedConversation);
    return conversation && conversation.participants.includes(msg.senderId) && conversation.participants.includes(msg.receiverId);
  });
  
  // Get the other participant in each conversation
  const getOtherParticipant = (participants: string[]) => {
    const otherId = participants.find(id => id !== user?.id);
    return mockUsers.find(u => u.id === otherId);
  };
  
  // Filter conversations by search query
  const filteredConversations = userConversations.filter(conv => {
    if (!searchQuery) return true;
    
    const otherUser = getOtherParticipant(conv.participants);
    return otherUser?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  // Get all participants for the current conversation
  const conversationParticipants = selectedConversation 
    ? userConversations.find(conv => conv.id === selectedConversation)?.participants.map(
        id => mockUsers.find(u => u.id === id)
      ).filter(Boolean) as User[]
    : [];
  
  const handleSendMessage = (content: string) => {
    // In a real app, this would send the message to the API
    console.log('Sending message:', content);
    // The UI would be updated with the new message
  };
  
  return (
    <div className="h-[calc(100vh-9rem)]">
      <div className="flex h-full rounded-lg overflow-hidden shadow-sm border border-gray-200">
        {/* Conversations sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900 mb-4">Messages</h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map(conversation => {
                const otherUser = getOtherParticipant(conversation.participants);
                const isActive = selectedConversation === conversation.id;
                
                return (
                  <div
                    key={conversation.id}
                    className={`p-4 border-b border-gray-200 cursor-pointer ${
                      isActive ? 'bg-teal-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-start">
                      {otherUser?.profileImage ? (
                        <img
                          src={otherUser.profileImage}
                          alt={otherUser.name}
                          className="h-12 w-12 rounded-full object-cover mr-3"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          <User className="h-6 w-6 text-gray-600" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-gray-900 truncate">
                            {otherUser?.name}
                          </h3>
                          {conversation.lastMessage && (
                            <span className="text-xs text-gray-500">
                              {new Date(conversation.lastMessage.timestamp).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          )}
                        </div>
                        {conversation.lastMessage ? (
                          <p className="text-sm text-gray-500 truncate">
                            {conversation.lastMessage.content}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-400 italic">
                            No messages yet
                          </p>
                        )}
                        {conversation.unreadCount > 0 && (
                          <div className="mt-1">
                            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-teal-600 rounded-full">
                              {conversation.unreadCount}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center text-gray-500">
                <User className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p>No conversations found</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Messages area */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {selectedConversation ? (
            <>
              {/* Conversation header */}
              <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                  {(() => {
                    const otherUser = getOtherParticipant(
                      userConversations.find(c => c.id === selectedConversation)?.participants || []
                    );
                    
                    return (
                      <>
                        {otherUser?.profileImage ? (
                          <img
                            src={otherUser.profileImage}
                            alt={otherUser.name}
                            className="h-10 w-10 rounded-full object-cover mr-3"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900">{otherUser?.name}</h3>
                          <p className="text-xs text-gray-500">
                            {otherUser?.role === 'doctor' ? 'Doctor' : 'Patient'}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
              
              {/* Messages */}
              <MessageList 
                messages={conversationMessages} 
                participants={conversationParticipants}
              />
              
              {/* Message input */}
              <MessageInput onSendMessage={handleSendMessage} />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center p-6">
                <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <MessageList className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Your Messages</h3>
                <p className="text-gray-500">
                  Select a conversation or start a new one
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;