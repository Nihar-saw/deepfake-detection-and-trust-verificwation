import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, Lock, User, ArrowRight, Github, Chrome } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AuthPages = ({ isLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pickerType, setPickerType] = useState(null); // 'google' or 'github'
  
  const { login, signup, oauthLogin, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/upload';

  const handleOAuthTrigger = (type) => {
    setPickerType(type);
  };

  const handleOAuthSelect = async (account) => {
    const type = pickerType;
    setPickerType(null);
    setIsLoading(true);
    try {
      const mockOAuthData = {
        email: account.email,
        name: account.name,
        provider: type,
        providerId: `${type}_` + Math.random().toString(36).substr(2, 9)
      };
      await oauthLogin(type, mockOAuthData);
      showToast(`Welcome back, ${account.name.split(' ')[0]}!`);
      navigate(from, { replace: true });
    } catch (err) {
      showToast(`${type} login failed.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("AuthPages: Attempting", isLogin ? "Login" : "Signup", "for", email);
    
    try {
      if (isLogin) {
        await login(email, password);
        showToast("Welcome back!");
      } else {
        await signup(email, name, password);
        showToast("Account created successfully!");
      }
      console.log("AuthPages: Auth Success, redirecting to", from);
      navigate(from, { replace: true });
    } catch (err) {
      console.error("AuthPages: Error:", err);
      showToast("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass p-10 rounded-[2.5rem] shadow-2xl border border-white/10 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 to-indigo-500" />
        
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-primary-500/10 rounded-2xl mb-6">
            <Shield className="w-10 h-10 text-primary-500" />
          </div>
          <h2 className="text-3xl font-black mb-2 tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {isLogin ? 'Access your forensic dashboard' : 'Join the mission for truth and transparency'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe" 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-sm font-medium"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" 
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-sm font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-sm font-medium"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-primary-500 text-white rounded-2xl font-black shadow-xl shadow-primary-500/20 hover:bg-primary-600 transition-all active:scale-[0.98] flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isLoading ? (
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <Link 
              to={isLogin ? '/signup' : '/login'} 
              className="ml-2 text-primary-500 font-black hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </Link>
          </p>

          <div className="relative mb-8">
             <div className="absolute inset-x-0 top-1/2 h-[1px] bg-slate-100 dark:bg-white/5" />
             <span className="relative px-4 bg-white dark:bg-[#0f172a] text-[10px] font-black uppercase tracking-widest text-slate-400">Or continue with</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleOAuthTrigger('google')}
              className="flex items-center justify-center space-x-2 py-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-white/5 hover:bg-slate-100 transition-colors"
            >
              <Chrome className="w-4 h-4" />
              <span className="text-xs font-bold">Google</span>
            </button>
            <button 
              onClick={() => handleOAuthTrigger('github')}
              className="flex items-center justify-center space-x-2 py-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-white/5 hover:bg-slate-100 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="text-xs font-bold">GitHub</span>
            </button>
          </div>
        </div>

        {/* High-Fidelity Account Picker Modal */}
        <AnimatePresence>
          {pickerType && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                className="bg-[#0b0c0f] w-full max-w-[440px] rounded-[1.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden border border-white/10 text-white font-sans"
              >
                <div className="p-10 pb-6 text-center">
                  <div className="flex justify-center mb-6">
                    {pickerType === 'google' ? (
                      <Chrome className="w-8 h-8 text-primary-500" />
                    ) : (
                      <Github className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <h3 className="text-[28px] font-medium text-white mb-2 leading-tight">Choose an account</h3>
                  <p className="text-base text-slate-300 mb-8 font-normal">
                    to continue to <span className="text-sky-400 font-medium">DeepTrust</span>
                  </p>
                  
                  <div className="space-y-0 -mx-10 border-t border-white/10">
                    {(pickerType === 'google' ? [
                      { name: 'ALN 36 XH Nihar', email: 'nihar11sawant@gmail.com', avatar: 'https://i.pravatar.cc/150?u=nihar1', status: null },
                      { name: 'Nihar Sawant', email: '124nihar2027@sjcem.edu.in', avatar: 'N', status: 'Signed out' },
                      { name: 'nihar sawant', email: 'niharsawant386@gmail.com', avatar: 'n', status: null }
                    ] : [
                      { name: 'nihar-saw', email: 'saw.work@github.com', avatar: 'https://i.pravatar.cc/150?u=github1', status: null },
                      { name: 'DeepTrust Master', email: 'dev@deeptrust.io', avatar: 'D', status: null }
                    ]).map((account, idx) => (
                      <button
                        key={account.email}
                        onClick={() => handleOAuthSelect(account)}
                        className={`w-full flex items-center space-x-4 px-10 py-5 transition-all hover:bg-white/5 text-left relative ${idx !== 0 ? 'border-t border-white/10' : ''}`}
                      >
                        <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-indigo-600 border border-white/10 shrink-0">
                          {account.avatar.startsWith('http') ? (
                            <img src={account.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-bold text-white uppercase">{account.avatar}</span>
                          )}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="font-medium text-[15px] text-white truncate">{account.name}</p>
                          <p className="text-sm text-slate-400 truncate">{account.email}</p>
                        </div>
                        {account.status && (
                          <span className="text-[13px] text-slate-400 font-normal shrink-0">{account.status}</span>
                        )}
                      </button>
                    ))}
                    
                    <button className="w-full flex items-center space-x-4 px-10 py-5 transition-all hover:bg-white/5 border-t border-white/10 text-left">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-transparent border border-white/20 shrink-0">
                        <User className="w-5 h-5 text-slate-300" />
                      </div>
                      <p className="font-medium text-[15px] text-sky-400">Use another account</p>
                    </button>
                  </div>
                </div>
                
                <div className="px-10 py-8 text-[13px] leading-relaxed text-slate-400 font-normal">
                  <p>
                    Before using this app, you can review DeepTrust's{' '}
                    <a href="#" className="text-sky-400 hover:underline">privacy policy</a> and{' '}
                    <a href="#" className="text-sky-400 hover:underline">terms of service</a>.
                  </p>
                </div>

                <div className="px-10 pb-8 flex justify-end">
                  <button 
                    onClick={() => setPickerType(null)}
                    className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AuthPages;
