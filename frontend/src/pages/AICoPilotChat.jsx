import React, { useState, useRef, useEffect } from 'react';
import { api } from '../context/AuthContext.jsx';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import Badge from '../components/Badge.jsx';
import Input from '../components/Input.jsx';
import { Sparkles, Send, Trash2, CheckCircle } from 'lucide-react';

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
        history: updatedMessages.slice(0, -1) // Exclude the message we just added
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
      <div className="space-y-4">
        {cleanText && <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted">{cleanText}</p>}
        {projectData && (
          <Card className="border border-primary/20 bg-primary/5 p-5 rounded-2xl space-y-4 mt-3">
            <div className="flex justify-between items-start gap-4">
              <div>
                <Badge variant="glow" className="mb-2">{projectData.domain || 'Web Dev'}</Badge>
                <h4 className="text-base font-bold text-white">{projectData.name}</h4>
                <p className="text-xs text-muted mt-1 leading-relaxed">{projectData.description}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-muted block font-mono">FEASIBILITY</span>
                <span className="text-sm font-extrabold text-emerald-400">{projectData.feasibilityScore || '90'}%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-black/30 p-3 rounded-xl">
              <div>
                <span className="text-muted block text-[10px] font-mono">ESTIMATED TIME</span>
                <span className="text-white font-medium">{projectData.estimatedTime || '1 Month'}</span>
              </div>
              <div>
                <span className="text-muted block text-[10px] font-mono">TEAM SIZE</span>
                <span className="text-white font-medium">{projectData.teamSize || 2} Devs</span>
              </div>
            </div>

            {projectData.techStack && projectData.techStack.length > 0 && (
              <div className="space-y-1">
                <span className="text-muted text-[10px] block font-mono">TECH STACK</span>
                <div className="flex flex-wrap gap-1">
                  {projectData.techStack.map((tech, idx) => (
                    <Badge key={idx} variant="secondary" className="text-[10px] py-0.5 px-2 bg-white/5 text-muted border-none">{tech}</Badge>
                  ))}
                </div>
              </div>
            )}

            <ImportProjectButton project={projectData} messageIndex={messageIndex} />
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="bg-background min-h-screen text-text py-12 relative overflow-hidden font-sans">
      {/* Glow effects */}
      <div className="absolute top-[10%] left-[-15%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-15%] w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-6">
        
        {/* Title Header */}
        <header className="space-y-1 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-muted bg-clip-text text-transparent inline-flex items-center gap-2 justify-center">
            <Sparkles className="text-primary" size={24} /> AI Co-Pilot Project Coach
          </h1>
          <p className="text-sm text-muted">
            Brainstorm, design, and structure portfolio-grade custom software projects conversationally.
          </p>
        </header>

        {/* Chat Messenger Panel */}
        <Card className="border border-white/5 bg-white/1 flex flex-col h-[600px] overflow-hidden rounded-2xl shadow-2xl">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-white/5 bg-white/2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white">
                <Sparkles size={16} />
              </div>
              <div>
                <span className="text-sm font-bold text-white block">ProjectPilot Advisor</span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online
                </span>
              </div>
            </div>
            <Button
              variant="secondary"
              className="p-2 text-xs flex items-center gap-1.5 text-muted hover:text-white"
              onClick={() => {
                setMessages([{
                  role: 'assistant',
                  text: "Hello! I am your ProjectPilot Co-Pilot. Tell me about what you'd like to build, or let's brainstorm together. You can describe your team size, skills, domain interests, and timeframe in your message, and I will design a custom project proposal for you!"
                }]);
                // Clean up local storage states
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
                  className={`max-w-2xl p-4 rounded-2xl leading-relaxed text-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-tr-none shadow-lg'
                      : 'glass-card border border-white/5 text-text rounded-tl-none'
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
                <div className="glass-card border border-white/5 p-4 rounded-2xl rounded-tl-none flex items-center gap-2 text-muted text-xs">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                  Co-Pilot is brainstorming...
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input Footer */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-white/2 flex gap-3">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Tell me what you want to build, how much time you have, and your skill set..."
              className="py-3"
              disabled={isLoading}
            />
            <Button
              type="submit"
              variant="glow"
              className="px-6 shrink-0 rounded-xl flex items-center justify-center"
              disabled={!userInput.trim() || isLoading}
            >
              <Send size={16} />
            </Button>
          </form>

        </Card>

      </div>
    </div>
  );
}

// Inner component to handle asynchronous project importing & bookmarking cleanly
function ImportProjectButton({ project, messageIndex }) {
  const [imported, setImported] = useState(false);
  const [importing, setImporting] = useState(false);

  // Sync state to message key to persist imports across clicks
  useEffect(() => {
    const isImported = localStorage.getItem(`imported_project_msg_${messageIndex}`);
    if (isImported) setImported(true);
  }, [messageIndex]);

  const handleImport = async () => {
    setImporting(true);
    try {
      const importRes = await api.post('/api/projects/import', project);
      if (importRes.data.success) {
        const createdProjectId = importRes.data.project._id;
        await api.post(`/api/saved-projects/${createdProjectId}`);
        setImported(true);
        localStorage.setItem(`imported_project_msg_${messageIndex}`, 'true');
        alert("Project successfully imported and saved to your Bookmarks dashboard!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to import project. Please try again.");
    } finally {
      setImporting(false);
    }
  };

  if (imported) {
    return (
      <div className="w-full text-center text-xs py-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 flex items-center justify-center gap-1.5 font-medium select-none">
        <CheckCircle size={14} /> Imported and Saved to Bookmarks
      </div>
    );
  }

  return (
    <Button
      variant="glow"
      className="w-full py-2.5 text-xs text-center font-bold"
      onClick={handleImport}
      disabled={importing}
    >
      {importing ? 'Importing Project...' : '📥 Import Project to Dashboard'}
    </Button>
  );
}
