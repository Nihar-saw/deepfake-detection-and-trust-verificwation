import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Search, Filter, Calendar, 
  ChevronRight, ArrowRight, Download, MoreHorizontal,
  CheckCircle, AlertCircle, ShieldAlert, RefreshCw
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../App';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/history');
      setHistory(response.data);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch history from server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleAction = (action) => {
    showToast(`${action} functionality is simulated.`);
  };

  const getStatusBadge = (score) => {
    if (score > 80) return <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase rounded-full border border-emerald-500/20 flex items-center space-x-1 w-fit tracking-wider"><CheckCircle className="w-3 h-3" /> <span>Safe</span></span>;
    if (score > 50) return <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase rounded-full border border-amber-500/20 flex items-center space-x-1 w-fit tracking-wider"><AlertCircle className="w-3 h-3" /> <span>Suspicious</span></span>;
    return <span className="px-3 py-1 bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase rounded-full border border-rose-500/20 flex items-center space-x-1 w-fit tracking-wider"><ShieldAlert className="w-3 h-3" /> <span>Deepfake</span></span>;
  };

  const jumpToResult = (item) => {
    localStorage.setItem('currentAnalysis', JSON.stringify(item));
    navigate('/dashboard');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-black mb-2 tracking-tight">Report History</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Access your secure media verification archive.</p>
        </motion.div>
        <div className="flex space-x-3 w-full md:w-auto">
          <button 
            onClick={fetchHistory}
            className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 text-slate-500 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : history.length === 0 ? (
        <div className="glass p-20 rounded-[2rem] text-center border border-white/10">
           <FileText className="w-16 h-16 text-slate-300 mx-auto mb-6" />
           <h3 className="text-xl font-bold mb-2">No reports yet</h3>
           <p className="text-slate-500 mb-8">Upload your first file to start the history log.</p>
           <Link to="/upload" className="px-8 py-3 bg-primary-500 text-white rounded-xl font-bold">Start Upload</Link>
        </div>
      ) : (
        <div className="glass rounded-[2rem] border border-white/10 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/50">
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Digital Asset</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Timestamp</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Format</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Trust Index</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Forensic Result</th>
                  <th className="px-8 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {history.map((item, i) => (
                  <motion.tr 
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-xl group-hover:scale-110 transition-transform">
                          <FileText className="w-5 h-5 text-primary-500" />
                        </div>
                        <div>
                          <div className="text-sm font-black text-slate-900 dark:text-white group-hover:text-primary-500 transition-colors">{item.file_name}</div>
                          <div className="text-[10px] text-slate-500 font-mono tracking-tighter uppercase mt-0.5">{item.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-xs text-slate-500 font-mono font-bold">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-black text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{item.type}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${item.authenticity_score > 80 ? 'bg-emerald-500' : item.authenticity_score > 50 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                            style={{ width: `${item.authenticity_score}%` }}
                          />
                        </div>
                        <span className="text-xs font-black w-8">{Math.round(item.authenticity_score)}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">{getStatusBadge(item.authenticity_score)}</td>
                    <td className="px-8 py-6 text-right">
                      <button onClick={() => jumpToResult(item)} className="p-2 rounded-full hover:bg-white dark:hover:bg-slate-700 transition-all active:scale-90">
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary-500" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const Loader2 = ({ className }) => <RefreshCw className={className + " animate-spin"} />;

export default HistoryPage;
