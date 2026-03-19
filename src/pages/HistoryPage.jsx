import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Search, Filter, Calendar, 
  ChevronRight, ArrowRight, Download, MoreHorizontal,
  CheckCircle, AlertCircle, ShieldAlert, RefreshCw,
  X, Shield, Clock, HardDrive, BarChart3, Activity
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const fetchHistory = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/history?userId=${user.id}`);
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
  }, [user]);

  const getStatusBadge = (score) => {
    if (score > 80) return <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase rounded-full border border-emerald-500/20 flex items-center space-x-1 w-fit tracking-wider"><CheckCircle className="w-3 h-3" /> <span>Safe</span></span>;
    if (score > 50) return <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase rounded-full border border-amber-500/20 flex items-center space-x-1 w-fit tracking-wider"><AlertCircle className="w-3 h-3" /> <span>Suspicious</span></span>;
    return <span className="px-3 py-1 bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase rounded-full border border-rose-500/20 flex items-center space-x-1 w-fit tracking-wider"><ShieldAlert className="w-3 h-3" /> <span>Deepfake</span></span>;
  };

  const jumpToResult = (item) => {
    localStorage.setItem('currentAnalysis', JSON.stringify(item));
    navigate('/dashboard');
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    if (typeof bytes === 'string') return bytes;
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
                    onClick={() => setSelectedItem(item)}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group cursor-pointer"
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
                      <div className="text-[9px] text-slate-400 font-normal mt-0.5">{new Date(item.timestamp).toLocaleTimeString()}</div>
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
                      <button onClick={(e) => { e.stopPropagation(); jumpToResult(item); }} className="p-2 rounded-full hover:bg-white dark:hover:bg-slate-700 transition-all active:scale-90">
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

      {/* Forensic Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10"
            >
              <div className="p-8 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/30">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-primary-500 rounded-2xl shadow-lg shadow-primary-500/20">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black">Forensic Insight</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{selectedItem.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 pb-10 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Analysis Timestamp</label>
                      <div className="flex items-center space-x-2 text-sm font-bold">
                        <Calendar className="w-4 h-4 text-primary-500" />
                        <span>{new Date(selectedItem.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Digital Asset Info</label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-white/5">
                          <span className="text-xs text-slate-500">File Name</span>
                          <span className="text-xs font-black truncate max-w-[150px]">{selectedItem.file_name}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-white/5">
                          <span className="text-xs text-slate-500">Format</span>
                          <span className="text-xs font-black">{selectedItem.type}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-white/5">
                          <span className="text-xs text-slate-500">Size</span>
                          <span className="text-xs font-black">{formatFileSize(selectedItem.size)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="glass p-6 rounded-3xl border border-white/10 flex flex-col items-center justify-center text-center">
                    <div className="relative w-32 h-32 mb-4">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="58"
                          fill="transparent"
                          stroke="currentColor"
                          strokeWidth="8"
                          className="text-slate-100 dark:text-slate-800"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="58"
                          fill="transparent"
                          stroke="currentColor"
                          strokeWidth="8"
                          strokeDasharray={364.4}
                          strokeDashoffset={364.4 - (364.4 * selectedItem.authenticity_score) / 100}
                          strokeLinecap="round"
                          className={`${selectedItem.authenticity_score > 80 ? 'text-emerald-500' : selectedItem.authenticity_score > 50 ? 'text-amber-500' : 'text-rose-500'} transition-all duration-1000`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black">{Math.round(selectedItem.authenticity_score)}%</span>
                        <span className="text-[8px] font-black uppercase text-slate-400">Trust Index</span>
                      </div>
                    </div>
                    <div className="mt-2">{getStatusBadge(selectedItem.authenticity_score)}</div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-4">Forensic Breakdown</label>
                    <div className="grid grid-cols-2 gap-4">
                      {Array.isArray(selectedItem.forensic_breakdown) ? selectedItem.forensic_breakdown.map((stat) => (
                        <div key={stat.name} className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-white/5">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">{stat.name}</span>
                            <span className="text-xs font-black">{stat.score}%</span>
                          </div>
                          <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary-500 rounded-full" 
                              style={{ width: `${stat.score}%` }}
                            />
                          </div>
                        </div>
                      )) : (
                        <div className="col-span-2 text-center py-4 text-slate-500 text-xs italic">
                          No detailed breakdown data available for this report.
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <button 
                      onClick={() => jumpToResult(selectedItem)}
                      className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black shadow-xl hover:opacity-90 transition-all flex items-center justify-center space-x-2 active:scale-[0.98]"
                    >
                      <span>Full Forensic Dashboard</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Loader2 = ({ className }) => <RefreshCw className={className + " animate-spin"} />;

export default HistoryPage;
