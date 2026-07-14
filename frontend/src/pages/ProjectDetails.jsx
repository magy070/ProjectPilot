import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../context/AuthContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar, Users, Code, Copy, Check, FileText, ArrowLeft, GitCommit, CheckCircle2, Star, HelpCircle } from 'lucide-react';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import Badge from '../components/Badge.jsx';

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview'); // overview, synopsis, prompt, roadmap
  const [copied, setCopied] = useState(false);

  // Fetch Project details
  const { data: project, isLoading: projectLoading, error } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const res = await api.get(`/api/projects/${id}`);
      return res.data.project;
    }
  });

  // Fetch Synopsis
  const { data: synopsisData, refetch: fetchSynopsis, isLoading: synopsisLoading } = useQuery({
    queryKey: ['synopsis', id],
    queryFn: async () => {
      const res = await api.post(`/api/ai/synopsis/${id}`);
      return res.data.synopsis;
    },
    enabled: false
  });

  // Fetch Prompt
  const { data: promptData, refetch: fetchPrompt, isLoading: promptLoading } = useQuery({
    queryKey: ['prompt', id],
    queryFn: async () => {
      const res = await api.post(`/api/ai/prompt/${id}`);
      return res.data.prompt;
    },
    enabled: false
  });

  const handleCopyPrompt = () => {
    if (promptData?.content) {
      navigator.clipboard.writeText(promptData.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTriggerSynopsis = () => {
    fetchSynopsis();
  };

  const handleTriggerPrompt = () => {
    fetchPrompt();
  };

  if (projectLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center animate-pulse space-y-6">
        <div className="h-10 w-1/3 bg-black/10 dark:bg-white/5 rounded-xl mx-auto"></div>
        <div className="h-32 bg-black/10 dark:bg-white/5 rounded-xl"></div>
        <div className="h-6 w-1/2 bg-black/10 dark:bg-white/5 rounded-xl mx-auto"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-6 font-sans">
        <HelpCircle size={48} className="mx-auto text-danger opacity-85" />
        <h2 className="font-heading text-title font-black text-danger uppercase tracking-wide">Project Not Found</h2>
        <Button variant="secondary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  // Dynamic Timeline Roadmap Generator
  const getDynamicRoadmap = () => {
    let totalDays = 30;
    const timeStr = project.estimatedTime.toLowerCase().trim();
    const matchNum = timeStr.match(/\d+/);
    if (matchNum) {
      const num = parseInt(matchNum[0]);
      if (timeStr.includes('week')) {
        totalDays = num * 7;
      } else if (timeStr.includes('month')) {
        totalDays = num * 30;
      } else if (timeStr.includes('day')) {
        totalDays = num;
      }
    }

    const useHours = totalDays <= 3;
    const totalUnits = useHours ? totalDays * 8 : totalDays;
    const unitLabel = useHours ? 'Hour' : 'Day';

    const segmentSize = Math.max(1, Math.floor(totalUnits / 4));
    
    return [
      {
        phase: "PHASE 01: REQS & SCHEMA DESIGN",
        timeline: `${unitLabel} 1 - ${segmentSize}`,
        description: "Specify entity relations and configure local SQLite/MongoDB container setups.",
        tasks: [
          "Validate structural database design",
          "Initialize Git branches and Docker instances",
          "Map initial user journeys and API specs"
        ]
      },
      {
        phase: "PHASE 02: CONTROLLER & API DEPLOY",
        timeline: `${unitLabel} ${segmentSize + 1} - ${segmentSize * 2}`,
        description: "Implement security guards and core controller endpoints.",
        tasks: [
          "Code authentication routes and JWT handlers",
          "Perform integration testing on local database controllers",
          "Set up automated unit testing suites"
        ]
      },
      {
        phase: "PHASE 03: INTERFACE ASSEMBLY",
        timeline: `${unitLabel} ${(segmentSize * 2) + 1} - ${segmentSize * 3}`,
        description: "Assemble UI pages and hook up context providers.",
        tasks: [
          "Build landing pages and form components",
          "Connect state providers to API hooks",
          "Implement responsive layout styling adjustments"
        ]
      },
      {
        phase: "PHASE 04: QA AUDITING & STAGING",
        timeline: `${unitLabel} ${(segmentSize * 3) + 1} - ${totalUnits}`,
        description: "Perform end-to-end routing audits and push to deployment.",
        tasks: [
          "Verify visual layouts on mobile viewports",
          "Run performance optimization checks",
          "Deploy build to Vercel/Render hosting"
        ]
      }
    ];
  };

  const roadmapPhases = getDynamicRoadmap();

  return (
    <div className="bg-background min-h-screen text-text pt-28 pb-12 relative overflow-hidden font-sans transition-colors duration-300">
      
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-15%] w-[450px] h-[450px] rounded-full bg-primary/5 blur-[120px] pointer-events-none animate-light-pulse"></div>
        <div className="absolute bottom-[20%] right-[-15%] w-[450px] h-[450px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none animate-light-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-8">
        
        {/* Navigation back */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-xs font-bold text-muted hover:text-text uppercase tracking-widest cursor-pointer select-none bg-transparent border-none"
        >
          <ArrowLeft size={14} /> Back to Grid
        </button>

        {/* Cinematic Header Block */}
        <header className="glass-card p-8 border border-border bg-card shadow-warm rounded-[18px] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-accent-orange" />
          
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge type="tech">{project.domain}</Badge>
            <Badge type="difficulty">{project.difficulty}</Badge>
          </div>

          <h1 className="font-heading text-title md:text-5xl font-black text-text uppercase tracking-wide leading-none mb-4">
            {project.name}
          </h1>
          
          <p className="text-sm text-muted leading-relaxed font-sans mb-6">
            {project.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-border text-xs text-muted font-sans font-medium">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary/15 rounded-xl text-secondary">
                <Calendar size={18} />
              </div>
              <div>
                <span className="block text-[9px] uppercase tracking-wider">Timeframe</span>
                <strong className="text-text text-sm">{project.estimatedTime}</strong>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/15 rounded-xl text-accent-green">
                <Users size={18} />
              </div>
              <div>
                <span className="block text-[9px] uppercase tracking-wider">Crew Size</span>
                <strong className="text-text text-sm">{project.teamSize} {project.teamSize > 1 ? 'Developers' : 'Developer'}</strong>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-orange/15 rounded-xl text-accent-orange">
                <Code size={18} />
              </div>
              <div>
                <span className="block text-[9px] uppercase tracking-wider">Tech Base</span>
                <strong className="text-text text-sm">{project.techStack.slice(0, 3).join(', ')}</strong>
              </div>
            </div>
          </div>
        </header>

        {/* Animated Tabs Selector with Hydraulics Bounces */}
        <div className="flex bg-black/10 dark:bg-black/20 p-1.5 rounded-[18px] border border-border relative">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'synopsis', label: 'AI Synopsis' },
            { id: 'prompt', label: 'AI Prompt' },
            { id: 'roadmap', label: 'Roadmap' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-center text-xs font-heading font-black tracking-wider uppercase rounded-xl transition duration-200 z-10 select-none cursor-pointer ${
                activeTab === tab.id ? 'text-white' : 'text-muted hover:text-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
          {/* Animated background bar */}
          <motion.div
            layoutId="project-tab-active"
            className="absolute top-1.5 bottom-1.5 left-1.5 bg-gradient-to-r from-primary to-accent-green rounded-xl z-0"
            style={{
              width: 'calc(25% - 6px)',
              x: activeTab === 'overview' ? '0%' : activeTab === 'synopsis' ? '100%' : activeTab === 'prompt' ? '200%' : '300%',
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          />
        </div>

        {/* Tab Panels */}
        <section className="mt-6 z-10">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="space-y-6"
            >
              <Card className="border border-border bg-card p-6 space-y-3">
                <h3 className="font-heading font-black text-sm text-text uppercase tracking-wider border-b border-border pb-2.5">Problem Statement</h3>
                <p className="text-xs text-muted leading-relaxed font-sans">{project.problemStatement}</p>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Objectives */}
                <Card className="border border-border bg-card p-6 space-y-3">
                  <h3 className="font-heading font-black text-sm text-text uppercase tracking-wider border-b border-border pb-2.5">Objectives</h3>
                  <ul className="space-y-2">
                    {project.objectives.map((obj, i) => (
                      <li key={i} className="text-xs text-muted flex items-start gap-2.5 font-sans font-medium">
                        <span className="text-secondary font-bold mt-0.5">•</span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Features */}
                <Card className="border border-border bg-card p-6 space-y-3">
                  <h3 className="font-heading font-black text-sm text-text uppercase tracking-wider border-b border-border pb-2.5">Features</h3>
                  <ul className="space-y-2">
                    {project.features.map((feat, i) => (
                      <li key={i} className="text-xs text-muted flex items-start gap-2.5 font-sans font-medium">
                        <span className="text-success font-bold mt-0.5">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              {/* CV Value */}
              <Card className="border border-border bg-card p-6 space-y-4">
                <h3 className="font-heading font-black text-sm text-text uppercase tracking-wider border-b border-border pb-2.5">Resume & CV Value</h3>
                <p className="text-xs text-muted leading-relaxed font-sans">{project.resumeValue}</p>

                <div className="pt-4 border-t border-border flex flex-wrap gap-4 justify-between items-center">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-muted block">Required Skillset Stack</span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.map((tech, idx) => (
                        <span key={idx} className="bg-primary/10 text-accent-green px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-accent-green/10">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* AI SYNOPSIS TAB */}
          {activeTab === 'synopsis' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="space-y-6"
            >
              {!synopsisData && !synopsisLoading && (
                <Card className="border border-border bg-card p-12 text-center space-y-5 rounded-[18px]">
                  <div className="w-16 h-16 rounded-full bg-secondary/15 flex items-center justify-center mx-auto text-secondary shadow-warm">
                    <FileText size={28} />
                  </div>
                  <div className="max-w-md mx-auto space-y-2">
                    <h3 className="font-heading font-black text-lg text-text uppercase">Generate Project Synopsis</h3>
                    <p className="text-xs text-muted leading-relaxed font-sans">
                      Let the ProjectPilot engine generate a fully structured technical proposal featuring abstracts, problem statements, and scopes.
                    </p>
                  </div>
                  <Button variant="glow" onClick={handleTriggerSynopsis} className="mx-auto px-6 py-2.5">
                    <Sparkles size={14} /> Generate Custom Synopsis
                  </Button>
                </Card>
              )}

              {synopsisLoading && (
                <div className="space-y-6">
                  <div className="glass-card p-8 border border-border animate-pulse space-y-4 bg-card">
                    <div className="h-6 w-1/3 bg-black/10 dark:bg-white/5 rounded-xl"></div>
                    <div className="h-20 w-full bg-black/5 dark:bg-white/5 rounded-xl"></div>
                    <div className="h-6 w-1/2 bg-black/10 dark:bg-white/5 rounded-xl"></div>
                  </div>
                </div>
              )}

              {synopsisData && (
                <Card className="border border-border bg-card p-8 space-y-6 rounded-[18px] shadow-warm">
                  <div className="flex justify-between items-center border-b border-border pb-4">
                    <h3 className="font-heading font-black text-lg text-text uppercase tracking-wider">TECHNICAL PROJECT PROPOSAL</h3>
                    <Badge type="tech">Generated</Badge>
                  </div>
                  
                  <div className="space-y-5 font-sans text-xs text-muted leading-relaxed">
                    <div className="space-y-2">
                      <h4 className="font-bold text-text uppercase tracking-wider">1. Project Abstract</h4>
                      <p className="pl-2">{synopsisData.abstract}</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold text-text uppercase tracking-wider">2. Problem Statement</h4>
                      <p className="pl-2">{synopsisData.problemStatement}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <div className="space-y-2">
                        <h4 className="font-bold text-text uppercase tracking-wider">3. Objectives Mapping</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {synopsisData.objectives?.map((obj, i) => (
                            <li key={i}>{obj}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-bold text-text uppercase tracking-wider">4. Scope Limits</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {synopsisData.scope?.map((scp, i) => (
                            <li key={i}>{scp}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <h4 className="font-bold text-text uppercase tracking-wider">5. Expected Outcomes & Deliverables</h4>
                      <p className="pl-2">{synopsisData.expectedOutcome}</p>
                    </div>
                  </div>
                </Card>
              )}
            </motion.div>
          )}

          {/* AI PROMPT TAB */}
          {activeTab === 'prompt' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="space-y-6"
            >
              {!promptData && !promptLoading && (
                <Card className="border border-border bg-card p-12 text-center space-y-5 rounded-[18px]">
                  <div className="w-16 h-16 rounded-full bg-accent-orange/15 flex items-center justify-center mx-auto text-accent-orange shadow-warm">
                    <Code size={28} />
                  </div>
                  <div className="max-w-md mx-auto space-y-2">
                    <h3 className="font-heading font-black text-lg text-text uppercase">Generate Developer Instructions</h3>
                    <p className="text-xs text-muted leading-relaxed font-sans">
                      Extract ready-to-paste instruction prompts specifically optimized for Claude, Cursor, or ChatGPT developers.
                    </p>
                  </div>
                  <Button variant="glow" onClick={handleTriggerPrompt} className="mx-auto px-6 py-2.5">
                    <Sparkles size={14} /> Generate Prompt
                  </Button>
                </Card>
              )}

              {promptLoading && (
                <div className="space-y-6">
                  <div className="glass-card p-8 border border-border animate-pulse space-y-4 bg-card">
                    <div className="h-6 w-1/3 bg-black/10 dark:bg-white/5 rounded-xl"></div>
                    <div className="h-16 w-full bg-black/5 dark:bg-white/5 rounded-xl"></div>
                  </div>
                </div>
              )}

              {promptData && (
                <Card className="border border-border bg-card p-6 space-y-4 rounded-[18px] shadow-warm">
                  <div className="flex justify-between items-center border-b border-border pb-4">
                    <div className="text-left">
                      <h4 className="font-heading font-black text-lg text-text uppercase tracking-wide">SYSTEM ARCHITECT INSTRUCTIONS</h4>
                      <span className="text-[10px] font-bold text-muted uppercase tracking-wider block font-sans">COPY TO CURSOR OR CLAUDE CHAT</span>
                    </div>
                    <Button variant="glow" className="px-4 py-2 text-xs flex items-center gap-1.5" onClick={handleCopyPrompt}>
                      {copied ? (
                        <>
                          <Check size={14} /> Prompt Copied
                        </>
                      ) : (
                        <>
                          <Copy size={14} /> Copy Prompt
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="bg-black/10 dark:bg-black/35 p-6 rounded-xl border border-border font-mono text-xs overflow-x-auto max-h-[500px] leading-relaxed text-muted whitespace-pre-wrap select-all shadow-hud">
                    {promptData.content}
                  </div>
                </Card>
              )}
            </motion.div>
          )}

          {/* ROADMAP TIMELINE TAB */}
          {activeTab === 'roadmap' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="space-y-8 font-sans"
            >
              <div className="relative border-l-2 border-border ml-4 md:ml-32 pl-8 space-y-12 py-4">
                {roadmapPhases.map((phase, idx) => (
                  <div key={idx} className="relative group">
                    
                    {/* Node marker */}
                    <div className="absolute left-[-42px] top-1 w-6 h-6 rounded-full bg-card border-2 border-secondary flex items-center justify-center group-hover:border-accent-orange transition duration-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary group-hover:bg-accent-orange transition"></span>
                    </div>

                    <span className="absolute left-[-160px] top-1 text-xs font-heading font-black tracking-widest text-muted hidden md:block w-28 text-right uppercase">
                      {phase.timeline}
                    </span>

                    <div className="space-y-3">
                      <h4 className="font-heading font-black text-lg text-text uppercase tracking-wide group-hover:text-secondary transition duration-200">
                        {phase.phase}
                      </h4>
                      <p className="text-xs text-muted leading-relaxed font-sans">{phase.description}</p>
                      
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pl-1.5">
                        {phase.tasks.map((task, tIdx) => (
                          <li key={tIdx} className="text-xs text-muted flex items-start gap-2.5 font-sans font-medium">
                            <span className="text-accent-orange mt-0.5">•</span>
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </section>

      </div>
    </div>
  );
}
