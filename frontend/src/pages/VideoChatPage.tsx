import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Video, Mic, MicOff, VideoOff, Phone, MessageSquare, Users, Share2, X } from 'lucide-react';
import { mockAppointments } from '../data/mockData';
import Button from '../components/ui/Button';

const VideoChatPage: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [appointment, setAppointment] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  
  useEffect(() => {
    // Find the appointment
    const apt = mockAppointments.find(a => a.id === appointmentId);
    if (apt) {
      setAppointment(apt);
      
      // Simulate connection delay
      setTimeout(() => {
        setConnectionStatus('connected');
      }, 2000);
    }
    
    // Cleanup function
    return () => {
      // In a real app, this would close WebRTC connections
    };
  }, [appointmentId]);
  
  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };
  
  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
  };
  
  const endCall = () => {
    // In a real app, this would close WebRTC connections
    navigate(-1);
  };
  
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  
  if (!appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading appointment...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
      {/* Status indicator */}
      {connectionStatus !== 'connected' && (
        <div className="absolute top-0 left-0 right-0 bg-yellow-600 text-white text-center py-2 z-10">
          {connectionStatus === 'connecting' ? 'Connecting to call...' : 'Connection lost. Trying to reconnect...'}
        </div>
      )}
      
      {/* Main video area */}
      <div className="flex-1 flex">
        <div className="relative flex-1 flex items-center justify-center bg-gray-800">
          {/* Doctor's video (or placeholder) */}
          <div className="w-full h-full">
            <img
              src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Doctor"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded-full">
              <span>Dr. {appointment.doctorName.split(' ')[1]}</span>
            </div>
          </div>
          
          {/* Self video */}
          <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-700 border-2 border-gray-600 rounded-lg overflow-hidden shadow-lg">
            {videoEnabled ? (
              <img
                src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="You"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-700">
                <VideoOff className="h-10 w-10 text-gray-400" />
              </div>
            )}
          </div>
        </div>
        
        {/* Chat sidebar */}
        {isChatOpen && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            <div className="p-3 border-b border-gray-700 flex justify-between items-center">
              <h3 className="font-medium">Chat</h3>
              <button 
                onClick={toggleChat}
                className="p-1 rounded-full hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              <div className="flex items-start mb-3">
                <div className="flex-shrink-0 mr-3">
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center uppercase font-bold">
                    D
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">Hello! How are you feeling today?</p>
                  <p className="text-xs text-gray-400 mt-1">10:03 AM</p>
                </div>
              </div>
              
              <div className="flex items-start justify-end mb-3">
                <div className="bg-teal-600 rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">I'm still having the symptoms we discussed last time.</p>
                  <p className="text-xs text-teal-300 mt-1">10:05 AM</p>
                </div>
                <div className="flex-shrink-0 ml-3">
                  <div className="h-8 w-8 rounded-full bg-teal-500 flex items-center justify-center uppercase font-bold">
                    P
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-3 border-t border-gray-700">
              <div className="flex">
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  className="flex-1 bg-gray-700 border-none rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button className="bg-teal-600 rounded-r-md px-3 py-2 hover:bg-teal-700">
                  <MessageSquare className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Call controls */}
      <div className="bg-gray-800 p-4 flex justify-center">
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleAudio}
            className={`p-3 rounded-full ${audioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {audioEnabled ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
          </button>
          
          <button 
            onClick={toggleVideo}
            className={`p-3 rounded-full ${videoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {videoEnabled ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
          </button>
          
          <button 
            onClick={endCall}
            className="p-3 rounded-full bg-red-600 hover:bg-red-700"
          >
            <Phone className="h-6 w-6 transform rotate-135" />
          </button>
          
          <button 
            onClick={toggleChat}
            className={`p-3 rounded-full ${isChatOpen ? 'bg-teal-600 hover:bg-teal-700' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            <MessageSquare className="h-6 w-6" />
          </button>
          
          <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600">
            <Users className="h-6 w-6" />
          </button>
          
          <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600">
            <Share2 className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      {/* Call information */}
      <div className="bg-gray-900 px-4 py-2 text-sm text-gray-400 flex justify-between items-center">
        <div>
          Appointment: {appointment.reason}
        </div>
        <div>
          {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default VideoChatPage;