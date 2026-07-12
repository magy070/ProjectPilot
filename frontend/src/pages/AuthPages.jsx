import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Sparkles, Terminal, CheckCircle2, Lock, Mail, User } from 'lucide-react';
import Card from '../components/Card.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import Badge from '../components/Badge.jsx';

export default function AuthPages() {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'login' ? 'login' : 'register';

  // State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [skills, setSkills] = useState(['React', 'Node.js']);
  const [interests, setInterests] = useState([]);
  
  // Custom skills / interest inputs
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Suggested values
  const suggestedSkills = ['React', 'Node.js', 'Python', 'Solidity', 'WebSockets', 'Mongoose', 'Docker', 'Git', 'AWS'];
  const suggestedInterests = ['Web Dev', 'AI/ML', 'Blockchain', 'IoT', 'Cybersecurity', 'Cloud'];

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Pre-fill landing page configurations
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
    <div className="bg-background min-h-screen text-text flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Decorative Blur Background Blobs */}
      <div className="absolute top-[10%] left-[-15%] w-[450px] h-[450px] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-15%] w-[450px] h-[450px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-xl z-10 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary items-center justify-center shadow-lg shadow-primary/20 mb-4">
            <span className="font-extrabold text-white text-xl">P</span>
          </div>
          <h2 className="text-title font-extrabold bg-gradient-to-b from-white to-muted bg-clip-text text-transparent">
            Welcome to ProjectPilot
          </h2>
          <p className="text-sm text-muted mt-1">
            Analyze tech designs, generate synopses, and build roadmap schedules.
          </p>
        </div>

        <Card className="border border-white/10 shadow-2xl p-8">
          {/* Tab Selector */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 mb-6">
            <button
              onClick={() => handleTabChange('login')}
              className={`flex-1 py-2 text-center text-sm font-medium rounded-lg transition duration-200 ${
                activeTab === 'login' ? 'bg-primary text-white shadow-md' : 'text-muted hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => handleTabChange('register')}
              className={`flex-1 py-2 text-center text-sm font-medium rounded-lg transition duration-200 ${
                activeTab === 'register' ? 'bg-primary text-white shadow-md' : 'text-muted hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-start gap-2.5">
                <Terminal size={14} className="shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {activeTab === 'register' && (
              <Input
                label="Full Name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Mercer"
                required
              />
            )}

            <Input
              label="Email Address"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              required
            />

            <Input
              label="Password"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {/* Custom Register Fields (Skills & Interests tags) */}
            {activeTab === 'register' && (
              <div className="space-y-4 pt-2 border-t border-white/5">
                {/* Skills tags */}
                <div>
                  <label className="text-sm font-medium text-muted block mb-2">My Skills Set</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="Add skill (e.g. Python)"
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill(skillInput);
                        }
                      }}
                    />
                    <Button variant="secondary" className="px-3 py-2 text-xs" onClick={() => handleAddSkill(skillInput)}>
                      Add
                    </Button>
                  </div>
                  {/* Skill Badge Lists */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded text-xs select-none"
                      >
                        {skill}
                        <button type="button" className="hover:text-rose-400 font-bold" onClick={() => handleRemoveSkill(skill)}>
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 text-[10px] text-muted flex flex-wrap gap-1 items-center">
                    <span>Suggestions:</span>
                    {suggestedSkills.filter(s => !skills.includes(s)).slice(0, 5).map((s, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => handleAddSkill(s)}
                        className="hover:text-white underline cursor-pointer"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interest tags */}
                <div>
                  <label className="text-sm font-medium text-muted block mb-2">Interested Domains</label>
                  <div className="flex flex-wrap gap-2">
                    {suggestedInterests.map((interest, idx) => {
                      const selected = interests.includes(interest);
                      return (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => handleToggleInterest(interest)}
                          className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                            selected
                              ? 'bg-secondary border-secondary text-white'
                              : 'bg-white/5 border-white/10 text-muted hover:text-white hover:border-white/20'
                          }`}
                        >
                          {interest}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <Button type="submit" variant="glow" className="w-full py-3 mt-4" disabled={loading}>
              {loading ? 'Authenticating...' : activeTab === 'login' ? 'Sign In' : 'Register Account'}
            </Button>
          </form>

          {/* Switch Footer text */}
          <p className="mt-6 text-center text-xs text-muted">
            {activeTab === 'login' ? (
              <>
                Don't have an account?{' '}
                <button onClick={() => handleTabChange('register')} className="text-primary hover:underline font-semibold bg-transparent border-none">
                  Register here
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button onClick={() => handleTabChange('login')} className="text-primary hover:underline font-semibold bg-transparent border-none">
                  Sign in here
                </button>
              </>
            )}
          </p>
        </Card>
      </div>
    </div>
  );
}
