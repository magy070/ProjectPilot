import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useQueryClient } from '@tanstack/react-query';
import { User, Shield, Terminal, CheckCircle2 } from 'lucide-react';
import Card from '../components/Card.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const queryClient = useQueryClient();

  const [name, setName] = useState(user?.name || '');
  const [skills, setSkills] = useState(user?.skills || []);
  const [interests, setInterests] = useState(user?.interests || []);

  const [skillInput, setSkillInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const suggestedSkills = ['React', 'Node.js', 'Python', 'Solidity', 'WebSockets', 'Mongoose', 'Docker', 'Git', 'AWS', 'TensorFlow', 'PostgreSQL', 'GraphQL'];
  const suggestedInterests = ['Web Dev', 'AI/ML', 'Blockchain', 'IoT', 'Cybersecurity', 'Cloud'];

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
    setLoading(true);
    setSaveSuccess(false);
    try {
      await updateProfile(name, skills, interests);
      // Invalidate queries so recommendations update
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Failed to save profile details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen text-text py-12 relative overflow-hidden font-sans">
      <div className="max-w-3xl mx-auto px-6 relative z-10 space-y-6">
        
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-muted bg-clip-text text-transparent">
            My Developer Profile
          </h1>
          <p className="text-sm text-muted mt-1">
            Configure your technical expertise and interest parameters to tailor the AI recommendations engine.
          </p>
        </div>

        <Card className="border border-white/5 bg-white/2 p-8">
          <form onSubmit={handleSave} className="space-y-6">
            
            {saveSuccess && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2.5">
                <CheckCircle2 size={16} />
                <span>Profile updated successfully! Feasibility scores have been re-calibrated.</span>
              </div>
            )}

            {/* Email (Read Only) */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted">Email Address (Primary)</label>
              <div className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-muted/60 select-none">
                {user?.email}
              </div>
            </div>

            {/* Name Input */}
            <Input
              label="Full Name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              required
            />

            {/* Skills selection */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div>
                <label className="text-sm font-medium text-muted block mb-2">My Skill Stack</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Add custom skill (e.g. Python)"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill(skillInput);
                      }
                    }}
                  />
                  <Button variant="secondary" onClick={() => handleAddSkill(skillInput)}>
                    Add Skill
                  </Button>
                </div>

                {/* Skill Badge Lists */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-xl text-xs select-none"
                    >
                      {skill}
                      <button type="button" className="hover:text-rose-400 font-bold" onClick={() => handleRemoveSkill(skill)}>
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="mt-3 text-xs text-muted flex flex-wrap gap-1.5 items-center bg-black/20 p-3 rounded-lg border border-white/5">
                  <span className="font-semibold text-white mr-1 text-[10px] uppercase">Suggestions:</span>
                  {suggestedSkills.filter(s => !skills.includes(s)).slice(0, 8).map((s, idx) => (
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
            </div>

            {/* Interest categories */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div>
                <label className="text-sm font-medium text-muted block mb-3">Domains of Interest</label>
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

            {/* Submit */}
            <Button type="submit" variant="glow" className="w-full py-3 pt-4" disabled={loading}>
              {loading ? 'Saving Changes...' : 'Save Profile Configs'}
            </Button>

          </form>
        </Card>

      </div>
    </div>
  );
}
