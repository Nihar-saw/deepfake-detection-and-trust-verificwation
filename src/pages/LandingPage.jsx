import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, CheckCircle, ArrowRight, Play, Upload, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../App';

const LandingPage = () => {
  const { showToast } = useToast();

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
          <span className="inline-block py-1 px-4 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-sm font-semibold mb-6 border border-primary-500/20">
            Next-Gen AI Verification
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Verify Before <br />
            <span className="text-gradient">You Trust</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
            Protect yourself from deepfakes and digital misinformation. Our forensic AI analyzes 
            images, videos, and audio to provide instant authenticity verification.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/upload"
              className="w-full sm:w-auto px-10 py-4 bg-primary-500 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-2xl shadow-primary-500/30 hover:bg-primary-600 transition-all hover:scale-105 active:scale-95"
            >
              <Upload className="w-5 h-5" />
              <span>Upload Media</span>
            </Link>
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-10 py-4 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all hover:scale-105 active:scale-95"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Check Trends</span>
            </Link>
          </div>
        </motion.div>

        {/* Hero Image / Animated UI Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-20 relative mx-auto max-w-5xl rounded-3xl overflow-hidden glass p-4 shadow-2xl border border-white/20"
        >
          <div className="aspect-video bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/5 to-indigo-500/5" />
            
            {/* Mock Dashboard UI */}
            <div className="z-10 w-full h-full p-8 flex flex-col items-center justify-center space-y-6">
               <motion.div 
                 animate={{ scale: [1, 1.02, 1] }} 
                 transition={{ repeat: Infinity, duration: 3 }}
                 className="p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-xl w-64 text-center border border-white/10"
               >
                 <div className="w-12 h-12 bg-primary-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-primary-500/40">
                   <Shield className="w-6 h-6 text-white" />
                 </div>
                 <div className="text-3xl font-black text-slate-900 dark:text-white">98%</div>
                 <div className="text-sm text-emerald-500 font-bold capitalize">Authentic Source</div>
               </motion.div>

               <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
                 <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "85%" }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="h-full bg-primary-500" 
                    />
                 </div>
                 <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "12%" }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      className="h-full bg-indigo-500" 
                    />
                 </div>
               </div>
            </div>

            <button 
              onClick={() => handlePlaceholderAction('Video Player')}
              className="absolute bottom-6 right-6 p-5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all active:scale-90"
            >
              <Play className="w-6 h-6 fill-current" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Deepfake Detection Simplified</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">Powerful forensic tools designed for truth and transparency.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -12 }}
                className="p-10 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-lg border border-slate-100 dark:border-slate-700/50"
              >
                <div className="mb-8 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl w-fit">{f.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  {f.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Deep Trust Section */}
      <section className="py-32 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-20">
          <div className="flex-1">
            <h2 className="text-5xl font-black mb-8">Why Trust Us?</h2>
            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className="p-3 bg-emerald-500/10 rounded-2xl">
                  <CheckCircle className="w-7 h-7 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1">Real-time Analysis</h4>
                  <p className="text-slate-500 dark:text-slate-400">Get results in seconds with our high-performance AI clusters.</p>
                </div>
              </div>
              <div className="flex items-start space-x-6">
                <div className="p-3 bg-indigo-500/10 rounded-2xl">
                  <CheckCircle className="w-7 h-7 text-indigo-500" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1">Transparent Explanations</h4>
                  <p className="text-slate-500 dark:text-slate-400">We don't just give a score; we show you why the media was flagged.</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => handlePlaceholderAction('Early Access')}
              className="mt-12 inline-flex items-center space-x-3 text-primary-500 font-black hover:underline group"
            >
              <span className="text-lg">Start protecting your digital identity</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
          <div className="flex-1 neumorph p-16 rounded-[3.5rem] w-full aspect-square flex items-center justify-center">
             <div className="grid grid-cols-2 gap-8 w-full h-full items-center justify-center">
                <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 h-40 flex flex-col justify-center items-center group hover:scale-105 transition-transform">
                  <div className="text-3xl font-black text-primary-500">10M+</div>
                  <div className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mt-2">Media Scanned</div>
                </div>
                <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 h-40 flex flex-col justify-center items-center mt-12 group hover:scale-105 transition-transform">
                  <div className="text-3xl font-black text-indigo-500">99.9%</div>
                  <div className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mt-2">Accuracy</div>
                </div>
                <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 h-40 flex flex-col justify-center items-center -mt-12 group hover:scale-105 transition-transform">
                  <div className="text-3xl font-black text-emerald-500">24/7</div>
                  <div className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mt-2">Monitoring</div>
                </div>
                <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 h-40 flex flex-col justify-center items-center group hover:scale-105 transition-transform">
                  <div className="text-3xl font-black text-rose-500">0.2s</div>
                  <div className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mt-2">Latency</div>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
