import React, { useState } from 'react';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface RegisterFormProps {
  onToggleForm: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleForm }) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [formErrors, setFormErrors] = useState<{ 
    name?: string; 
    email?: string; 
    password?: string;
    confirmPassword?: string;
  }>({});
  const { register, loading, error } = useAuth();
  
  const validateForm = (): boolean => {
    const errors: { 
      name?: string; 
      email?: string; 
      password?: string;
      confirmPassword?: string;
    } = {};
    let isValid = true;
    
    if (!name) {
      errors.name = 'Name is required';
      isValid = false;
    }
    
    if (!email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }
    
    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
    
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await register({ name, email, role }, password);
      } catch (err) {
        // Error is handled by the auth context
      }
    }
  };
  
  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
        <p className="mt-2 text-gray-600">Sign up to get started with telemedicine</p>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="text"
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          leftIcon={<User className="h-5 w-5 text-gray-400" />}
          placeholder="John Doe"
          error={formErrors.name}
          autoComplete="name"
          required
        />
        
        <Input
          type="email"
          label="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
          placeholder="youremail@example.com"
          error={formErrors.email}
          autoComplete="email"
          required
        />
        
        <Input
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
          placeholder="••••••••"
          error={formErrors.password}
          autoComplete="new-password"
          required
        />
        
        <Input
          type="password"
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
          placeholder="••••••••"
          error={formErrors.confirmPassword}
          autoComplete="new-password"
          required
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            I am a:
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                checked={role === 'patient'}
                onChange={() => setRole('patient')}
              />
              <span className="ml-2 text-gray-700">Patient</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                checked={role === 'doctor'}
                onChange={() => setRole('doctor')}
              />
              <span className="ml-2 text-gray-700">Doctor</span>
            </label>
          </div>
        </div>
        
        <Button
          type="submit"
          fullWidth
          isLoading={loading}
          leftIcon={<UserPlus className="h-5 w-5" />}
        >
          Create Account
        </Button>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onToggleForm}
              className="font-medium text-teal-600 hover:text-teal-500"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;