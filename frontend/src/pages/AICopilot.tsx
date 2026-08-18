import React, { useState, useRef, useEffect } from 'react';
import { queryCopilot } from '../api/client';
import type { CopilotQueryResponse, CopilotActionCard } from '../types';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ArrowRight, 
  MessageSquare, 
  Zap,
  Cpu
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  timestamp: string;
  actionCards?: CopilotActionCard[];
  keyMetrics?: Record<string, any>;
  isStreaming?: boolean;
}

interface AICopilotProps {
  onNavigateTab: (tab: string) => void;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const PROMPT_CHIPS = [
  'Which shipments are currently at risk?',
  'Why is Chennai warehouse delayed?',
  'Simulate backup vehicle recovery impact',
  'What is our inventory truth confidence for SKU-IND-001?',
  'Give an executive summary of active incidents and SLA exposure'
];

export const AICopilot: React.FC<AICopilotProps> = ({ onNavigateTab, messages, setMessages }) => {
  const [inputQuery, setInputQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [inferenceStep, setInferenceStep] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, inferenceStep]);

  // Stream tokens word by word to emulate real generative LLM token generation
  const streamBotResponse = (fullText: string, actionCards?: CopilotActionCard[], keyMetrics?: Record<string, any>) => {
    const msgId = `copilot-${Date.now()}`;
    const words = fullText.split(' ');
    let currentText = '';
    let index = 0;

    const initialMsg: ChatMessage = {
      id: msgId,
      sender: 'copilot',
      text: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true
    };

    setMessages(prev => [...prev, initialMsg]);

    const interval = setInterval(() => {
      if (index < words.length) {
        currentText += (index === 0 ? '' : ' ') + words[index];
        index++;
        setMessages(prev =>
          prev.map(m => (m.id === msgId ? { ...m, text: currentText } : m))
        );
      } else {
        clearInterval(interval);
        setMessages(prev =>
          prev.map(m => (m.id === msgId ? { ...m, isStreaming: false, actionCards, keyMetrics } : m))
        );
        setLoading(false);
        setInferenceStep('');
      }
    }, 18);
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setLoading(true);
    setInferenceStep('Vectorizing query embeddings via TF-IDF...');

    try {
      await new Promise(r => setTimeout(r, 450));
      setInferenceStep('Calculating cosine similarity against supply chain graph...');
      
      const res: CopilotQueryResponse = await queryCopilot(textToSend);
      await new Promise(r => setTimeout(r, 400));
      setInferenceStep('Synthesizing operational telemetry dossier...');
      await new Promise(r => setTimeout(r, 300));

      streamBotResponse(res.answer, res.action_cards, res.key_metrics);
    } catch (err) {
      console.error('Failed to query copilot:', err);
      const errorMsg: ChatMessage = {
        id: `copilot-${Date.now()}`,
        sender: 'copilot',
        text: "⚠️ **System Communication Exception:** Unable to reach the CHAINSIGHT live telemetry engine. Please ensure the backend server is running.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
      setLoading(false);
      setInferenceStep('');
    }
  };

  const renderFormattedMarkdown = (text: string) => {
    const lines = text.split('\n');

    return (
      <div className="space-y-2 text-xs sm:text-sm font-sans leading-relaxed">
        {lines.map((line, idx) => {
          if (line.startsWith('### ')) {
            return <h4 key={idx} className="text-sm sm:text-base font-bold text-white font-mono mt-2 mb-1 flex items-center gap-2">{line.replace('### ', '')}</h4>;
          }
          if (line.startsWith('## ')) {
            return <h3 key={idx} className="text-base font-extrabold text-cyan-300 font-mono mt-3 mb-1">{line.replace('## ', '')}</h3>;
          }
          if (line.startsWith('> ')) {
            return (
              <div key={idx} className="p-3 my-2 rounded-xl bg-slate-900 border-l-4 border-cyan-500 text-cyan-200 text-xs font-mono">
                {line.replace('> ', '')}
              </div>
            );
          }
          if (line.startsWith('- ')) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span className="text-slate-200" dangerouslySetInnerHTML={{ __html: line.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>').replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-[11px]">$1</code>') }} />
              </div>
            );
          }
          if (line.startsWith('|')) {
            return (
              <div key={idx} className="font-mono text-[11px] text-slate-300 overflow-x-auto py-0.5">
                {line}
              </div>
            );
          }
          if (!line.trim()) {
            return <div key={idx} className="h-1" />;
          }

          return (
            <p 
              key={idx} 
              className="text-slate-300"
              dangerouslySetInnerHTML={{ 
                __html: line
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em class="text-slate-400">$1</em>')
                  .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-[11px]">$1</code>')
              }} 
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12 flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">AI Supply Chain Copilot</h2>
            <span className="px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-mono font-bold">
              Phase 8 Active • Live Database Context
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Context-aware autonomous assistant querying live telemetry, predictive risk models, and what-if simulators.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            ML Neural Vector Engine Online
          </span>
        </div>
      </div>

      {/* Main Chat Conversation Container */}
      <div className="tech-card rounded-2xl p-4 sm:p-6 flex-1 flex flex-col justify-between overflow-hidden bg-[#070b14]/90 border-slate-800/80">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div key={msg.id} className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 border border-cyan-400/40 flex items-center justify-center text-white shrink-0 mt-1 shadow-md shadow-cyan-950/50">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[75%] space-y-3 ${isUser ? 'items-end' : 'items-start'}`}>
                  <div className={`p-4 rounded-2xl ${
                    isUser 
                      ? 'bg-blue-600 text-white rounded-br-none shadow-lg shadow-blue-950/40 text-xs sm:text-sm' 
                      : 'bg-slate-900/90 border border-slate-800 rounded-bl-none text-slate-200 shadow-md'
                  }`}>
                    {isUser ? (
                      <p className="font-sans font-medium">{msg.text}</p>
                    ) : (
                      <>
                        {renderFormattedMarkdown(msg.text)}
                        {msg.isStreaming && (
                          <span className="inline-block w-2 h-3.5 bg-cyan-400 animate-pulse ml-1 align-middle"></span>
                        )}
                      </>
                    )}
                  </div>

                  {/* Action Cards */}
                  {!msg.isStreaming && msg.actionCards && msg.actionCards.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {msg.actionCards.map((card, idx) => (
                        <div
                          key={idx}
                          onClick={() => card.action_type === 'navigate_tab' && onNavigateTab(card.target)}
                          className="p-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/60 cursor-pointer transition flex items-center justify-between group shadow-sm"
                        >
                          <div className="space-y-0.5 truncate pr-2">
                            <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition flex items-center gap-1.5 truncate">
                              <Zap className="w-3 h-3 text-cyan-400 shrink-0" />
                              <span>{card.title}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 line-clamp-1">{card.description}</div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition shrink-0" />
                        </div>
                      ))}
                    </div>
                  )}

                  <span className="text-[10px] font-mono text-slate-500 block px-1">
                    {isUser ? 'Operator' : 'CHAINSIGHT ML Copilot'} • {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Model Inference Step Indicator */}
          {loading && (
            <div className="flex gap-3.5 items-start">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 border border-cyan-400/40 flex items-center justify-center text-white shrink-0 mt-1 animate-pulse">
                <Cpu className="w-4 h-4 text-white" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 rounded-bl-none text-xs text-cyan-300 font-mono flex items-center gap-2.5 shadow-md">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>
                <span>{inferenceStep}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Suggested Prompt Chips & Input Form */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3 shrink-0">
          {/* Quick Prompt Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px] font-mono scrollbar-none">
            <span className="text-slate-500 shrink-0 flex items-center gap-1 font-bold">
              <Sparkles className="w-3 h-3 text-cyan-400" /> QUICK PROMPTS:
            </span>
            {PROMPT_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                disabled={loading}
                className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition cursor-pointer shrink-0 disabled:opacity-50"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Query Input Box */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask CHAINSIGHT Copilot about shipments, bottlenecks, inventory, or what-if recovery..."
                disabled={loading}
                className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition font-sans"
              />
              <MessageSquare className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
            </div>

            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold font-mono transition cursor-pointer flex items-center gap-2 shadow-lg shadow-blue-950/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
