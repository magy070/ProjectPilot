import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Terminal, Sparkles, Plus, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import Card from '../components/Card.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import Logo from '../components/Logo.jsx';

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
    <div className="bg-background min-h-screen text-text flex items-center justify-center p-6 relative overflow-hidden font-sans transition-colors duration-300">
      
      {/* Floating Streetlight Particles & Night Vignette */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-black/30" />
        
        {/* Animated glowing orbs representing Los Santos neon lights */}
        <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] rounded-full bg-accent-orange/5 blur-[100px] animate-light-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[120px] animate-light-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Floating particles */}
        <div className="absolute top-[30%] left-[40%] w-1.5 h-1.5 bg-secondary rounded-full animate-pulse opacity-40" />
        <div className="absolute bottom-[35%] right-[30%] w-2 h-2 bg-accent-orange rounded-full animate-pulse opacity-40" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 35, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl z-10 py-8"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-4">
            <Logo size="lg" showText={false} />
          </div>
          <h2 className="font-heading text-title md:text-5xl font-black text-text uppercase tracking-wide">
            WELCOME TO LOS SANTOS HQ
          </h2>
          <p className="text-xs text-muted font-bold tracking-widest uppercase mt-1">
            PROJECTPILOT DEV TERMINAL
          </p>
        </div>

        <Card className="border border-border shadow-hud p-8 bg-card rounded-[18px]">
          {/* Tab Selector with spring slide tracking */}
          <div className="flex bg-black/10 dark:bg-black/20 p-1.5 rounded-[18px] border border-border mb-8 relative">
            <button
              onClick={() => handleTabChange('login')}
              className={`flex-1 py-3 text-center text-xs font-heading font-black tracking-wider uppercase rounded-xl transition duration-200 z-10 select-none cursor-pointer ${
                activeTab === 'login' ? 'text-white' : 'text-muted hover:text-text'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => handleTabChange('register')}
              className={`flex-1 py-3 text-center text-xs font-heading font-black tracking-wider uppercase rounded-xl transition duration-200 z-10 select-none cursor-pointer ${
                activeTab === 'register' ? 'text-white' : 'text-muted hover:text-text'
              }`}
            >
              Register Account
            </button>
            {/* Sliding backdrop */}
            <motion.div
              layoutId="auth-tab-active"
              className="absolute top-1.5 bottom-1.5 left-1.5 bg-gradient-to-r from-primary to-accent-green rounded-xl z-0"
              style={{
                width: 'calc(50% - 12px)',
                x: activeTab === 'login' ? '0%' : '100%',
              }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            />
          </div>

          {/* Authentication forms */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <Input
                label="Full Developer Name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Carl Johnson"
                required
              />
            )}

            <Input
              label="Secure Email Address"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. cj@grovestreet.com"
              required
            />

            <Input
              label="Access Code (Password)"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {/* Custom Register setup fields */}
            {activeTab === 'register' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="space-y-6 pt-4 border-t border-border"
              >
                {/* Skill selectors */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-widest block">Configure Tech Skill Stack</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="Type custom skill..."
                      className="flex-1 bg-black/10 dark:bg-black/25 border border-border rounded-[18px] px-4 py-2.5 text-xs text-text outline-none focus:border-secondary"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill(skillInput);
                        }
                      }}
                    />
                    <Button variant="secondary" onClick={() => handleAddSkill(skillInput)} className="px-4 py-2 text-xs">
                      Add
                    </Button>
                  </div>
                  {/* List active skills */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {skills.map((skill, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 bg-primary/10 text-accent-green border border-accent-green/20 px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                        {skill}
                        <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-danger font-bold ml-1 cursor-pointer">×</button>
                      </span>
                    ))}
                  </div>
                  {/* Suggestions list */}
                  <div className="mt-2 text-[9px] text-muted flex flex-wrap gap-1.5 items-center">
                    <span className="font-semibold uppercase tracking-wider">Suggested:</span>
                    {suggestedSkills.filter(s => !skills.includes(s)).slice(0, 5).map((s, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => handleAddSkill(s)}
                        className="hover:text-secondary underline cursor-pointer"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interest domains selector */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-widest block">Select Target Domains</label>
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
                              : 'bg-black/10 dark:bg-black/25 border-border text-muted hover:text-text'
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

            <div className="pt-2">
              <Button type="submit" variant="glow" className="w-full py-3 flex items-center justify-center gap-2" disabled={loading}>
                {loading ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    className="inline-block w-4.5 h-4.5 border-2 border-white/40 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    {activeTab === 'login' ? 'SIGN IN DEPLOYMENT' : 'INITIALIZE ACCOUNT'}
                    <Sparkles size={14} className="animate-pulse" />
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Footer controls redirection text */}
          <p className="mt-8 text-center text-xs text-muted font-sans font-medium">
            {activeTab === 'login' ? (
              <>
                Need to create a new profile?{' '}
                <button 
                  onClick={() => handleTabChange('register')} 
                  className="text-secondary hover:text-accent-orange font-bold hover:underline bg-transparent border-none cursor-pointer transition-colors"
                >
                  Register here
                </button>
              </>
            ) : (
              <>
                Already registered in the vault?{' '}
                <button 
                  onClick={() => handleTabChange('login')} 
                  className="text-secondary hover:text-accent-orange font-bold hover:underline bg-transparent border-none cursor-pointer transition-colors"
                >
                  Sign in here
                </button>
              </>
            )}
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
