
import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Mic, 
  MicOff, 
  X, 
  Sparkles, 
  List, 
  Maximize2, 
  BookOpen, 
  Check 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { SummaryStyle } from '../types';

interface InputPanelProps {
  inputText: string;
  setInputText: (text: string) => void;
  onSummarize: (style: SummaryStyle) => void;
  isLoading: boolean;
}

const InputPanel: React.FC<InputPanelProps> = ({ inputText, setInputText, onSummarize, isLoading }) => {
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    if (!isListening) {
      recognition.start();
      setIsListening(true);
      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            setInputText(inputText + ' ' + event.results[i][0].transcript);
          }
        }
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    } else {
      setIsListening(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setInputText(text);
      };
      reader.readAsText(file);
    }
  };

  const styles: { id: SummaryStyle; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'concise', label: 'Concise', icon: <Sparkles size={16} />, desc: 'Short & precise' },
    { id: 'detailed', label: 'Detailed', icon: <Maximize2 size={16} />, desc: 'Deep dive' },
    { id: 'bullets', label: 'Bullet Points', icon: <List size={16} />, desc: 'Quick scan' },
    { id: 'teacher', label: 'Explain like Teacher', icon: <BookOpen size={16} />, desc: 'Simple & clear' },
  ];

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-sm border border-slate-700 text-slate-300 text-xs hover:border-indigo-500/50 hover:bg-slate-800 transition-all"
          >
            <Upload size={14} />
            Upload PDF/TXT
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept=".txt,.md,.pdf" 
          />
          <button 
            onClick={toggleVoice}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg backdrop-blur-sm border transition-all text-xs ${
              isListening 
              ? 'bg-red-500/20 border-red-500/50 text-red-400' 
              : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:border-indigo-500/50 hover:bg-slate-800'
            }`}
          >
            {isListening ? <MicOff size={14} /> : <Mic size={14} />}
            {isListening ? 'Stop Recording' : 'Voice Input'}
          </button>
        </div>

        <div className="group relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your study notes here..."
            className="w-full h-80 pt-16 pb-12 px-6 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/30 transition-all resize-none custom-scrollbar"
          />
          <div className="absolute bottom-4 right-4 flex items-center gap-4 text-xs font-medium text-slate-500">
            <span>{wordCount} words</span>
            <span>{charCount} characters</span>
            {inputText && (
              <button 
                onClick={() => setInputText('')}
                className="p-1 hover:text-red-400 transition-colors"
                title="Clear all"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {styles.map((style) => (
          <button
            key={style.id}
            disabled={isLoading || !inputText}
            onClick={() => onSummarize(style.id)}
            className="group flex flex-col items-start p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-left relative overflow-hidden"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-3 group-hover:scale-110 transition-transform">
              {style.icon}
            </div>
            <p className="text-white font-semibold text-sm mb-1">{style.label}</p>
            <p className="text-slate-500 text-xs">{style.desc}</p>
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Check size={16} className="text-indigo-500" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default InputPanel;
