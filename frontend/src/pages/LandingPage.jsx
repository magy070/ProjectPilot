import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle, Database, GitBranch, RefreshCw, BarChart2, ShieldCheck } from 'lucide-react';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import Badge from '../components/Badge.jsx';

export default function LandingPage() {
  const navigate = useNavigate();
  const [promptInput, setPromptInput] = useState('');

  const chips = ['AI/ML', 'Blockchain', 'Web Dev', 'Cybersecurity', 'Cloud', 'IoT'];

  const features = [
    {
      icon: <Sparkles className="text-primary" size={24} />,
      title: "Smart Recommendation",
      description: "Get personalized project matches ranked by feasibility, aligning with your current skill set and interests."
    },
    {
      icon: <Database className="text-secondary" size={24} />,
      title: "AI Synopsis Generator",
      description: "Generate structured technical synopses including abstract, problem statements, and scopes in one click."
    },
    {
      icon: <GitBranch className="text-primary" size={24} />,
      title: "AI Prompt Generator",
      description: "Produce ready-to-paste instruction prompts specifically optimized for Claude, ChatGPT, or Cursor."
    },
    {
      icon: <RefreshCw className="text-secondary" size={24} />,
      title: "Development Roadmap",
      description: "Visualize step-by-step roadmaps from requirements analysis, database schema layout, up to staging deployment."
    },
    {
      icon: <BarChart2 className="text-primary" size={24} />,
      title: "Project Comparison",
      description: "Compare difficulty, duration, innovations, and resume values for up to three projects side-by-side."
    },
    {
      icon: <ShieldCheck className="text-secondary" size={24} />,
      title: "Saved Projects",
      description: "Bookmark promising project concepts to build your dashboard tracker and monitor planning states."
    }
  ];

  const steps = [
    "Create your developer profile",
    "Configure skills & interest fields",
    "Receive feasibility recommendations",
    "Generate full technical synopses",
    "Extract copy-paste builder prompts",
    "Implement and ship your project"
  ];

  const handleGenerate = (e) => {
    e.preventDefault();
    if (promptInput.trim()) {
      navigate(`/auth?tab=register&query=${encodeURIComponent(promptInput)}`);
    } else {
      navigate('/auth?tab=register');
    }
  };

  const handleChipClick = (chip) => {
    navigate(`/auth?tab=register&domain=${encodeURIComponent(chip)}`);
  };

  return (
    <div className="bg-background min-h-screen text-text relative overflow-hidden font-sans">
      {/* Background blobs */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[150px] pointer-events-none"></div>
      <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] rounded-full bg-secondary/5 blur-[150px] pointer-events-none"></div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-16 flex flex-col items-center text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-xs font-semibold text-primary mb-6 animate-pulse">
          <Sparkles size={12} /> Next-Gen AI Project Architect
        </div>
        
        <h1 className="text-hero md:text-6xl font-extrabold tracking-tight max-w-4xl bg-gradient-to-b from-white to-muted bg-clip-text text-transparent leading-tight">
          Build Better Projects <br className="hidden sm:inline" />
          with <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent glow-text-primary">AI Guidance</span>
        </h1>
        
        <p className="mt-6 text-lg md:text-xl text-muted max-w-2xl">
          ProjectPilot helps students and developers discover project ideas, generate comprehensive synopses, extract developer prompts, and map execution timelines.
        </p>

        {/* Premium prompt input */}
        <form onSubmit={handleGenerate} className="mt-12 w-full max-w-2xl relative">
          <div className="glass-card p-2 rounded-2xl border border-white/10 flex items-center shadow-2xl">
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="Describe what you want to build (e.g., 'A decentralized social network for photographers'...)"
              className="w-full bg-transparent border-none text-sm text-white px-4 focus:outline-none placeholder-muted"
            />
            <Button type="submit" variant="glow" className="shrink-0 rounded-xl px-6 py-3">
              Generate Ideas <ArrowRight size={16} />
            </Button>
          </div>
        </form>

        {/* Chips */}
        <div className="mt-6 flex flex-wrap justify-center gap-2.5 max-w-2xl">
          {chips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleChipClick(chip)}
              className="text-xs px-3.5 py-1.5 rounded-full border border-white/5 bg-white/5 text-muted hover:text-white hover:border-primary/40 hover:bg-white/10 transition-all select-none"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Static dashboard preview mockup */}
        <div className="mt-20 w-full max-w-5xl rounded-2xl border border-white/10 bg-white/2 p-2 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none"></div>
          <div className="rounded-xl overflow-hidden border border-white/5 bg-black/60 relative">
            <div className="h-8 border-b border-white/5 bg-white/5 flex items-center px-4 gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60"></span>
              <span className="text-[10px] text-muted ml-4 font-mono">projectpilot.app/dashboard</span>
            </div>
            
            {/* Mock layout structure */}
            <div className="p-8 text-left grid grid-cols-3 gap-6 opacity-80 min-h-[300px]">
              <div className="col-span-2 space-y-4">
                <div className="h-6 w-48 bg-white/10 rounded"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-32 bg-white/5 rounded-xl border border-white/5 p-4 flex flex-col justify-between">
                    <div className="h-4 w-12 bg-primary/20 rounded"></div>
                    <div className="h-8 w-24 bg-white/20 rounded"></div>
                  </div>
                  <div className="h-32 bg-white/5 rounded-xl border border-white/5 p-4 flex flex-col justify-between">
                    <div className="h-4 w-12 bg-secondary/20 rounded"></div>
                    <div className="h-8 w-24 bg-white/20 rounded"></div>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 rounded-xl border border-white/5 p-4 space-y-3">
                <div className="h-4 w-24 bg-white/15 rounded"></div>
                <div className="h-2 w-full bg-white/5 rounded"></div>
                <div className="h-2 w-full bg-white/5 rounded"></div>
                <div className="h-2 w-3/4 bg-white/5 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-title md:text-4xl font-extrabold bg-gradient-to-b from-white to-muted bg-clip-text text-transparent">
            Equipped with Premium Developer Utilities
          </h2>
          <p className="mt-4 text-muted text-base max-w-lg mx-auto">
            Everything you need to orchestrate a portfolio-defining capstone or software project.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, index) => (
            <Card key={index} hoverGlow className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                {feat.icon}
              </div>
              <div>
                <h3 className="font-bold text-lg text-white mb-2">{feat.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{feat.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-title font-extrabold bg-gradient-to-b from-white to-muted bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="mt-4 text-muted text-base">
            From zero to developer prompts in six easy steps.
          </p>
        </div>

        {/* Timeline block */}
        <div className="relative border-l border-white/5 ml-4 md:ml-32 pl-8 space-y-12">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group">
              {/* Point Node */}
              <div className="absolute left-[-42px] top-1 w-6 h-6 rounded-full bg-background border-2 border-primary/40 flex items-center justify-center group-hover:border-primary transition duration-300">
                <span className="w-2.5 h-2.5 rounded-full bg-primary/60 group-hover:bg-primary transition"></span>
              </div>
              
              {/* Optional step tag */}
              <span className="absolute left-[-160px] top-1 text-xs text-muted font-mono hidden md:block w-28 text-right">
                STEP 0{idx + 1}
              </span>
              
              <div>
                <h4 className="font-semibold text-lg text-white group-hover:text-primary transition duration-200">
                  {step}
                </h4>
                <p className="text-sm text-muted mt-1 leading-relaxed">
                  Automatically mapped and stored inside your cloud sync history vault.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-5xl mx-auto px-6 py-20 relative z-10 text-center">
        <div className="glass-card rounded-3xl p-12 border border-white/10 bg-gradient-to-tr from-white/1 to-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 pointer-events-none"></div>
          <h2 className="text-title md:text-4xl font-extrabold text-white">
            Ready to Build Better Projects?
          </h2>
          <p className="mt-4 text-muted max-w-lg mx-auto text-sm leading-relaxed">
            Create an account in under 30 seconds to receive customized proposals based on your current technical experience.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button variant="primary" onClick={() => navigate('/auth?tab=register')}>
              Get Started Free
            </Button>
            <a href="#features" className="flex items-center">
              <Button variant="secondary">Learn More</Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
