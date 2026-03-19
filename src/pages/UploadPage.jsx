import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, X, CheckCircle, BarChart, AlertCircle, Loader2, Play, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../App';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    if (file.size > 50 * 1024 * 1024) {
      showToast("File is too large. Max 50MB.");
      return;
    }

    setFile(file);
    showToast(`Loaded: ${file.name}`);
    
    // Preview for images
    if (file.type.startsWith('image')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const startAnalysis = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('media', file);

    try {
      const response = await axios.post('http://localhost:5000/api/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          // Only show up to 90% until backend responds
          setProgress(percentCompleted * 0.9);
        }
      });

      // Finish progress and navigate
      setProgress(100);
      setTimeout(() => {
        showToast("Analysis Complete!");
        // Store result in local storage or state for dashboard
        localStorage.setItem('currentAnalysis', JSON.stringify(response.data));
        navigate('/dashboard');
      }, 500);

    } catch (err) {
      console.error(err);
      showToast("Server analysis failed. Is the backend running?");
      setIsAnalyzing(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setProgress(0);
    showToast("File removed.");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-4">Deepfake Detection</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Upload an image, video, or audio file to start the verification process.
        </p>
      </div>

      <div className="glass p-8 rounded-3xl shadow-xl border border-white/10 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {!file && !isAnalyzing ? (
            <motion.div
              key="dropzone"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl py-20 flex flex-col items-center justify-center transition-all ${
                isDragging 
                  ? 'border-primary-500 bg-primary-500/5' 
                  : 'border-slate-300 dark:border-slate-700'
              }`}
            >
              <div className="p-6 bg-primary-500/10 rounded-full mb-6 pointer-events-none">
                <Upload className="w-12 h-12 text-primary-500" />
              </div>
              <p className="text-xl font-bold mb-2 text-slate-900 dark:text-white pointer-events-none">
                Drag and drop your file here
              </p>
              <p className="text-slate-500 dark:text-slate-400 pointer-events-none">
                Supports Images, Videos, and Audio (Max 50MB)
              </p>
              <div className="mt-8 px-6 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-medium pointer-events-none">
                Browse Files
              </div>
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                accept="image/*,video/*,audio/*"
              />
            </motion.div>
          ) : isAnalyzing ? (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 flex flex-col items-center justify-center text-center"
            >
              <div className="relative w-40 h-40 mb-8">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="80" cy="80" r="72"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    className="text-slate-200 dark:text-slate-800"
                  />
                  <motion.circle
                    cx="80" cy="80" r="72"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    strokeDasharray={452}
                    strokeDashoffset={452 - (452 * progress) / 100}
                    className="text-primary-500"
                    strokeLinecap="round"
                    transition={{ ease: "linear", duration: 0.1 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-black">{Math.round(progress)}%</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Analyzing Media...</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto flex items-center justify-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running forensic scans on backend server</span>
              </p>
              
              <div className="w-full max-w-sm space-y-3">
                {[
                  { label: "Uploading to cloud cluster", status: progress > 15 },
                  { label: "Extracting metadata", status: progress > 40 },
                  { label: "AI Neural Scan", status: progress > 70 },
                  { label: "Final Truth Verification", status: progress > 90 }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-white/5">
                    <span className="text-xs font-bold text-slate-500">{item.label}</span>
                    {item.status ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row gap-8 items-start"
            >
              <div className="flex-1 w-full aspect-square md:aspect-auto h-[320px] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center relative group border border-white/5">
                {file.type.startsWith('image') ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                ) : file.type.startsWith('video') ? (
                  <div className="flex flex-col items-center">
                    <Play className="w-16 h-16 text-slate-400 mb-2" />
                    <span className="text-slate-500 text-xs text-center px-4 truncate w-full">{file.name} (Video)</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <File className="w-16 h-16 text-slate-400 mb-2" />
                    <span className="text-slate-500 text-xs text-center px-4 truncate w-full">{file.name} (Audio)</span>
                  </div>
                )}
                <button
                  onClick={removeFile}
                  className="absolute top-4 right-4 p-2 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600 shadow-xl"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 space-y-6 w-full py-4">
                <div>
                  <h3 className="text-2xl font-black mb-2 truncate max-w-xs">{file.name}</h3>
                  <div className="flex items-center space-x-2 text-slate-500 text-[10px] uppercase font-black tracking-widest">
                    <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                    <span>•</span>
                    <span>{file.type.split('/')[1]?.toUpperCase()}</span>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                  <div className="flex items-center space-x-3 text-primary-500 text-sm font-bold">
                    <Shield className="w-5 h-5" />
                    <span>Secure Cloud Transmission</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    This file will be analyzed by our DeepTrust neural network on a secure Node.js instance.
                  </p>
                </div>

                <div className="pt-6">
                  <button
                    onClick={startAnalysis}
                    className="w-full py-4 bg-primary-500 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-xl shadow-primary-500/20 hover:bg-primary-600 transition-all active:scale-95 group"
                  >
                    <BarChart className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    <span>Execute Global Analysis</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UploadPage;
