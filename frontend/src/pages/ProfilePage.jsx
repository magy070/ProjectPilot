import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Code, Award, Check } from 'lucide-react';
import { api, useAuth } from '../context/AuthContext.jsx';
import Card from '../components/Card.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // State
  const [name, setName] = useState('');
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Suggested skills / interest domains
  const suggestedSkills = ['React', 'Node.js', 'Python', 'Solidity', 'WebSockets', 'Docker', 'Git', 'AWS', 'Rust', 'TensorFlow', 'PostgreSQL'];
  const suggestedInterests = ['Web Dev', 'AI/ML', 'Blockchain', 'IoT', 'Cybersecurity', 'Cloud'];

  // Fetch Profile data
  const { isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get('/api/users/profile');
      const data = res.data.user;
      setName(data.name || '');
      setSkills(data.skills || []);
      setInterests(data.interests || []);
      return data;
    }
  });

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

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveSuccess(false);
    setLoading(true);

    try {
      await api.put('/api/users/profile', {
        name,
        skills,
        interests
      });
      setSaveSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      alert('Failed to save profile details.');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center animate-pulse space-y-6">
        <div className="h-8 w-1/3 bg-black/10 dark:bg-white/5 rounded-xl mx-auto"></div>
        <div className="h-48 bg-black/10 dark:bg-white/5 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen text-text pt-28 pb-12 relative overflow-hidden font-sans transition-colors duration-300">
      
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-15%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[-15%] w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none"></div>
      </div>

      <div className="max-w-3xl mx-auto px-6 relative z-10 space-y-6">
        
        <div>
          <h1 className="font-heading text-title md:text-5xl font-black text-text uppercase tracking-wide">
            DEVELOPER PROFILE CONFIGS
          </h1>
          <p className="text-xs text-muted font-bold tracking-wider uppercase mt-1">
            LOS SANTOS SKILLS CALIBRATION UNIT
          </p>
        </div>

        <Card className="border border-border bg-card p-8 rounded-[18px] shadow-warm">
          <form onSubmit={handleSave} className="space-y-6">
            
            <AnimatePresence>
              {saveSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-success/10 border border-success/30 text-success text-xs rounded-xl flex items-center gap-2.5 font-bold uppercase tracking-wider shadow-warm"
                >
                  <CheckCircle size={16} />
                  <span>Calibrated! recommendations refreshed in dashboard.</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Address block */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted uppercase tracking-widest block">Primary Email Identification</label>
              <div className="w-full bg-black/10 dark:bg-black/25 border border-border rounded-[18px] px-4 py-3.5 text-xs text-muted font-sans font-bold select-none">
                {user?.email}
              </div>
            </div>

            {/* Name Input */}
            <Input
              label="Developer Alias (Full Name)"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alias"
              required
            />

            {/* Skills setup block */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted uppercase tracking-widest block">Active Skill Stack</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="e.g. SQLite"
                    className="flex-1 bg-black/10 dark:bg-black/25 border border-border rounded-[18px] px-4 py-3.5 text-xs text-text outline-none focus:border-secondary"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill(skillInput);
                      }
                    }}
                  />
                  <Button variant="secondary" onClick={() => handleAddSkill(skillInput)} className="px-5 py-2.5 text-xs">
                    Add Skill
                  </Button>
                </div>

                {/* Badges list */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 bg-primary/10 text-accent-green border border-accent-green/20 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider select-none"
                    >
                      {skill}
                      <button type="button" className="hover:text-danger font-black ml-1 cursor-pointer" onClick={() => handleRemoveSkill(skill)}>
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {/* Suggestions stack */}
                <div className="mt-3 text-[10px] text-muted flex flex-wrap gap-1.5 items-center">
                  <span className="font-semibold uppercase tracking-wider">Suggested Stack:</span>
                  {suggestedSkills.filter(s => !skills.includes(s)).slice(0, 6).map((s, idx) => (
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
            </div>

            {/* Interest categories block */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted uppercase tracking-widest block">Domains of Interest</label>
                <div className="flex flex-wrap gap-2.5">
                  {suggestedInterests.map((interest, idx) => {
                    const selected = interests.includes(interest);
                    return (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => handleToggleInterest(interest)}
                        className={`text-xs px-4 py-2 rounded-xl border transition-all ${
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
            </div>

            {/* Save details */}
            <div className="pt-4">
              <Button type="submit" variant="glow" className="w-full py-3.5 text-center font-heading font-black tracking-wide" disabled={loading}>
                {loading ? 'Saving Calibration...' : 'Calibrate Profile Settings'}
              </Button>
            </div>

          </form>
        </Card>

      </div>
    </div>
  );
}
