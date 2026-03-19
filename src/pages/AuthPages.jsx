import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, User, Github, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AuthPages = ({ isLogin }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-8 md:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {isLogin 
              ? 'Enter your credentials to access your secure reports.' 
              : 'Join the network of trust and start verifying media today.'}
          </p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-400 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="email" 
                placeholder="name@company.com" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-400 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            className="w-full py-4 bg-primary-500 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-xl shadow-primary-500/20 hover:bg-primary-600 transition-all active:scale-95 mt-4"
          >
            <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-8 flex items-center space-x-4">
          <div className="flex-grow h-[1px] bg-slate-100 dark:bg-slate-800" />
          <span className="text-xs text-slate-400 font-medium">OR CONTINUE WITH</span>
          <div className="flex-grow h-[1px] bg-slate-100 dark:bg-slate-800" />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center space-x-2 py-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="text-sm font-bold">Google</span>
          </button>
          <button className="flex items-center justify-center space-x-2 py-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <Github className="w-5 h-5 text-slate-900 dark:text-white" />
            <span className="text-sm font-bold">GitHub</span>
          </button>
        </div>

        <p className="mt-10 text-center text-sm text-slate-500">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <Link 
            to={isLogin ? '/signup' : '/login'} 
            className="text-primary-500 font-bold hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
