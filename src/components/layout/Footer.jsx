import React from 'react';
import { Shield, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="w-6 h-6 text-primary-500" />
              <span className="text-xl font-bold italic">DeepTrust</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Securing the world from digital deception. Advanced AI-powered tools to verify media authenticity instantly.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-slate-900 dark:text-white">Product</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="/upload" className="hover:text-primary-500">Detector</a></li>
              <li><a href="/dashboard" className="hover:text-primary-500">API Access</a></li>
              <li><a href="#" className="hover:text-primary-500">Enterprise</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-slate-900 dark:text-white">Resources</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-primary-500">Deepfake Guide</a></li>
              <li><a href="#" className="hover:text-primary-500">Truth & Verification</a></li>
              <li><a href="#" className="hover:text-primary-500">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-slate-900 dark:text-white">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 hover:text-primary-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 hover:text-primary-500 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 hover:text-primary-500 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026 DeepTrust AI. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary-500">Privacy Policy</a>
            <a href="#" className="hover:text-primary-500">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
