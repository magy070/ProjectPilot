import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../context/AuthContext.jsx';
import { Sparkles, Calendar, Users, Code, ChevronRight, Copy, Check, FileText, ArrowLeft, GitCommit, CheckCircle2 } from 'lucide-react';
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
    enabled: false // Triggered on-demand by user
  });

  // Fetch Prompt
  const { data: promptData, refetch: fetchPrompt, isLoading: promptLoading } = useQuery({
    queryKey: ['prompt', id],
    queryFn: async () => {
      const res = await api.post(`/api/ai/prompt/${id}`);
      return res.data.prompt;
    },
    enabled: false // Triggered on-demand by user
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
        <div className="h-8 w-1/3 bg-white/10 rounded mx-auto"></div>
        <div className="h-32 bg-white/5 rounded-xl"></div>
        <div className="h-6 w-1/2 bg-white/10 rounded mx-auto"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-6">
        <h2 className="text-xl font-bold text-rose-500">Project Not Found</h2>
        <Button variant="secondary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  // Dynamic Timeline Roadmap Generator
  const getDynamicRoadmap = () => {
    let totalDays = 30; // default fallback
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

    const formatDuration = (units) => {
      if (useHours) {
        return `${units} ${units === 1 ? 'Hour' : 'Hours'}`;
      }
      if (units >= 7 && units % 7 === 0) {
        const weeks = units / 7;
        return `${weeks} ${weeks > 1 ? 'Weeks' : 'Week'}`;
      }
      return `${units} ${units === 1 ? 'Day' : 'Days'}`;
    };

    const isGame = project.domain.toLowerCase().includes('game') || 
                   project.techStack.some(t => ['pygame', 'unity', 'phaser', 'canvas', 'game'].includes(t.toLowerCase()));
    
    const isScriptOrScraper = project.domain.toLowerCase().includes('scraper') || 
                              project.name.toLowerCase().includes('scraper') ||
                              project.techStack.some(t => ['beautifulsoup', 'selenium', 'pandas', 'scrapy', 'cheerio'].includes(t.toLowerCase()));

    let phases = [];

    if (isGame) {
      phases = [
        {
          name: "Concept & Asset Design",
          pct: 0.15,
          details: "Define the game loop rules, control mechanics, and design/import static sprites, fonts, and sound files."
        },
        {
          name: "Core Gameplay Mechanics",
          pct: 0.35,
          details: `Initialize the screen update canvas. Bind controller keyboard keys and implement basic player movements using ${project.techStack.join(', ')}.`
        },
        {
          name: "Game State & Scoring System",
          pct: 0.25,
          details: "Build the start menu, game-over trigger overlays, and score calculations. Increase enemy velocity as the score escalates."
        },
        {
          name: "SFX & Visual Adjustments",
          pct: 0.15,
          details: "Load audio effects for collisions, player shooting, and state changes. Align graphic layers and fix visual bugs."
        },
        {
          name: "Playtesting & Packaging",
          pct: 0.10,
          details: "Run edge-to-edge hitbox testing. Resolve canvas boundary leaks and compile the final executable."
        }
      ];
    } else if (isScriptOrScraper) {
      phases = [
        {
          name: "Target HTML Inspection",
          pct: 0.20,
          details: `Analyze DOM attributes and selectors of the target web pages. Select tools matching: ${project.techStack.join(', ')}.`
        },
        {
          name: "Parser Logic & Loop Core",
          pct: 0.40,
          details: "Setup target connection protocols. Retrieve document strings, implement extraction filters, and parse table rows."
        },
        {
          name: "Data Cleansing & Exporting",
          pct: 0.20,
          details: "Clean raw text outputs, drop invalid fields, and export logs to structured JSON or CSV file formats."
        },
        {
          name: "Rate Limiting & Exception Handling",
          pct: 0.20,
          details: "Configure sleep intervals between request batches to bypass anti-scraping firewalls. Wrap in try-catch guards."
        }
      ];
    } else {
      phases = [
        {
          name: "Requirements & Mockups",
          pct: 0.15,
          details: `Document layout scopes. Prototype mock views matching: ${project.name}.`
        },
        {
          name: "API & Data Schema Design",
          pct: 0.20,
          details: `Configure databases models mapping keys for: ${project.techStack.slice(0, 3).join(', ')}.`
        },
        {
          name: "Backend Core Build",
          pct: 0.25,
          details: "Bootstrap API controllers, add route routers, and set up Zod validator filters and JWT middleware shields."
        },
        {
          name: "Frontend UI Integration",
          pct: 0.25,
          details: "Develop user interface components, hook up API response handlers, and setup state manager caching."
        },
        {
          name: "Testing & Cloud Release",
          pct: 0.15,
          details: "Write test suites, compile production bundles, customize environment values, and deploy."
        }
      ];
    }

    let allocatedUnits = 0;
    const roadmap = phases.map((phase, idx) => {
      let durationUnits = Math.round(totalUnits * phase.pct);
      if (durationUnits < 1) durationUnits = 1;
      
      if (idx === phases.length - 1 && totalUnits > phases.length) {
        durationUnits = Math.max(1, totalUnits - allocatedUnits);
      } else {
        allocatedUnits += durationUnits;
      }

      return {
        phase: phase.name,
        duration: formatDuration(durationUnits),
        details: phase.details
      };
    });

    return roadmap;
  };

  const roadmapSteps = getDynamicRoadmap();

  return (
    <div className="bg-background min-h-screen text-text py-12 relative overflow-hidden font-sans">
      <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-8">
        
        {/* Back navigation */}
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 text-xs text-muted hover:text-white transition duration-200"
        >
          <ArrowLeft size={14} /> Back to Discover
        </button>

        {/* Project Header Info */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge type="difficulty">{project.difficulty}</Badge>
            <span className="text-xs text-muted border border-white/10 bg-white/2 px-2 py-0.5 rounded">
              {project.domain}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {project.name}
          </h1>
          <p className="text-muted text-sm leading-relaxed max-w-3xl">
            {project.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4 border-t border-white/5 text-xs text-muted">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-primary" />
              <div>
                <span className="block font-medium">Estimated Timeframe</span>
                <strong className="text-white text-sm">{project.estimatedTime}</strong>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-secondary" />
              <div>
                <span className="block font-medium">Ideal Team Size</span>
                <strong className="text-white text-sm">{project.teamSize} {project.teamSize > 1 ? 'Developers' : 'Developer'}</strong>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Code size={16} className="text-primary" />
              <div>
                <span className="block font-medium">Core Stack Base</span>
                <strong className="text-white text-sm">{project.techStack.slice(0, 3).join(', ')}</strong>
              </div>
            </div>
          </div>
        </header>

        {/* Tab Controls */}
        <div className="flex border-b border-white/5 bg-white/1 p-1 rounded-xl">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'synopsis', label: 'AI Synopsis' },
            { id: 'prompt', label: 'AI Prompt' },
            { id: 'roadmap', label: 'Timeline Roadmap' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg transition duration-200 ${
                activeTab === tab.id 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-muted hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Panels */}
        <section className="mt-6">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Problem statement */}
              <Card className="border border-white/5 bg-white/1 space-y-3">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">Problem Statement</h3>
                <p className="text-sm text-muted leading-relaxed">{project.problemStatement}</p>
              </Card>

              {/* Objectives & Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Objectives */}
                <Card className="border border-white/5 bg-white/1 space-y-3">
                  <h3 className="font-bold text-sm text-white uppercase tracking-wider">Project Objectives</h3>
                  <ul className="space-y-2">
                    {project.objectives.map((obj, i) => (
                      <li key={i} className="text-xs text-muted flex items-start gap-2">
                        <span className="text-primary font-bold mt-0.5">•</span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Features */}
                <Card className="border border-white/5 bg-white/1 space-y-3">
                  <h3 className="font-bold text-sm text-white uppercase tracking-wider">Main Product Features</h3>
                  <ul className="space-y-2">
                    {project.features.map((feat, i) => (
                      <li key={i} className="text-xs text-muted flex items-start gap-2">
                        <span className="text-secondary font-bold mt-0.5">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

              </div>

              {/* Skill Stack details */}
              <Card className="border border-white/5 bg-white/1 space-y-4">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">Resume & CV Value</h3>
                <p className="text-xs text-muted leading-relaxed">{project.resumeValue}</p>

                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row gap-4 justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted block mb-1.5">Required Skill Set:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.requiredSkills.map((s, idx) => (
                        <span key={idx} className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white text-[10px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted block mb-1.5">Full Stack Base:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.map((s, idx) => (
                        <span key={idx} className="bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded text-[10px] font-semibold">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

            </div>
          )}

          {/* SYNOPSIS TAB */}
          {activeTab === 'synopsis' && (
            <div className="space-y-6">
              {!synopsisData && !synopsisLoading ? (
                <Card className="border border-white/5 bg-white/1 p-12 text-center space-y-4">
                  <FileText className="mx-auto text-muted" size={40} />
                  <p className="text-sm text-muted max-w-sm mx-auto">
                    Generate an AI technical synopsis containing abstract, scopes, objectives, and outcomes for your documentation folders.
                  </p>
                  <Button variant="glow" onClick={handleTriggerSynopsis} className="mx-auto">
                    Generate AI Synopsis
                  </Button>
                </Card>
              ) : synopsisLoading ? (
                <div className="space-y-6 animate-pulse">
                  <div className="h-8 w-1/3 bg-white/10 rounded"></div>
                  <div className="h-24 bg-white/5 rounded-xl"></div>
                  <div className="h-40 bg-white/5 rounded-xl"></div>
                </div>
              ) : (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Synopsis Header */}
                  <div className="flex justify-between items-center bg-white/5 border border-white/10 p-4 rounded-xl">
                    <span className="text-xs text-muted flex items-center gap-2">
                      <Sparkles size={14} className="text-primary animate-pulse" /> Custom AI Synopsis Generated
                    </span>
                    <span className="text-xs text-muted font-mono">Status: Ready</span>
                  </div>

                  {/* Title & Abstract */}
                  <Card className="border border-white/5 bg-white/1 space-y-3">
                    <h2 className="text-lg font-bold text-white">{synopsisData.title}</h2>
                    <h3 className="font-bold text-xs text-primary uppercase tracking-wider pt-2">Abstract Overview</h3>
                    <p className="text-sm text-muted leading-relaxed">{synopsisData.abstract}</p>
                  </Card>

                  {/* Detailed scopes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border border-white/5 bg-white/1 space-y-3">
                      <h3 className="font-bold text-xs text-secondary uppercase tracking-wider">Objectives Mapping</h3>
                      <ul className="space-y-2">
                        {synopsisData.objectives.map((obj, i) => (
                          <li key={i} className="text-xs text-muted flex items-start gap-2">
                            <span className="text-secondary font-bold">•</span>
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>

                    <Card className="border border-white/5 bg-white/1 space-y-3">
                      <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Scope Limits</h3>
                      <ul className="space-y-2">
                        {synopsisData.scope.map((scp, i) => (
                          <li key={i} className="text-xs text-muted flex items-start gap-2">
                            <span className="text-primary font-bold">•</span>
                            <span>{scp}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </div>

                  {/* Expected Outcomes */}
                  <Card className="border border-white/5 bg-white/1 space-y-3">
                    <h3 className="font-bold text-xs text-secondary uppercase tracking-wider">Expected Deliverables</h3>
                    <p className="text-sm text-muted leading-relaxed">{synopsisData.expectedOutcome}</p>
                  </Card>

                </div>
              )}
            </div>
          )}

          {/* AI PROMPT TAB */}
          {activeTab === 'prompt' && (
            <div className="space-y-6">
              {!promptData && !promptLoading ? (
                <Card className="border border-white/5 bg-white/1 p-12 text-center space-y-4">
                  <Code className="mx-auto text-muted" size={40} />
                  <p className="text-sm text-muted max-w-sm mx-auto">
                    Generate an optimized, ready-to-paste AI developer prompt containing instructions for ChatGPT, Claude, or Cursor coding workflows.
                  </p>
                  <Button variant="glow" onClick={handleTriggerPrompt} className="mx-auto">
                    Generate Dev Prompt
                  </Button>
                </Card>
              ) : promptLoading ? (
                <div className="space-y-6 animate-pulse">
                  <div className="h-8 w-1/3 bg-white/10 rounded"></div>
                  <div className="h-48 bg-white/5 rounded-xl"></div>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in">
                  
                  <div className="flex justify-between items-center bg-white/5 border border-white/10 p-4 rounded-xl">
                    <span className="text-xs text-muted">
                      Prompt configured for: <strong>ChatGPT / Claude / Cursor</strong>
                    </span>
                    
                    <Button variant="secondary" className="px-3.5 py-1.5 text-xs gap-1.5" onClick={handleCopyPrompt}>
                      {copied ? (
                        <>
                          <Check size={14} className="text-emerald-400" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={14} /> Copy Prompt
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="bg-black/50 p-6 rounded-xl border border-white/5 font-mono text-xs overflow-x-auto max-h-[500px] leading-relaxed text-muted whitespace-pre-wrap select-all">
                    {promptData.content}
                  </div>

                </div>
              )}
            </div>
          )}

          {/* ROADMAP TAB */}
          {activeTab === 'roadmap' && (
            <div className="space-y-8 animate-fade-in pl-6 border-l border-white/5 relative ml-6 pt-4">
              {roadmapSteps.map((step, idx) => (
                <div key={idx} className="relative group">
                  
                  {/* node dot */}
                  <div className="absolute left-[-32px] top-1.5 w-4 h-4 rounded-full bg-background border border-primary/50 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/70"></span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono bg-white/5 border border-white/5 px-2 py-0.5 rounded text-muted">
                        PHASE 0{idx + 1}
                      </span>
                      <h4 className="font-bold text-white text-base">
                        {step.phase}
                      </h4>
                      <span className="text-xs text-primary font-semibold">
                        ({step.duration})
                      </span>
                    </div>
                    <p className="text-xs text-muted leading-relaxed max-w-2xl">
                      {step.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </section>

      </div>
    </div>
  );
}
