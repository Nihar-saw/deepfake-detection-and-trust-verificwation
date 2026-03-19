import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, CheckCircle, ArrowRight, Play, Upload, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();

  const handlePlaceholderAction = (feature) => {
    showToast(`${feature} is a placeholder in this demo.`);
  };

  const features = [
    {
      icon: <Lock className="w-6 h-6 text-primary-500" />,
      title: "Encrypted Analysis",
      description: "Your media is processed with end-to-end encryption and never stored on our servers without permission."
    },
    {
      icon: <Eye className="w-6 h-6 text-indigo-500" />,
      title: "Forensic Detection",
      description: "Advanced AI models detect pixel-level inconsistencies and audio-visual mismatches."
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-emerald-500" />,
      title: "Trust Verification",
      description: "Blockchain-based source verification ensures the authenticity of the media you see."
    }
  ];

  return (
    <div className="relative overflow-hidden bg-white dark:bg-slate-950">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 md:pt-32 md:pb-40 px-4 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block py-1 px-4 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-sm font-black mb-6 border border-primary-500/20 uppercase tracking-tighter">
            Next-Gen AI Verification
          </span>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
            Verify Before <br />
            <span className="text-gradient">You Trust</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-12 leading-relaxed font-medium">
            Protect yourself from deepfakes and digital misinformation. Our forensic AI analyzes 
            images, videos, and audio to provide instant authenticity verification.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to={isAuthenticated ? "/upload" : "/login"}
              className="w-full sm:w-auto px-12 py-5 bg-primary-500 text-white rounded-[2rem] font-black flex items-center justify-center space-x-3 shadow-2xl shadow-primary-500/40 hover:bg-primary-600 transition-all hover:scale-105 active:scale-95 group"
            >
              <Upload className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
              <span>{isAuthenticated ? "Go to Workspace" : "Sign In to Start"}</span>
            </Link>
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-12 py-5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-[2rem] font-black flex items-center justify-center space-x-3 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Check Trends</span>
            </Link>
          </div>
        </motion.div>

        {/* Hero Image placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-24 relative mx-auto max-w-5xl rounded-[3rem] overflow-hidden glass p-4 shadow-2xl border border-white/20"
        >
          <div className="aspect-video bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 to-indigo-500/10" />
            
            {/* Mock Dashboard UI */}
            <div className="z-10 w-full h-full p-8 flex flex-col items-center justify-center space-y-6">
               <motion.div 
                 animate={{ scale: [1, 1.02, 1] }} 
                 transition={{ repeat: Infinity, duration: 4 }}
                 className="p-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[3rem] shadow-2xl w-72 text-center border border-white/20"
               >
                 <div className="w-16 h-16 bg-primary-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-primary-500/40 rotate-3">
                   <Shield className="w-8 h-8 text-white" />
                 </div>
                 <div className="text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">98%</div>
                 <div className="text-[10px] text-emerald-500 font-extrabold uppercase tracking-widest px-4 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20 w-fit mx-auto">Authentic Source</div>
               </motion.div>
            </div>

            <button 
              onClick={() => handlePlaceholderAction('Video Player')}
              className="absolute bottom-8 right-8 p-6 bg-white/20 backdrop-blur-2xl rounded-full text-white hover:bg-white/40 transition-all active:scale-90 border border-white/20"
            >
              <Play className="w-8 h-8 fill-current" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-slate-50 dark:bg-slate-900/40 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">Detection Simplified</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Forensic tools designed for truth and transparency.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -16 }}
                className="p-12 bg-white dark:bg-slate-800 rounded-[3.5rem] shadow-xl border border-slate-100 dark:border-white/5 group transition-all"
              >
                <div className="mb-10 p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl w-fit group-hover:bg-primary-500 group-hover:text-white transition-colors">{f.icon}</div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">{f.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {f.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-32 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-24">
          <div className="flex-1">
            <h2 className="text-6xl font-black mb-10 tracking-tight leading-[0.9]">Why Choose <br /><span className="text-primary-500">DeepTrust</span>?</h2>
            <div className="space-y-10">
              <div className="flex items-start space-x-8">
                <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-2xl font-black mb-2 tracking-tight">Real-time Analysis</h4>
                  <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Get results in seconds with our high-performance AI clusters.</p>
                </div>
              </div>
              <div className="flex items-start space-x-8">
                <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                  <CheckCircle className="w-8 h-8 text-indigo-500" />
                </div>
                <div>
                  <h4 className="text-2xl font-black mb-2 tracking-tight">Transparent Logic</h4>
                  <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">We don't just give a score; we show you why the media was flagged.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 neumorph p-16 rounded-[4rem] w-full aspect-square flex items-center justify-center relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-5">
               <Shield className="w-64 h-64" />
             </div>
             <div className="grid grid-cols-2 gap-10 w-full h-full items-center justify-center relative z-10">
                {[
                  { val: '10M+', label: 'Scanned', color: 'text-primary-500', offset: '' },
                  { val: '99.9%', label: 'Accuracy', color: 'text-indigo-500', offset: 'mt-12' },
                  { val: '24/7', label: 'Monitoring', color: 'text-emerald-500', offset: '-mt-12' },
                  { val: '0.2s', label: 'Latency', color: 'text-rose-500', offset: '' }
                ].map((stat, i) => (
                  <div key={i} className={`p-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-[2.5rem] shadow-2xl border border-white/20 h-44 flex flex-col justify-center items-center group hover:scale-105 transition-transform ${stat.offset}`}>
                    <div className={`text-4xl font-black ${stat.color}`}>{stat.val}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] mt-3">{stat.label}</div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
