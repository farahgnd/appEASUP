
import React, { useState } from 'react';
import { Mail, Lock, Loader, Bot } from 'lucide-react';

interface AuthScreenProps {
  onLoginSuccess: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and password cannot be empty.');
      return;
    }
    setError('');
    setIsLoading(true);

    // Simulate network request
    setTimeout(() => {
      // In a real app, you'd have actual auth logic here.
      // For this demo, any non-empty input is considered a success.
      console.log(`${isLoginView ? 'Logging in' : 'Signing up'} with`, { email });
      setIsLoading(false);
      onLoginSuccess();
    }, 1500);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-8 relative z-10 animate-fade-in">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Bot size={64} className="mx-auto text-green-400 mb-4" />
          <h1 className="text-3xl font-orbitron text-white">EASUP System Access</h1>
          <p className="text-gray-400 mt-2">Authenticate to continue.</p>
        </div>

        <div className="bg-gray-800/30 p-2 rounded-full flex justify-around mb-8 border border-gray-700">
          <button 
            onClick={() => setIsLoginView(true)}
            className={`w-1/2 py-2 rounded-full text-sm font-bold transition ${isLoginView ? 'bg-green-500 text-white' : 'text-gray-300'}`}
          >
            SIGN IN
          </button>
          <button 
            onClick={() => setIsLoginView(false)}
            className={`w-1/2 py-2 rounded-full text-sm font-bold transition ${!isLoginView ? 'bg-green-500 text-white' : 'text-gray-300'}`}
          >
            CREATE ACCOUNT
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full bg-gray-800 border-2 border-gray-700 rounded-full py-3 pr-4 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition"
              disabled={isLoading}
            />
          </div>
          <div className="relative">
            <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-gray-800 border-2 border-gray-700 rounded-full py-3 pr-4 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition"
              disabled={isLoading}
            />
          </div>

          {error && <p className="text-red-400 text-xs text-center animate-fade-in">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 text-white font-bold py-3 rounded-full hover:bg-green-400 transition transform active:scale-95 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && <Loader size={20} className="animate-spin" />}
            {isLoading ? 'Authenticating...' : (isLoginView ? 'Sign In' : 'Create Account')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthScreen;
