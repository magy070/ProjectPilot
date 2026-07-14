import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Terminal, Sparkles, Plus, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function AuthPages() {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'login' ? 'login' : 'register';

  // Form Fields State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [skills, setSkills] = useState(['React', 'Node.js']);
  const [interests, setInterests] = useState([]);
  
  // Custom skills / interest inputs
  const [skillInput, setSkillInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Suggested tags
  const suggestedSkills = ['React', 'Node.js', 'Python', 'Solidity', 'WebSockets', 'Docker', 'Git', 'AWS'];
  const suggestedInterests = ['Web Dev', 'AI/ML', 'Blockchain', 'IoT', 'Cybersecurity', 'Cloud'];

  // Redirect if logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Pre-fill interests from query param
  useEffect(() => {
    const domainParam = searchParams.get('domain');
    if (domainParam) {
      setInterests([domainParam]);
    }
  }, [searchParams]);

  const handleTabChange = (tab) => {
    navigate(`/auth?tab=${tab}`);
    setErrorMsg('');
  };

  const handleAddSkill = (skill) => {
    if (skill.trim() && !skills.includes(skill.trim())) {
      setSkills([...skills, skill.trim()]);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleToggleInterest = (interest) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (activeTab === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password, skills, interests);
      }
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#111111] min-h-screen text-white flex items-center justify-center p-4 relative overflow-hidden font-sans select-none">
      
      {/* Background container with overlays & slow cinematic zoom */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <img 
          src="/gta_sunset.jpg" 
          alt="Los Santos Sunset" 
          className="w-full h-full object-cover select-none animate-cinematic-login"
          loading="lazy"
        />
        {/* Overlay 1: Black 45% opacity */}
        <div className="absolute inset-0 bg-black/45" />
        
        {/* Overlay 2: Warm orange gradient Bottom -> Top */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F28C28]/15 via-transparent to-transparent z-10" />

        {/* Clouds */}
        <div className="absolute top-[12%] right-[-10%] w-96 h-14 bg-white/5 blur-3xl rounded-full animate-cloud-slow" />
        <div className="absolute top-[30%] left-[-10%] w-80 h-12 bg-white/3 blur-3xl rounded-full animate-cloud-fast" style={{ animationDelay: '6s' }} />

        {/* Flying helicopter silhouette */}
        <div className="absolute top-[18%] left-[22%] opacity-35 scale-75 animate-helicopter-fly">
          <svg className="w-16 h-12 text-black" viewBox="0 0 100 100" fill="currentColor">
            <path d="M70,45 C65,45 50,47 45,49 C40,49 20,47 15,50 C10,52 8,57 10,60 C12,63 20,63 25,62 C30,62 35,60 40,60 C48,60 55,62 60,61 C65,60 70,55 70,50 Z" />
            <line x1="20" y1="46" x2="60" y2="46" stroke="black" strokeWidth="2" />
            <line x1="40" y1="42" x2="40" y2="46" stroke="black" strokeWidth="2" />
          </svg>
        </div>

        {/* Soft lens flare */}
        <div className="absolute top-[28%] left-[30%] w-2 h-2 bg-secondary/25 rounded-full animate-pulse" />
        
        {/* Floating dust particles */}
        <div className="absolute bottom-[35%] right-[25%] w-1.5 h-1.5 bg-white/30 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
        <div className="absolute top-[45%] left-[45%] w-1 h-1 bg-secondary/40 rounded-full animate-pulse" />
      </div>

      {/* Main Split Layout Grid */}
      <div className="relative z-10 w-full min-h-screen flex flex-col lg:flex-row max-w-7xl mx-auto px-4 lg:px-12 items-center justify-center gap-12 py-12">
        
        {/* Left Side: Branding (55% width, hidden on tablet and mobile) */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex flex-col flex-[1.1] text-left space-y-6 max-w-xl"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-heading font-black tracking-widest text-[#BDBDBD] uppercase block">Welcome to</span>
            <h1 className="font-heading text-6xl xl:text-8xl font-black text-white leading-[0.9] uppercase tracking-wide drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
              PROJECTPILOT
            </h1>
            <div className="text-xl font-sans italic tracking-wide text-secondary/90 font-medium">
              Build Bigger. Build Smarter.
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[18px] border border-secondary/35 bg-black/45 backdrop-blur-sm text-[9px] font-bold uppercase tracking-widest text-secondary shadow-hud mr-auto animate-pulse">
            ✦ LOS SANTOS TECH HQ ✦
          </div>

          <p className="text-xs sm:text-sm text-[#BDBDBD] leading-relaxed font-sans drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            Turn ambitious ideas into production-ready projects with AI powered roadmaps, intelligent recommendations, and curated learning paths.
          </p>

          {/* Feature Highlights */}
          <div className="space-y-4 pt-4 border-t border-[#2D2D2D]">
            {[
              { title: "AI Powered Recommendations", desc: "Feasibility matching metrics" },
              { title: "Project Roadmaps", desc: "Modular progress timeline tags" },
              { title: "Portfolio Ready Projects", desc: "High resume value configurations" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + idx * 0.15, duration: 0.5 }}
                className="flex items-center gap-3 text-white"
              >
                <div className="w-8.5 h-8.5 rounded-xl bg-secondary/15 flex items-center justify-center border border-secondary/35 text-secondary">
                  <Check size={15} />
                </div>
                <div className="text-left leading-tight">
                  <span className="uppercase tracking-wider font-heading font-black text-sm block">{item.title}</span>
                  <span className="text-[10px] text-muted font-sans font-medium">{item.desc}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Side: Floating Login Card (45% width, centered on mobile) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex-[0.9] max-w-md flex justify-center items-center relative"
        >
          {/* Overlay 3: Radial glow behind the login card */}
          <div className="absolute -inset-10 bg-[radial-gradient(circle_at_center,rgba(196,154,74,0.12)_0%,transparent_60%)] pointer-events-none z-0" />
          
          {/* Glass Card */}
          <div className="w-full bg-[#0F0F0F]/85 backdrop-blur-[20px] border border-[#C9952F]/40 shadow-[0_0_40px_rgba(196,154,74,0.15)] p-8 rounded-[24px] z-10 relative overflow-hidden text-center flex flex-col justify-center">
            
            {/* Top Logo Emblem */}
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#C9952F]/20 to-[#F28C28]/20 border border-secondary/30 flex items-center justify-center text-secondary font-heading font-black text-xl shadow-hud animate-pulse">
                V
              </div>
            </div>

            <h2 className="font-heading text-2xl md:text-3xl font-black text-white tracking-wide uppercase">
              {activeTab === 'login' ? 'LOG IN TO YOUR ACCOUNT' : 'CREATE YOUR ACCOUNT'}
            </h2>
            <p className="text-xs text-[#BDBDBD] mt-2 font-sans mb-8">
              {activeTab === 'login' 
                ? 'Access your dashboard and continue building legendary projects.' 
                : 'Initialize your profile and start building legendary projects.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5 text-left">
              <AnimatePresence mode="wait">
                {errorMsg && (
                  <motion.div 
                    key="error"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="p-4 bg-danger/10 border border-danger/30 text-danger text-xs rounded-xl flex items-start gap-2.5 animate-shake"
                  >
                    <Terminal size={15} className="shrink-0 mt-0.5" />
                    <span className="font-bold tracking-wide font-sans">{errorMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {activeTab === 'register' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#BDBDBD] uppercase tracking-widest block pl-1">Full Developer Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#BDBDBD]" size={16} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Carl Johnson"
                      className="w-full bg-[#171717] border border-[#2D2D2D] rounded-[16px] pl-11 pr-4 py-3.5 text-xs text-white placeholder-[#555555] outline-none focus:border-[#F28C28] focus:shadow-[0_0_15px_rgba(196,154,74,0.15)] transition duration-200"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#BDBDBD] uppercase tracking-widest block pl-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#BDBDBD]" size={16} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. cj@grovestreet.com"
                    className="w-full bg-[#171717] border border-[#2D2D2D] rounded-[16px] pl-11 pr-4 py-3.5 text-xs text-white placeholder-[#555555] outline-none focus:border-[#F28C28] focus:shadow-[0_0_15px_rgba(196,154,74,0.15)] transition duration-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#BDBDBD] uppercase tracking-widest block pl-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#BDBDBD]" size={16} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#171717] border border-[#2D2D2D] rounded-[16px] pl-11 pr-12 py-3.5 text-xs text-white placeholder-[#555555] outline-none focus:border-[#F28C28] focus:shadow-[0_0_15px_rgba(196,154,74,0.15)] transition duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#BDBDBD] hover:text-white transition cursor-pointer bg-transparent border-none outline-none"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Custom Register setup fields */}
              {activeTab === 'register' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 pt-4 border-t border-[#2D2D2D]"
                >
                  {/* Skill selectors */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#BDBDBD] uppercase tracking-widest block pl-1">Configure Tech Skill Stack</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        placeholder="Type custom skill..."
                        className="flex-1 bg-[#171717] border border-[#2D2D2D] rounded-[16px] px-4 py-2.5 text-xs text-white outline-none focus:border-[#F28C28]"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSkill(skillInput);
                          }
                        }}
                      />
                      <button 
                        type="button"
                        onClick={() => handleAddSkill(skillInput)} 
                        className="px-4 py-2 text-xs font-semibold rounded-[16px] bg-[#171717] border border-[#2D2D2D] hover:bg-secondary/10 hover:text-white transition"
                      >
                        Add
                      </button>
                    </div>
                    {/* List active skills */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {skills.map((skill, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 bg-[#C9952F]/10 text-secondary border border-secondary/20 px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                          {skill}
                          <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-danger font-bold ml-1 cursor-pointer">×</button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Interest domains selector */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#BDBDBD] uppercase tracking-widest block pl-1">Select Target Domains</label>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestedInterests.map((interest, idx) => {
                        const selected = interests.includes(interest);
                        return (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => handleToggleInterest(interest)}
                            className={`text-[10px] font-heading font-black tracking-wider uppercase px-3 py-1.5 rounded-xl border transition-all ${
                              selected 
                                ? 'bg-secondary border-secondary text-white shadow-hud' 
                                : 'bg-[#171717] border-[#2D2D2D] text-[#BDBDBD] hover:text-white'
                            }`}
                          >
                            {interest}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Remember Me / Forgot Password (Login tab only) */}
              {activeTab === 'login' && (
                <div className="flex items-center justify-between text-xs font-sans font-medium text-[#BDBDBD]">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded bg-[#171717] border border-[#2D2D2D] accent-[#F28C28] text-white focus:outline-none" 
                    />
                    <span>Remember me</span>
                  </label>
                  <a href="#" className="text-[#F28C28] hover:underline hover:text-secondary transition">
                    Forgot Password?
                  </a>
                </div>
              )}

              {/* Login Button with loading state and glow */}
              <div className="pt-2">
                <motion.button 
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.025, boxShadow: "0 0 25px rgba(196, 154, 74, 0.55)" }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 rounded-[16px] font-sans font-semibold tracking-wider text-xs uppercase text-white bg-gradient-to-r from-[#C9952F] to-[#F28C28] hover:brightness-110 shadow-hud cursor-pointer select-none border-none outline-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                        className="inline-block w-4.5 h-4.5 border-2 border-white/40 border-t-white rounded-full"
                      />
                      <span>{activeTab === 'login' ? 'Logging In...' : 'Registering...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{activeTab === 'login' ? 'LOG IN' : 'REGISTER'}</span>
                      <Sparkles size={14} className="animate-pulse" />
                    </>
                  )}
                </motion.button>
              </div>
            </form>

            {/* Bottom Divider and redirect link */}
            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-[#2D2D2D]"></div>
              <span className="flex-shrink mx-4 text-[10px] text-[#555555] uppercase tracking-widest font-heading font-black">OR</span>
              <div className="flex-grow border-t border-[#2D2D2D]"></div>
            </div>

            <p className="text-xs text-[#BDBDBD] font-sans font-medium">
              {activeTab === 'login' ? (
                <>
                  New to ProjectPilot?{' '}
                  <button 
                    onClick={() => handleTabChange('register')} 
                    className="text-[#F28C28] hover:text-secondary font-bold bg-transparent border-none cursor-pointer transition-colors relative group py-0.5 pl-1"
                  >
                    Create an account
                    <span className="absolute bottom-0 left-1 right-0 h-[1.5px] bg-[#F28C28] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </button>
                </>
              ) : (
                <>
                  Already registered in the vault?{' '}
                  <button 
                    onClick={() => handleTabChange('login')} 
                    className="text-[#F28C28] hover:text-secondary font-bold bg-transparent border-none cursor-pointer transition-colors relative group py-0.5 pl-1"
                  >
                    Sign in here
                    <span className="absolute bottom-0 left-1 right-0 h-[1.5px] bg-[#F28C28] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </button>
                </>
              )}
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
