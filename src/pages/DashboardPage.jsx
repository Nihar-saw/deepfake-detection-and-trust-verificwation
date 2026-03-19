import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, AlertTriangle, Info, CheckCircle2, 
  BarChart, Fingerprint, FileSearch, ShieldAlert,
  Download, Share2, RefreshCw, QrCode, Cpu, Database
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip 
} from 'recharts';
import { useToast } from '../App';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const [result, setResult] = useState(null);
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Try to get result from localStorage (passed from UploadPage)
    const stored = localStorage.getItem('currentAnalysis');
    if (stored) {
      setResult(JSON.parse(stored));
    } else {
      // Fallback if accessed directly
      showToast("No active analysis found. Redirecting to upload...");
      navigate('/upload');
    }
  }, []);

  if (!result) return (
    <div className="min-h-screen flex items-center justify-center">
      <RefreshCw className="w-10 h-10 animate-spin text-primary-500" />
    </div>
  );

  const chartData = [
    { name: 'Authenticity', value: result.authenticity_score },
    { name: 'Deception', value: 100 - result.authenticity_score },
  ];

  const barData = result.forensic_breakdown || [
    { name: 'Facial', score: 85 },
    { name: 'Audio', score: 62 },
    { name: 'Metadata', score: 98 },
    { name: 'Lighting', score: 45 },
  ];

  const COLORS = ['#0ea5e9', '#f43f5e'];

  const handleAction = (action) => {
    showToast(`${action} functionality is simulated in this demo.`);
  };

  const getRiskColor = (score) => {
    if (score > 80) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (score > 50) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
  };

  const getRiskLabel = (score) => {
    if (score > 80) return 'Likely Authentic';
    if (score > 50) return 'Suspicious / Flagged';
    return 'Likely Deepfake';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-black mb-1">Analysis Results</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            File: {result.file_name} • ID: {result.id}
          </p>
        </motion.div>
        <div className="flex space-x-3">
          <button 
            onClick={() => handleAction('Share')}
            className="p-2 glass rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button 
            onClick={() => handleAction('Download')}
            className="p-2 glass rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Download className="w-5 h-5" />
          </button>
          <button 
            onClick={() => navigate('/upload')}
            className="flex items-center space-x-2 px-6 py-2 bg-primary-500 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20 hover:bg-primary-600 transition-all hover:scale-105"
          >
            <RefreshCw className="w-4 h-4" />
            <span>New Scan</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Scores & Charts */}
        <div className="lg:col-span-1 space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-8 rounded-3xl text-center border border-white/10 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-primary-500/5 pointer-events-none" />
            <h3 className="text-lg font-bold mb-6">Authenticity Score</h3>
            <div className="w-full h-64 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-5xl font-black text-slate-900 dark:text-white">{result.authenticity_score}%</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-1">Authentic</span>
              </div>
            </div>
            
            <div className={`mt-6 py-4 px-4 rounded-2xl border font-black text-sm tracking-wide ${getRiskColor(result.authenticity_score)}`}>
              {getRiskLabel(result.authenticity_score).toUpperCase()}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-6 rounded-3xl border border-white/10"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold">Confidence Level</h3>
              <div className="p-1 px-2 bg-slate-100 dark:bg-slate-800 rounded text-[10px] uppercase font-bold text-slate-500">{result.confidence}</div>
            </div>
            <div className="flex items-center space-x-4">
               <div className="flex-1 h-4 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-[2px]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: result.confidence === 'High' ? '95%' : result.confidence === 'Medium' ? '65%' : '30%' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-indigo-500 rounded-full shadow-inner"
                  />
               </div>
               <span className="font-black text-indigo-500 text-sm uppercase">{result.confidence}</span>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Detailed Breakdown & Verification */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass p-8 rounded-3xl border border-white/10">
            <h3 className="text-xl font-bold mb-8 flex items-center space-x-3">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <BarChart className="w-5 h-5 text-primary-500" />
              </div>
              <span>Forensic Breakdown</span>
            </h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={barData} layout="vertical" margin={{ left: 10, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#94a3b833" />
                  <XAxis type="number" hide domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 13, fontWeight: 'bold'}} width={90} />
                  <Tooltip 
                    cursor={{fill: '#cbd5e122'}}
                    contentStyle={{ borderRadius: '16px', border: '1px solid #ffffff22', backgroundColor: '#0f172aee', backdropFilter: 'blur(8px)', color: '#fff' }}
                    itemStyle={{ color: '#0ea5e9', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="score" fill="url(#colorPrimary)" radius={[0, 8, 8, 0]} barSize={24} />
                  <defs>
                    <linearGradient id="colorPrimary" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#0ea5e9" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                </ReBarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-8 rounded-3xl border border-white/10 relative overflow-hidden">
              <h3 className="text-xl font-bold mb-6 flex items-center space-x-3 text-rose-500">
                <Fingerprint className="w-5 h-5" />
                <span>Detection Flags</span>
              </h3>
              <ul className="space-y-4">
                {result.flags.map((flag, i) => (
                  <li key={i} className="flex items-start space-x-3 text-sm">
                    <AlertTriangle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-slate-300 font-medium">{flag}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-primary-500/5 to-transparent relative overflow-hidden">
              <h3 className="text-xl font-bold mb-6 flex items-center space-x-3 text-primary-400">
                <ShieldCheck className="w-6 h-6" />
                <span>Source Ledger</span>
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white/60 dark:bg-slate-800/40 rounded-2xl border border-white/10">
                   <div className="flex items-center space-x-3">
                      <Database className="w-5 h-5 text-primary-400" />
                      <div className="text-[10px] text-slate-500 font-mono">0x{result.id.slice(-8)}...HASH</div>
                   </div>
                   <div className="px-3 py-1 bg-emerald-500/10 text-emerald-600 text-[10px] font-black rounded-lg">VERIFIED</div>
                </div>
                <div className="flex items-center space-x-4 p-4 rounded-2xl bg-white/40 dark:bg-slate-800/20">
                  <QrCode className="w-10 h-10" />
                  <div className="text-xs font-bold">Encrypted Digital Asset Passport</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
