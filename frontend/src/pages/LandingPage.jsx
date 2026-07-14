import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle, Database, GitBranch, RefreshCw, BarChart2, ShieldCheck, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext.jsx';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import Badge from '../components/Badge.jsx';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const [promptInput, setPromptInput] = useState('');

  // Handle cross-page scrolling on load
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, [location]);

  const chips = ['AI/ML', 'Blockchain', 'Web Dev', 'Cybersecurity', 'Cloud', 'IoT'];

  const features = [
    {
      icon: <Sparkles className="text-secondary" size={24} />,
      title: "Smart Recommendation",
      description: "Get personalized project matches ranked by feasibility, aligning with your current skill set and interests."
    },
    {
      icon: <Database className="text-accent-orange" size={24} />,
      title: "AI Synopsis Generator",
      description: "Generate structured technical synopses including abstract, problem statements, and scopes in one click."
    },
    {
      icon: <GitBranch className="text-accent-green" size={24} />,
      title: "AI Prompt Generator",
      description: "Produce ready-to-paste instruction prompts specifically optimized for Claude, ChatGPT, or Cursor."
    },
    {
      icon: <RefreshCw className="text-secondary" size={24} />,
      title: "Development Roadmap",
      description: "Visualize step-by-step roadmaps from requirements analysis, database schema layout, up to staging deployment."
    },
    {
      icon: <BarChart2 className="text-accent-orange" size={24} />,
      title: "Project Comparison",
      description: "Compare difficulty, duration, innovations, and resume values for up to three projects side-by-side."
    },
    {
      icon: <ShieldCheck className="text-accent-green" size={24} />,
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

  // Testimonials state for auto-slider carousel
  const testimonials = [
    { name: "CJ", role: "Grove Street Lead", quote: "This platform is pure gold. Found my capstone in 2 minutes, and the roadmap got us directly into production." },
    { name: "Sweet", role: "Product Manager", quote: "Helped me structure my team's sprint planning. The ChatGPT prompt generation cuts setup time in half." },
    { name: "Kendl", role: "UI Designer", quote: "The contrast, visual rhythm, and speed are incredible. Highly recommend to any student developer." }
  ];
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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

  const scrollDown = () => {
    const el = document.getElementById('features');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-background min-h-screen text-text relative overflow-hidden font-sans transition-colors duration-300">
      
      {/* Hero Full-Screen Background Wrapper */}
      <div className="absolute inset-x-0 top-0 h-screen overflow-hidden pointer-events-none z-0">
        
        {/* Cinematic GTA Sunset Cover Image */}
        <img 
          src="/gta_sunset.jpg" 
          alt="Los Santos Sunset Background" 
          className="absolute inset-0 w-full h-full object-cover select-none animate-cinematic"
          loading="lazy"
        />
        
        {/* Layer 1: Semi-transparent dark overlay (45% opacity) */}
        <div className="absolute inset-0 bg-black/45" />
        
        {/* Layer 2: Left-to-right gradient: Black to Transparent */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
        
        {/* Layer 3: Subtle warm orange gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-accent-orange/15 via-transparent to-accent-orange/10 mix-blend-color-burn" />
        
        {/* Parallax Clouds */}
        <div className="absolute top-[12%] left-0 w-64 h-12 bg-white/5 dark:bg-white/3 blur-2xl rounded-full animate-cloud-slow" />
        <div className="absolute top-[28%] left-0 w-80 h-16 bg-white/7 dark:bg-white/3 blur-3xl rounded-full animate-cloud-fast" style={{ animationDelay: '5s' }} />

        {/* Flying Birds silhouette in the distance */}
        <div className="absolute inset-0 animate-bird-flight">
          <svg className="w-12 h-12 text-[#3A5F0B]/30 dark:text-black/20" viewBox="0 0 100 100">
            <path d="M10 50 C 30 30, 45 45, 50 50 C 55 45, 70 30, 90 50 C 70 42, 55 48, 50 50 C 45 48, 30 42, 10 50 Z" fill="currentColor" />
          </svg>
        </div>

        {/* Soft light glows / floating atmosphere */}
        <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-accent-orange/10 blur-[100px] rounded-full animate-light-pulse" />
        <div className="absolute bottom-[30%] right-[15%] w-[400px] h-[400px] bg-secondary/10 blur-[130px] rounded-full animate-light-pulse" style={{ animationDelay: '2s' }} />

        {/* Bottom vignette fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Palm Tree silhouettes framing the sides */}
      <div className="hidden xl:block absolute left-4 top-[25vh] w-48 h-[600px] pointer-events-none z-10 text-[#3A5F0B]/10 dark:text-[#18230D]/30">
        <svg viewBox="0 0 100 200" fill="currentColor" className="w-full h-full">
          <path d="M 50 200 C 45 150, 48 100, 50 40 C 35 30, 25 35, 10 50 C 20 40, 35 35, 50 40 C 55 30, 70 25, 90 30 C 75 30, 60 35, 50 40 C 45 20, 30 10, 15 15 C 30 15, 42 28, 50 40 C 58 20, 75 12, 85 18 C 72 20, 62 28, 50 40 Z" />
        </svg>
      </div>
      <div className="hidden xl:block absolute right-4 top-[30vh] w-48 h-[550px] pointer-events-none z-10 text-[#3A5F0B]/10 dark:text-[#18230D]/30 scale-x-[-1]">
        <svg viewBox="0 0 100 200" fill="currentColor" className="w-full h-full">
          <path d="M 50 200 C 45 150, 48 100, 50 40 C 35 30, 25 35, 10 50 C 20 40, 35 35, 50 40 C 55 30, 70 25, 90 30 C 75 30, 60 35, 50 40 C 45 20, 30 10, 15 15 C 30 15, 42 28, 50 40 C 58 20, 75 12, 85 18 C 72 20, 62 28, 50 40 Z" />
        </svg>
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center relative z-20 max-w-5xl mx-auto px-6 pt-20">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="w-full flex flex-col items-center text-center space-y-6"
        >
          {/* Badge */}
          <motion.div 
            variants={fadeUp} 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-[18px] border border-secondary/30 bg-black/45 backdrop-blur-sm text-xs font-bold uppercase tracking-widest text-secondary shadow-hud animate-pulse"
          >
            <Sparkles size={13} className="text-secondary" /> LOS SANTOS HEADQUARTERS
          </motion.div>
          
          {/* Title */}
          <motion.h1 
            variants={fadeUp} 
            className="font-heading text-5xl sm:text-6xl md:text-8xl font-black tracking-wide max-w-5xl text-text leading-[0.9] uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
          >
            BUILD BETTER PROJECTS <br />
            WITH <span className="text-secondary bg-clip-text bg-gradient-to-r from-secondary to-accent-orange">AI ROADMAPS</span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            variants={fadeUp} 
            className="text-sm sm:text-base md:text-lg text-muted max-w-2xl font-sans leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
          >
            ProjectPilot helps students and developers discover project ideas, generate comprehensive synopses, extract developer prompts, and map execution timelines.
          </motion.p>

          {/* Action buttons */}
          <motion.div 
            variants={fadeUp} 
            className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md pt-4"
          >
            {/* Primary button */}
            <motion.button
              onClick={() => navigate('/auth?tab=register')}
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(58, 95, 11, 0.65)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-[18px] text-xs font-heading font-black tracking-widest uppercase bg-gradient-to-r from-[#3A5F0B] to-[#557F1C] hover:from-[#497512] hover:to-[#639226] text-white transition-all duration-300 shadow-hud cursor-pointer select-none border-none outline-none"
            >
              Get Started Now <ArrowRight size={14} className="inline ml-1" />
            </motion.button>

            {/* Secondary button */}
            <motion.button
              onClick={scrollDown}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(224, 216, 200, 0.15)", boxShadow: "0 0 20px rgba(224, 216, 200, 0.25)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-[18px] text-xs font-heading font-black tracking-widest uppercase border-2 border-[#E0D8C8] text-[#E0D8C8] bg-transparent transition-all duration-300 cursor-pointer select-none outline-none"
            >
              Explore Features
            </motion.button>
          </motion.div>

          {/* Prompt Input Form */}
          <motion.form 
            variants={fadeUp} 
            onSubmit={handleGenerate} 
            className="w-full max-w-2xl relative pt-4"
          >
            <div className="glass-card p-2 rounded-[18px] border border-border flex items-center shadow-hud bg-card/90">
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="Describe what you want to build (e.g. 'Lowrider telemetry dashboard')..."
                className="w-full bg-transparent border-none text-xs text-text px-4 focus:outline-none placeholder-muted/60"
              />
              <Button type="submit" variant="primary" className="shrink-0 text-xs py-2">
                Generate <ArrowRight size={14} />
              </Button>
            </div>
          </motion.form>

          {/* Chips */}
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-2 max-w-2xl z-20">
            {chips.map((chip, idx) => (
              <motion.button
                key={idx}
                onClick={() => handleChipClick(chip)}
                whileHover={{ scale: 1.05, y: -2, borderColor: '#C49A4A', color: '#fff' }}
                whileTap={{ scale: 0.95 }}
                className="text-[10px] font-heading font-black tracking-wider uppercase px-4.5 py-2 rounded-xl border border-border bg-black/45 text-muted hover:text-text transition-all duration-200 select-none cursor-pointer"
              >
                {chip}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <div 
          onClick={scrollDown}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-muted hover:text-text cursor-pointer transition duration-300 select-none z-30"
        >
          <span className="text-[9px] font-heading font-black tracking-widest uppercase opacity-70">Scroll Down</span>
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="flex flex-col items-center gap-1"
          >
            {/* Mouse outline */}
            <div className="w-5 h-8 border-2 border-muted/80 rounded-full flex justify-center p-1 relative">
              <span className="w-1 h-2 bg-secondary rounded-full animate-bounce absolute top-1.5"></span>
            </div>
            {/* Down Chevron */}
            <svg className="w-3.5 h-3.5 text-muted/80 mt-1 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 relative z-20">
        <div className="text-center mb-16">
          <h2 className="font-heading text-title md:text-5xl font-black text-text uppercase tracking-wide">
            Equipped with Premium Developer Utilities
          </h2>
          <p className="mt-4 text-muted text-sm max-w-md mx-auto">
            Everything you need to orchestrate a portfolio-defining capstone or software project.
          </p>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feat, index) => (
            <motion.div 
              key={index}
              variants={fadeUp}
              whileHover={{ y: -6, rotate: 0.5 }}
              className="transition-all duration-300 rounded-[18px]"
            >
              <Card className="flex flex-col gap-5 h-full bg-card border border-border shadow-warm">
                <div className="w-12 h-12 rounded-[18px] bg-secondary/15 flex items-center justify-center border border-secondary/30 shrink-0">
                  {feat.icon}
                </div>
                <div>
                  <h3 className="font-heading font-black text-lg text-text mb-2 uppercase tracking-wide">{feat.title}</h3>
                  <p className="text-xs text-muted leading-relaxed font-sans">{feat.description}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Downtown Los Santos Mid-Page Showcase */}
      <section className="min-h-screen w-full relative overflow-hidden flex items-center justify-center z-20 font-sans border-y border-border">
        {/* Background zoom container */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <img 
            src="/gta_downtown.jpg" 
            alt="Downtown Los Santos" 
            className="w-full h-full object-cover animate-cinematic-downtown select-none"
            loading="lazy"
          />
          {/* Layer 1: Dark tint */}
          <div className="absolute inset-0 bg-black/45" />
          
          {/* Layer 2: Warm sunset gradient */}
          <div className="absolute inset-0 bg-gradient-to-tr from-accent-orange/20 via-transparent to-accent-orange/15 mix-blend-color-burn" />
          
          {/* Layer 3: Radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(196,154,74,0.12)_0%,transparent_60%)]" />

          {/* Clouds */}
          <div className="absolute top-[10%] left-0 w-72 h-12 bg-white/5 blur-2xl rounded-full animate-cloud-slow" />
          
          {/* Birds */}
          <div className="absolute inset-0 animate-bird-flight opacity-35">
            <svg className="w-12 h-12 text-[#3A5F0B]/25" viewBox="0 0 100 100">
              <path d="M10 50 C 30 30, 45 45, 50 50 C 55 45, 70 30, 90 50 C 70 42, 55 48, 50 50 C 45 48, 30 42, 10 50 Z" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* Ambient dust and light particles */}
        <div className="absolute top-[35%] left-[20%] w-1.5 h-1.5 bg-accent-orange rounded-full animate-ping" style={{ animationDuration: '3.5s' }} />
        <div className="absolute bottom-[25%] right-[25%] w-2 h-2 bg-secondary/30 rounded-full animate-pulse" />

        {/* Contents Grid */}
        <div className="max-w-7xl mx-auto px-6 py-20 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Left Side: Pitch Content */}
          <motion.div 
            initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-left space-y-6 max-w-xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[18px] border border-secondary/30 bg-black/45 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest text-secondary shadow-hud">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" /> OPPORTUNITY RADAR
            </div>
            
            <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black text-text leading-[0.95] uppercase tracking-wide drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]">
              Every Great Project <br />
              Starts Somewhere.
            </h2>
            
            <p className="text-xs sm:text-sm text-muted font-sans leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              Discover AI-powered project recommendations tailored to your skills, interests, and career goals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <motion.button
                onClick={() => navigate('/auth?tab=register')}
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(58, 95, 11, 0.65)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-[18px] text-xs font-heading font-black tracking-widest uppercase bg-gradient-to-r from-[#3A5F0B] to-[#557F1C] hover:from-[#497512] hover:to-[#639226] text-white transition-all duration-300 shadow-hud cursor-pointer select-none border-none outline-none flex items-center justify-center gap-2"
              >
                Explore AI Projects <ArrowRight size={14} />
              </motion.button>
              
              <motion.button
                onClick={scrollDown}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(224, 216, 200, 0.15)", boxShadow: "0 0 20px rgba(224, 216, 200, 0.25)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-[18px] text-xs font-heading font-black tracking-widest uppercase border-2 border-[#E0D8C8] text-[#E0D8C8] bg-transparent transition-all duration-300 cursor-pointer select-none outline-none flex items-center justify-center"
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>

          {/* Right Side: Features Cards list */}
          <div className="space-y-4 max-w-md lg:ml-auto w-full">
            {[
              {
                title: "AI Recommendations",
                desc: "Custom scopes matching active skills and interest calibration metrics.",
                icon: "🤖"
              },
              {
                title: "Project Roadmaps",
                desc: "Detailed modular progress markers structured for staging runs.",
                icon: "🗺️"
              },
              {
                title: "Career Guidance",
                desc: "Technical stacks optimized for high-contrast portfolio display.",
                icon: "💼"
              }
            ].map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30, filter: "blur(5px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: idx * 0.12, ease: "easeOut" }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass-card p-5 border border-border/80 bg-gradient-to-r from-card/85 via-card/90 to-card shadow-warm rounded-[18px] flex items-start gap-4 transition duration-300 relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center border border-secondary/30 shrink-0 text-lg">
                  {card.icon}
                </div>
                
                <div className="space-y-1 text-left relative z-10 flex-1">
                  <h4 className="font-heading font-black text-md text-text uppercase tracking-wide group-hover:text-secondary transition duration-200">
                    {card.title}
                  </h4>
                  <p className="text-[11px] text-muted leading-relaxed font-sans font-medium">
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* How It Works Section (Vinewood Sunset Backdrop) */}
      <section id="how-it-works" className="min-h-screen w-full relative overflow-hidden flex flex-col justify-center items-center py-24 z-20 font-sans border-y border-border text-center">
        {/* Background zoom container */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <motion.img 
            initial={{ scale: 1.04, opacity: 0.3 }}
            whileInView={{ scale: 1.01, opacity: 0.55 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            src="/gta_vinewood.jpg" 
            alt="Vinewood Hills Sunset" 
            className="w-full h-full object-cover animate-cinematic-vinewood select-none"
            loading="lazy"
          />
          {/* Layer 1: Dark overlay */}
          <div className="absolute inset-0 bg-black/55" />
          
          {/* Layer 2: Sunset orange tint */}
          <div className="absolute inset-0 bg-gradient-to-tr from-accent-orange/15 via-transparent to-accent-orange/10 mix-blend-color-burn" />
          
          {/* Layer 3: Vignette & Radial shadows */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_20%,rgba(0,0,0,0.7)_100%)]" />

          {/* Clouds */}
          <div className="absolute top-[10%] left-0 w-72 h-10 bg-white/5 blur-3xl rounded-full animate-cloud-slow" />
        </div>

        {/* Contents Container */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[18px] border border-secondary/30 bg-black/45 backdrop-blur-sm text-[9px] font-bold uppercase tracking-widest text-secondary shadow-hud mx-auto">
              🎬 MISSION PROTOCOL
            </div>
            <h2 className="font-heading text-title md:text-6xl font-black text-text uppercase tracking-wide drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]">
              How It Works
            </h2>
            <p className="text-sm text-muted max-w-md mx-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              From zero to developer prompts in six easy steps.
            </p>
          </div>

          {/* Timeline block */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="relative border-l-2 border-secondary/30 ml-4 md:ml-32 pl-8 space-y-12 text-left"
          >
            {steps.map((step, idx) => (
              <motion.div key={idx} variants={fadeUp} className="relative group">
                {/* Point Node */}
                <div className="absolute left-[-42px] top-1 w-6 h-6 rounded-full bg-card border-2 border-secondary flex items-center justify-center group-hover:border-accent-orange transition duration-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary group-hover:bg-accent-orange transition"></span>
                </div>
                
                <span className="absolute left-[-160px] top-1 text-xs font-heading font-black tracking-widest text-muted hidden md:block w-28 text-right">
                  STEP 0{idx + 1}
                </span>
                
                <div>
                  <h4 className="font-heading font-black text-lg text-text group-hover:text-secondary transition duration-200 uppercase tracking-wide">
                    {step}
                  </h4>
                  <p className="text-xs text-muted mt-1 leading-relaxed font-sans">
                    Automatically mapped and stored inside your cloud sync history vault.
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Carousel (GTA Character Style Quote Cards) */}
      <section className="max-w-4xl mx-auto px-6 py-20 relative z-20">
        <div className="glass-card rounded-[18px] p-8 border border-border shadow-warm bg-card/90 relative overflow-hidden min-h-[220px] flex flex-col justify-between">
          <div className="absolute top-4 right-6 text-secondary opacity-25">
            <Star size={40} className="fill-current" />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                <p className="text-sm md:text-md italic font-sans text-text leading-relaxed px-4">
                  "{testimonials[activeTestimonial].quote}"
                </p>
                <div className="mt-4">
                  <h4 className="font-heading font-black text-secondary tracking-wider text-base uppercase">
                    {testimonials[activeTestimonial].name}
                  </h4>
                  <span className="text-[10px] uppercase tracking-widest text-muted font-bold block">
                    {testimonials[activeTestimonial].role}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          {/* Indicator Dots */}
          <div className="flex justify-center gap-1.5 mt-4">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-colors duration-300 ${
                  activeTestimonial === i ? 'bg-secondary' : 'bg-border'
                }`}
              />
            ))}
          </div>
        </div>
      </section>



      {/* Los Santos Skyline Footer Vector */}
      <footer className="w-full relative z-20 pointer-events-none mt-12 text-[#C49A4A]/10 dark:text-[#18230D]/20 border-t border-border bg-card/40 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-heading font-black text-sm tracking-wider uppercase text-muted">
            PROJECTPILOT © {new Date().getFullYear()}
          </span>
          <span className="text-[10px] font-bold tracking-[0.25em] text-accent-orange font-sans uppercase">
            Los Santos HQ
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden opacity-30 select-none">
          <svg className="w-full h-full min-w-[1200px]" viewBox="0 0 1200 100" preserveAspectRatio="none" fill="currentColor">
            <path d="M 0 100 L 0 80 L 15 80 L 15 90 L 30 90 L 30 70 L 45 70 L 45 85 L 60 85 L 60 60 L 80 60 L 80 100 L 120 100 L 120 75 L 140 75 L 140 90 L 160 90 L 160 50 L 190 50 L 190 100 L 220 100 L 220 85 L 240 85 L 240 70 L 270 70 L 270 100 L 310 100 L 310 55 L 340 55 L 340 100 L 400 100 L 400 65 L 430 65 L 430 80 L 450 80 L 450 100 L 500 100 L 500 45 L 530 45 L 530 100 L 600 100 L 600 70 L 620 70 L 620 90 L 650 90 L 650 40 L 680 40 L 680 100 L 750 100 L 750 60 L 780 60 L 780 100 L 850 100 L 850 50 L 880 50 L 880 75 L 900 75 L 900 100 L 980 100 L 980 65 L 1020 65 L 1020 80 L 1050 80 L 1050 100 L 1120 100 L 1120 55 L 1150 55 L 1150 100 L 1200 100 Z" />
          </svg>
        </div>
      </footer>

    </div>
  );
}
