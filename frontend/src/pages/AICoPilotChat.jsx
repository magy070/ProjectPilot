import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Trash2, CheckCircle, Terminal } from 'lucide-react';
import { api } from '../context/AuthContext.jsx';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import Badge from '../components/Badge.jsx';
import Input from '../components/Input.jsx';

export default function AICoPilotChat() {
  // Conversational state
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hello! I am your ProjectPilot Co-Pilot. Tell me about what you'd like to build, or let's brainstorm together. You can describe your team size, skills, domain interests, and timeframe in your message, and I will design a custom project proposal for you!"
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMissionPassed, setShowMissionPassed] = useState(false);

  // Scroll anchor
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const userMessage = userInput.trim();
    setUserInput('');

    // Append user message
    const updatedMessages = [...messages, { role: 'user', text: userMessage }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Package conversation and send to backend
      const res = await api.post('/api/ai/chat', {
        message: userMessage,
        history: updatedMessages.slice(0, -1)
      });

      if (res.data.success) {
        setMessages(prev => [...prev, { role: 'assistant', text: res.data.reply }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: "Error: Failed to connect to my AI core. Please check your network connection or try again." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to check and render custom structured project cards inside chat answers
  const renderMessageContent = (text, messageIndex) => {
    const projectRegex = /\[PROJECT_JSON\]([\s\S]*?)\[\/PROJECT_JSON\]/;
    const match = text.match(projectRegex);

    if (!match) {
      return <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted">{text}</p>;
    }

    const cleanText = text.replace(projectRegex, '').trim();
    let projectData = null;

    try {
      projectData = JSON.parse(match[1].trim());
    } catch (err) {
      console.error('Failed to parse project JSON in chat:', err);
    }

    return (
      <div className="space-y-4 font-sans">
        {cleanText && <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted">{cleanText}</p>}
        {projectData && (
          <Card className="border border-secondary/20 bg-secondary/5 p-5 rounded-[18px] space-y-4 mt-3 relative overflow-hidden">
            <div className="flex justify-between items-start gap-4">
              <div>
                <Badge type="tech" className="mb-2">{projectData.domain || 'Web Dev'}</Badge>
                <h4 className="text-base font-heading font-black tracking-wide text-text uppercase mt-1">{projectData.name}</h4>
                <p className="text-xs text-muted mt-1 leading-relaxed">{projectData.description}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-muted block font-bold uppercase tracking-wider">Feasibility</span>
                <span className="text-lg font-heading font-black text-success">{projectData.feasibilityScore || '90'}%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-black/10 dark:bg-black/35 p-3 rounded-xl border border-border">
              <div>
                <span className="text-muted block text-[9px] font-bold uppercase tracking-widest">Estimated Time</span>
                <span className="text-text font-semibold">{projectData.estimatedTime || '1 Month'}</span>
              </div>
              <div>
                <span className="text-muted block text-[9px] font-bold uppercase tracking-widest">Team Size</span>
                <span className="text-text font-semibold">{projectData.teamSize || 2} Devs</span>
              </div>
            </div>

            {projectData.techStack && projectData.techStack.length > 0 && (
              <div className="space-y-1">
                <span className="text-muted text-[9px] block font-bold uppercase tracking-widest">Required Skills</span>
                <div className="flex flex-wrap gap-1">
                  {projectData.techStack.map((tech, idx) => (
                    <span key={idx} className="bg-primary/10 text-accent-green px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-accent-green/10">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <ImportProjectButton 
              project={projectData} 
              messageIndex={messageIndex} 
              onSuccess={() => {
                setShowMissionPassed(true);
                setTimeout(() => setShowMissionPassed(false), 3500);
              }}
            />
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="bg-background min-h-screen text-text pt-28 pb-12 relative overflow-hidden font-sans transition-colors duration-300">
      
      {/* Decorative Vibe Elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-15%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[-15%] w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-6">
        
        {/* Title Header */}
        <header className="space-y-1 text-center max-w-2xl mx-auto">
          <h1 className="font-heading text-title md:text-5xl font-black text-text inline-flex items-center gap-2.5 justify-center uppercase tracking-wide">
            <Sparkles className="text-secondary" size={24} /> AI CO-PILOT Operations
          </h1>
          <p className="text-xs text-muted font-bold tracking-wider uppercase">
            Los Santos AI Brainstorm Console
          </p>
        </header>

        {/* Chat Messenger Panel */}
        <Card className="border border-border bg-card flex flex-col h-[600px] overflow-hidden rounded-[18px] shadow-hud">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-border bg-black/5 dark:bg-black/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white">
                <Sparkles size={16} />
              </div>
              <div>
                <span className="text-sm font-bold text-text block">ProjectPilot Advisor</span>
                <span className="text-[10px] text-success flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span> Online
                </span>
              </div>
            </div>
            <Button
              variant="secondary"
              className="px-3 py-1.5 text-xs flex items-center gap-1.5"
              onClick={() => {
                setMessages([{
                  role: 'assistant',
                  text: "Hello! I am your ProjectPilot Co-Pilot. Tell me about what you'd like to build, or let's brainstorm together. You can describe your team size, skills, domain interests, and timeframe in your message, and I will design a custom project proposal for you!"
                }]);
                for (let key in localStorage) {
                  if (key.startsWith('imported_project_msg_')) {
                    localStorage.removeItem(key);
                  }
                }
              }}
            >
              <Trash2 size={12} /> Clear Chat
            </Button>
          </div>

          {/* Chat Message Scroll Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-2xl p-4 rounded-[18px] leading-relaxed text-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-primary to-accent-green text-white rounded-tr-none shadow-lg shadow-primary/20 border border-primary/20'
                      : 'glass-card border border-border text-text rounded-tl-none bg-card'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
                  ) : (
                    renderMessageContent(msg.text, idx)
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="glass-card border border-border p-4 rounded-[18px] rounded-tl-none bg-card flex items-center gap-2 text-muted text-xs">
                  <div className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                  Co-Pilot is brainstorming...
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input Footer */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-black/5 dark:bg-black/20 flex gap-3">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Tell me what you want to build (e.g. 'Los Santos taxi dispatcher web app')..."
              className="py-3 mt-0"
              disabled={isLoading}
            />
            <Button
              type="submit"
              variant="glow"
              className="px-6 shrink-0 flex items-center justify-center"
              disabled={!userInput.trim() || isLoading}
            >
              <Send size={16} />
            </Button>
          </form>

        </Card>
      </div>

      {/* Global GTA "MISSION PASSED" Success Animation */}
      <AnimatePresence>
        {showMissionPassed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50 pointer-events-none"
          >
            <motion.div
              initial={{ scale: 3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 11 }}
              className="text-center"
            >
              <h2 className="font-heading text-6xl md:text-8xl font-black text-secondary tracking-widest uppercase drop-shadow-[0_0_20px_rgba(196,154,74,0.6)] animate-pulse">
                MISSION PASSED
              </h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="text-accent-orange text-lg md:text-2xl font-heading font-black uppercase tracking-widest mt-2"
              >
                PROJECT SAVED TO THE VAULT
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Inner component to handle asynchronous project importing & bookmarking cleanly
function ImportProjectButton({ project, messageIndex, onSuccess }) {
  const queryClient = useQueryClient();
  const [importing, setImporting] = useState(false);

  // Fetch saved projects to check if this suggestion has already been imported
  const { data: savedProjects } = useQuery({
    queryKey: ['savedProjects'],
    queryFn: async () => {
      const res = await api.get('/api/saved-projects');
      return res.data.projects;
    }
  });

  const isAlreadyImported = savedProjects?.some(
    p => p.name.toLowerCase().trim() === project.name.toLowerCase().trim()
  ) || false;

  const handleImport = async () => {
    setImporting(true);
    try {
      const importRes = await api.post('/api/projects/import', project);
      if (importRes.data.success) {
        const createdProjectId = importRes.data.project._id;
        await api.post(`/api/saved-projects/${createdProjectId}`);
        
        // Invalidate stale caches to synchronize with other views
        queryClient.invalidateQueries({ queryKey: ['savedProjects'] });
        queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
        queryClient.invalidateQueries({ queryKey: ['recommendations'] });

        if (onSuccess) onSuccess();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to import project. Please try again.");
    } finally {
      setImporting(false);
    }
  };

  if (isAlreadyImported) {
    return (
      <div className="w-full text-center text-xs py-2 bg-success/10 text-success rounded-xl border border-success/20 flex items-center justify-center gap-1.5 font-sans font-bold select-none uppercase tracking-wider">
        <CheckCircle size={14} /> Imported and Saved to Bookmarks
      </div>
    );
  }

  return (
    <Button
      variant="glow"
      className="w-full py-2.5 text-xs text-center font-heading font-black tracking-wide"
      onClick={handleImport}
      disabled={importing}
    >
      {importing ? 'Importing Project...' : '📥 Import Project to Dashboard'}
    </Button>
  );
}
