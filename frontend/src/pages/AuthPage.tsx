import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { Stethoscope } from 'lucide-react';

const AuthPage: React.FC<{ defaultView?: 'login' | 'register' }> = ({ 
  defaultView = 'login' 
}) => {
  const [showLogin, setShowLogin] = useState(defaultView === 'login');
  const { isAuthenticated } = useAuth();
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="py-6">
        <div className="flex justify-center">
          <div className="flex items-center text-2xl font-bold text-teal-600">
            <Stethoscope className="h-8 w-8 mr-2" />
            TeleMed Kenya
          </div>
        </div>
      </div>
      
      <div className="flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {showLogin ? (
            <LoginForm onToggleForm={() => setShowLogin(false)} />
          ) : (
            <RegisterForm onToggleForm={() => setShowLogin(true)} />
          )}
        </div>
      </div>
      
      <footer className="py-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} TeleMed Kenya. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthPage;