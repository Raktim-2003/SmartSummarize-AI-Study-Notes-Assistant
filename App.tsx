
import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  History, 
  FileText, 
  Settings, 
  Trash2, 
  ChevronRight, 
  Menu, 
  X,
  MessageSquare,
  BookOpen,
  Zap,
  Layout,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import html2canvas from 'html2canvas';

import { StudyNote, SummaryStyle, HistoryItem } from './types';
import { generateSummary } from './geminiService';
import InputPanel from './components/InputPanel';
import StatsPanel from './components/StatsPanel';

const App: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentNote, setCurrentNote] = useState<StudyNote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('smart_summarize_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveToHistory = (note: StudyNote) => {
    const newHistoryItem: HistoryItem = {
      id: note.id,
      title: note.title,
      timestamp: note.timestamp,
    };
    const updatedHistory = [newHistoryItem, ...history.filter(h => h.id !== note.id)];
    setHistory(updatedHistory);
    localStorage.setItem('smart_summarize_history', JSON.stringify(updatedHistory));
    localStorage.setItem(`note_${note.id}`, JSON.stringify(note));
  };

  const loadFromHistory = (id: string) => {
    const savedNote = localStorage.getItem(`note_${id}`);
    if (savedNote) {
      const note = JSON.parse(savedNote);
      setCurrentNote(note);
      setInputText(note.originalText);
      if (window.innerWidth < 768) setIsSidebarOpen(false);
    }
  };

  const deleteFromHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedHistory = history.filter(h => h.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('smart_summarize_history', JSON.stringify(updatedHistory));
    localStorage.removeItem(`note_${id}`);
    if (currentNote?.id === id) setCurrentNote(null);
  };

  const handleSummarize = async (style: SummaryStyle) => {
    if (!inputText.trim()) {
      setError("Please provide some notes to summarize.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const result = await generateSummary(inputText, style);
      
      const wordCount = (text: string) => text.split(/\s+/).filter(Boolean).length;
      const originalWords = wordCount(inputText);
      const summaryWords = wordCount(result);
      
      const newNote: StudyNote = {
        id: Date.now().toString(),
        title: inputText.slice(0, 30) + (inputText.length > 30 ? '...' : ''),
        originalText: inputText,
        summary: result,
        style,
        timestamp: Date.now(),
        stats: {
          originalWords,
          summaryWords,
          reduction: Math.round(((originalWords - summaryWords) / originalWords) * 100),
          readingTime: Math.max(1, Math.round(summaryWords / 200))
        }
      };
      
      setCurrentNote(newNote);
      saveToHistory(newNote);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const startNewSession = () => {
    setCurrentNote(null);
    setInputText('');
    setError(null);
  };

  const copyToClipboard = () => {
    if (currentNote) {
      navigator.clipboard.writeText(currentNote.summary);
      alert("Summary copied to clipboard!");
    }
  };

  const downloadTxt = () => {
    if (currentNote) {
      const element = document.createElement("a");
      const file = new Blob([currentNote.summary], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `summary_${currentNote.id}.txt`;
      document.body.appendChild(element);
      element.click();
    }
  };

  const exportAsImage = async () => {
    if (outputRef.current) {
      const canvas = await html2canvas(outputRef.current, {
        backgroundColor: '#0f172a',
        scale: 2
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `summary_${currentNote?.id}.png`;
      link.click();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-slate-950/80 backdrop-blur-xl border-r border-slate-800/50 flex flex-col md:relative"
          >
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <BookOpen className="text-white" size={20} />
                </div>
                <h1 className="font-bold text-lg text-white">SmartSummarize</h1>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400">
                <X size={20} />
              </button>
            </div>

            <div className="px-4 mb-4">
              <button 
                onClick={startNewSession}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800 transition-all flex items-center gap-3 text-slate-200 group"
              >
                <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                <span className="font-medium">New Session</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">
                <History size={14} />
                History
              </div>
              {history.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageSquare size={18} className="text-slate-600" />
                  </div>
                  <p className="text-slate-500 text-sm">No recent summaries</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {history.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => loadFromHistory(item.id)}
                      className={`group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                        currentNote?.id === item.id 
                        ? 'bg-indigo-600/10 border border-indigo-500/30 text-indigo-400' 
                        : 'hover:bg-slate-900 text-slate-400 border border-transparent'
                      }`}
                    >
                      <FileText size={16} />
                      <span className="text-sm truncate flex-1">{item.title}</span>
                      <button 
                        onClick={(e) => deleteFromHistory(item.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-800/50 mt-auto">
              <div className="flex items-center gap-3 p-2 text-slate-400 hover:text-white transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-slate-800 overflow-hidden">
                  <img src="https://picsum.photos/100/100" alt="Avatar" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Guest User</p>
                </div>
                <Settings size={18} />
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-slate-950 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none -mr-40 -mt-40"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none -ml-40 -mb-40"></div>

        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-800/50 flex items-center justify-between px-6 z-10 backdrop-blur-md bg-slate-950/50">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(true)} className="text-slate-400 hover:text-white">
                <Menu size={20} />
              </button>
            )}
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Assistant</span>
              <ChevronRight size={14} className="text-slate-700" />
              <span className="text-indigo-400 font-semibold">{currentNote ? 'Summary Result' : 'Create New Note'}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400">
              <Zap size={12} className="text-yellow-500" />
              Gemini 3 Flash
            </div>
          </div>
        </header>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar z-10">
          <div className="max-w-4xl mx-auto space-y-10">
            
            {/* Input Section */}
            <div className="space-y-6">
              {!currentNote && (
                <div className="text-center mb-10">
                  <motion.h2 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400 mb-4"
                  >
                    What are we learning today?
                  </motion.h2>
                  <p className="text-slate-400 max-w-lg mx-auto">Paste your long lecture notes, upload a PDF, or use your voice to generate smart summaries in seconds.</p>
                </div>
              )}

              <InputPanel 
                inputText={inputText} 
                setInputText={setInputText} 
                onSummarize={handleSummarize}
                isLoading={isLoading}
              />
              
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3"
                >
                  <X size={16} className="shrink-0" />
                  {error}
                </motion.div>
              )}
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-20 gap-6">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <GraduationCap className="text-indigo-500" size={24} />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">Generating your summary...</h3>
                  <p className="text-slate-500 text-sm animate-pulse">Our AI is distilling the knowledge for you.</p>
                </div>
              </div>
            )}

            {/* Result Section */}
            {currentNote && !isLoading && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <Layout className="text-indigo-500" size={24} />
                    Smart Summary
                  </h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={copyToClipboard}
                      className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                      title="Copy to clipboard"
                    >
                      <Layout size={18} />
                    </button>
                    <button 
                      onClick={downloadTxt}
                      className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                      title="Download as TXT"
                    >
                      <FileText size={18} />
                    </button>
                    <button 
                      onClick={exportAsImage}
                      className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
                    >
                      Export as PNG
                    </button>
                  </div>
                </div>

                <StatsPanel stats={currentNote.stats} />

                <div 
                  ref={outputRef}
                  className="p-8 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 min-h-[400px] relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                    <GraduationCap size={40} className="text-indigo-500" />
                  </div>
                  <div className="prose prose-invert max-w-none prose-p:text-slate-300 prose-headings:text-white prose-li:text-slate-300">
                    <TypeAnimation
                      sequence={[currentNote.summary]}
                      speed={70}
                      cursor={false}
                      className="text-slate-300 leading-relaxed whitespace-pre-wrap"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
