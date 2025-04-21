import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CodeEditor from '../components/CodeEditor';
import LanguageDropdown from '../components/LanguageDropdown';
import OutputCard from '../components/OutputCard';
import Spinner from '../components/Spinner';
import devHelperLogo from '/devhelper-logo.svg';
import { Code2, Terminal, Bug, Zap, History, Save, Settings, Github } from 'lucide-react';


const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const PROMPT = `You are an intelligent programming assistant named DevHelper AI. A user will give you a code snippet in either JavaScript, Python, or Java. Your task is to:
1. Explain the code
2. Identify bugs
3. Suggest improvements

Format it in markdown with:
### 🧠 Code Explanation
### 🐞 Bugs / Issues
### 🚀 Suggestions / Improvements`;


function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function App() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('editor'); // 'editor', 'history', 'settings'
  const [savedSnippets, setSavedSnippets] = useState([]);
  const [showTips, setShowTips] = useState(true);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    
    setOutput('');
    setError('');
    setLoading(true);
    
    try {
      const res = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `${PROMPT}\n\nLanguage: ${language}\n\nCode:\n${code}`
                }
              ]
            }
          ]
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.';
      setOutput(text);
      
      // Save to history
      const newSnippet = {
        id: Date.now(),
        language,
        code: code.substring(0, 50) + (code.length > 50 ? '...' : ''),
        fullCode: code,
        timestamp: new Date().toLocaleString()
      };
      setSavedSnippets(prev => [newSnippet, ...prev.slice(0, 9)]);
      
    } catch (err) {
      console.error('API Error:', err);
      setError(
        err.response?.data?.error?.message || 
        'Failed to fetch explanation. Please check your API key and network.'
      );
    } finally {
      setLoading(false);
    }
  };

  const loadSavedSnippet = (snippet) => {
    setCode(snippet.fullCode);
    setLanguage(snippet.language);
    setActiveTab('editor');
  };

  const saveCurrentSnippet = () => {
    if (!code.trim()) return;
    
    const newSnippet = {
      id: Date.now(),
      language,
      code: code.substring(0, 50) + (code.length > 50 ? '...' : ''),
      fullCode: code,
      timestamp: new Date().toLocaleString()
    };
    setSavedSnippets(prev => [newSnippet, ...prev]);
  };

  const renderTips = () => (
    <div className="bg-indigo-50 dark:bg-zinc-800/50 rounded-xl p-4 mb-4 border border-indigo-100 dark:border-zinc-700">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
          <Zap size={18} /> Pro Tips
        </h3>
        <button 
          onClick={() => setShowTips(false)}
          className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          ×
        </button>
      </div>
      <ul className="text-sm text-zinc-700 dark:text-zinc-300 space-y-1">
        <li>• Use precise code snippets for more accurate analysis</li>
        <li>• Include function definitions and variable declarations</li>
        <li>• For bigger projects, analyze one component at a time</li>
      </ul>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-zinc-50 dark:bg-zinc-900 font-inter flex flex-col">
      {/* Header Bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 shadow bg-white/95 dark:bg-zinc-900/95 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3 select-none">
          <img src={devHelperLogo} alt="DevHelper AI logo" className="w-8 h-8" />
          <span className="text-xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400 font-space-grotesk">DevHelper <span className="text-zinc-900 dark:text-white">AI</span></span>
        </div>
        
        <div className="flex items-center gap-4">
          <a href="https://github.com/yourrepo/devhelper-ai" target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-1 text-zinc-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition"><Github size={18} /> GitHub</a>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden sticky top-16 z-20 flex justify-center w-full px-4 py-2 bg-white/90 dark:bg-zinc-900/90 border-b border-zinc-200 dark:border-zinc-800 backdrop-blur-lg">
        <nav className="flex items-center gap-1 bg-zinc-100/70 dark:bg-zinc-800/70 rounded-lg p-1 w-full max-w-md">
          <button 
            onClick={() => setActiveTab('editor')}
            className={classNames(
              "flex items-center justify-center gap-1 flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition",
              activeTab === 'editor' 
                ? "bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-300 shadow-sm" 
                : "text-zinc-600 dark:text-zinc-300"
            )}
          >
            <Code2 size={14} /> Editor
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={classNames(
              "flex items-center justify-center gap-1 flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition",
              activeTab === 'history' 
                ? "bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-300 shadow-sm" 
                : "text-zinc-600 dark:text-zinc-300"
            )}
          >
            <History size={14} /> History
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={classNames(
              "flex items-center justify-center gap-1 flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition",
              activeTab === 'settings' 
                ? "bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-300 shadow-sm" 
                : "text-zinc-600 dark:text-zinc-300"
            )}
          >
            <Settings size={14} /> Settings
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <main className="z-10 relative flex-1 flex flex-col items-center justify-center px-4 py-6">
        {activeTab === 'editor' && (
          <>
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-4xl bg-white/98 dark:bg-zinc-900/95 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 backdrop-blur-xl transition flex flex-col gap-6 p-6 md:p-8"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal size={20} className="text-indigo-500 dark:text-indigo-400" />
                  <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Code Analyzer</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={saveCurrentSnippet}
                    disabled={!code.trim()}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <Save size={14} /> Save
                  </button>
                </div>
              </div>

              {showTips && renderTips()}
              
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <label className="font-medium text-zinc-700 dark:text-zinc-200 text-sm">Language</label>
                <LanguageDropdown value={language} onChange={setLanguage} />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="font-medium text-zinc-700 dark:text-zinc-200 text-sm">Paste your code</label>
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-30"></div>
                  <div className="relative">
                    <CodeEditor value={code} onChange={setCode} language={language.toLowerCase()} />
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                className={classNames(
                  "mt-2 w-full py-3 rounded-xl font-medium text-base shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-900",
                  !code.trim() 
                    ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 cursor-not-allowed" 
                    : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:from-indigo-600 hover:to-pink-600 hover:shadow-indigo-500/30 hover:scale-[1.01]"
                )}
                disabled={loading || !code.trim()}
              >
                <div className="flex items-center justify-center gap-2">
                  <Bug size={18} />
                  <span>Analyze Code with AI</span>
                </div>
              </button>
            </form>
            
            {loading && (
              <div className="w-full max-w-4xl mt-8 flex justify-center">
                <Spinner />
              </div>
            )}
            
            {error && (
              <div className="mt-6 text-red-500 font-medium bg-red-50 dark:bg-zinc-800 p-4 rounded-xl shadow max-w-4xl w-full border border-red-100 dark:border-red-900/30">
                <div className="flex items-start gap-3">
                  <div className="text-red-500 mt-0.5">⚠️</div>
                  <div>{error}</div>
                </div>
              </div>
            )}
            
            {output && <OutputCard markdown={output} className="w-full max-w-4xl mt-8" />}
          </>
        )}
        
        {activeTab === 'history' && (
          <div className="w-full max-w-4xl bg-white/98 dark:bg-zinc-900/95 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 backdrop-blur-xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <History size={20} className="text-indigo-500 dark:text-indigo-400" />
              <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Code History</h2>
            </div>
            
            {savedSnippets.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-zinc-500 dark:text-zinc-400">No saved code snippets yet.</p>
              </div>
            ) : (
              <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {savedSnippets.map(snippet => (
                  <li key={snippet.id} className="py-3 first:pt-0 last:pb-0">
                    <button
                      onClick={() => loadSavedSnippet(snippet)}
                      className="w-full text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50 p-2 rounded-lg transition"
                    >
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{snippet.language}</span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">{snippet.timestamp}</span>
                      </div>
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-1 font-mono">{snippet.code}</p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="w-full max-w-4xl bg-white/98 dark:bg-zinc-900/95 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 backdrop-blur-xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <Settings size={20} className="text-indigo-500 dark:text-indigo-400" />
              <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Settings</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Theme</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Choose between light and dark mode</p>
                </div>
              </div>
              
              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6">
                <h3 className="text-sm font-medium text-zinc-800 dark:text-zinc-200">API Configuration</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Currently using Gemini Flash 2.0</p>
                
                <div className="mt-4 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">API Connected</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6">
                <h3 className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Display Tips</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Show helpful tips in the editor</p>
                
                <label className="mt-4 relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={showTips} 
                    onChange={() => setShowTips(!showTips)} 
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-200 dark:bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                  <span className="ml-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {showTips ? "Enabled" : "Disabled"}
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="z-10 relative flex flex-col md:flex-row items-center justify-between px-6 py-4 text-zinc-500 dark:text-zinc-500 text-sm max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2 mb-2 md:mb-0">
          <img src={devHelperLogo} alt="DevHelper logo" className="w-5 h-5 opacity-70" />
          <span>DevHelper AI &copy; 2025</span>
        </div>
        
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition">Privacy</a>
          <a href="#" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition">Terms</a>
          <a href="#" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition">About</a>
        </div>
      </footer>
    </div>
  );
}