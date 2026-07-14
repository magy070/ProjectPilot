import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Bookmark, ArrowRight, BarChart2, Settings, Code, Zap, Search, HelpCircle, Layers } from 'lucide-react';
import { api } from '../context/AuthContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import Badge from '../components/Badge.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Project filtering local state
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [compareList, setCompareList] = useState([]); // selected project objects
  const [isBrainstorming, setIsBrainstorming] = useState(false);

  // 1. Fetch Stats
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const res = await api.get('/api/dashboard/stats');
      return res.data.stats;
    }
  });

  // 2. Fetch Personalized Recommendations
  const { data: recommendationsData, isLoading: recsLoading } = useQuery({
    queryKey: ['recommendations'],
    queryFn: async () => {
      const res = await api.get('/api/projects/recommendations');
      return res.data.projects;
    }
  });

  // 3. Fetch Bookmarked projects
  const { data: savedData } = useQuery({
    queryKey: ['savedProjects'],
    queryFn: async () => {
      const res = await api.get('/api/saved-projects');
      return res.data.projects;
    }
  });

  // Toggle bookmark mutation
  const toggleBookmarkMutation = useMutation({
    mutationFn: async (projectId) => {
      const res = await api.post(`/api/saved-projects/${projectId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedProjects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    }
  });

  const handleToggleBookmark = (projectId) => {
    toggleBookmarkMutation.mutate(projectId);
  };

  const isBookmarked = (projectId) => {
    return savedData?.some(p => p._id === projectId) || false;
  };

  const handleToggleCompare = (project) => {
    const isSelected = compareList.some(p => p._id === project._id);
    if (isSelected) {
      setCompareList(compareList.filter(p => p._id !== project._id));
    } else {
      if (compareList.length >= 3) {
        alert('You can compare a maximum of 3 projects side-by-side.');
        return;
      }
      setCompareList([...compareList, project]);
    }
  };

  const handleTriggerCompare = () => {
    if (compareList.length < 2) return;
    const ids = compareList.map(p => p._id).join(',');
    navigate(`/compare?ids=${ids}`);
  };

  // Brainstorm mutation to regenerate suggestions
  const brainstormMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/api/projects/generate', {
        domain: selectedDomain || undefined,
        difficulty: selectedDifficulty || undefined
      });
      return res.data;
    },
    onSuccess: () => {
      setIsBrainstorming(false);
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      alert("AI successfully generated 3 new custom projects! Check your feed.");
    },
    onError: (err) => {
      setIsBrainstorming(false);
      alert(err.response?.data?.message || 'Brainstorming failed. Try again.');
    }
  });

  const handleBrainstorm = () => {
    setIsBrainstorming(true);
    brainstormMutation.mutate();
  };

  // Lists
  const domains = ['Web Dev', 'AI/ML', 'Blockchain', 'IoT', 'Cybersecurity', 'Cloud'];

  // Filtering calculation logic
  const filteredProjects = recommendationsData?.filter((proj) => {
    const matchesDomain = !selectedDomain || proj.domain === selectedDomain;
    const matchesDifficulty = !selectedDifficulty || proj.difficulty === selectedDifficulty;
    
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery = !query || 
      proj.name.toLowerCase().includes(query) ||
      proj.description.toLowerCase().includes(query) ||
      proj.requiredSkills.some(skill => skill.toLowerCase().includes(query));

    return matchesDomain && matchesDifficulty && matchesQuery;
  });

  return (
    <div className="bg-background min-h-screen text-text py-12 relative overflow-hidden font-sans transition-colors duration-300">
      
      {/* Decorative Vibe Elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-primary/5 blur-[120px] animate-light-pulse" />
        <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/5 blur-[120px] animate-light-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-10">
        
        {/* Welcome Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="font-heading text-title md:text-5xl font-black text-text uppercase tracking-wide">
              WELCOME BACK, {user?.name || 'CJ'}
            </h1>
            <p className="text-xs text-muted font-bold tracking-wider uppercase mt-1">
              LOS SANTOS OPERATIONS MONITOR
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="secondary" className="px-4 py-2 text-xs" onClick={() => navigate('/profile')}>
              <Settings size={14} /> Edit Skills
            </Button>
            <Button variant="glow" className="px-4 py-2 text-xs" onClick={() => navigate('/saved')}>
              <Bookmark size={14} /> Saved Projects ({statsData?.savedProjects || 0})
            </Button>
          </div>
        </header>

        {/* HUD Stats Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Saved Projects", val: statsData?.savedProjects, color: "text-secondary" },
            { label: "Synopses Generated", val: statsData?.synopsesGenerated, color: "text-accent-orange" },
            { label: "AI Prompts Generated", val: statsData?.promptsGenerated, color: "text-accent-green" },
            { label: "Projects Explored", val: statsData?.projectsExplored, color: "text-success" }
          ].map((stat, i) => (
            <Card key={i} className="border border-border bg-card p-5 text-center flex flex-col justify-center min-h-[110px] rounded-[18px] shadow-warm relative overflow-hidden group">
              {/* Highlight bar mimicking GTA HUD health indicators */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-border group-hover:bg-secondary transition-colors" />
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5">{stat.label}</span>
              {statsLoading ? (
                <div className="h-8 w-12 bg-black/10 dark:bg-white/5 animate-pulse rounded mx-auto mt-1"></div>
              ) : (
                <span className={`text-3xl font-heading font-black tracking-wide ${stat.color}`}>
                  {stat.val || 0}
                </span>
              )}
            </Card>
          ))}
        </section>

        {/* Floating comparison drawer */}
        <AnimatePresence>
          {compareList.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="fixed bottom-6 left-6 right-6 md:left-auto md:right-12 z-50 glass-card p-4 rounded-[18px] border border-secondary shadow-2xl flex flex-col sm:flex-row items-center gap-4 bg-card/95 max-w-xl"
            >
              <div className="text-left shrink-0">
                <span className="text-[9px] uppercase tracking-widest text-muted block font-bold">Lowrider Showdown</span>
                <span className="text-sm font-heading font-black text-text uppercase tracking-wide">
                  {compareList.length} of 3 selected
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 flex-1 justify-center sm:justify-start">
                {compareList.map((p, idx) => (
                  <span key={idx} className="bg-black/10 dark:bg-black/35 border border-border px-3 py-1 rounded-xl text-xs font-bold text-text flex items-center gap-1 select-none">
                    {p.name.slice(0, 15)}...
                    <button className="text-danger font-black hover:text-text cursor-pointer ml-1" onClick={() => handleToggleCompare(p)}>×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="ghost" className="px-3 py-1.5 text-xs text-danger" onClick={() => setCompareList([])}>
                  Reset
                </Button>
                <Button variant="glow" className="px-4 py-2 text-xs" disabled={compareList.length < 2} onClick={handleTriggerCompare}>
                  Compare <BarChart2 size={12} />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard split content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border border-border bg-card p-6 space-y-6 rounded-[18px] shadow-warm relative overflow-hidden">
              <h3 className="font-heading font-black text-sm text-text uppercase tracking-wider border-b border-border pb-3">Search Filters</h3>
              
              {/* Domain filter */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Domain Area</label>
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  className="w-full bg-black/10 dark:bg-black/25 border border-border rounded-[18px] px-3.5 py-3 text-xs text-text focus:outline-none focus:border-secondary cursor-pointer"
                >
                  <option value="" className="bg-card text-text">All Domains</option>
                  {domains.map((d, i) => (
                    <option key={i} value={d} className="bg-card text-text">
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty filter */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Difficulty Level</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full bg-black/10 dark:bg-black/25 border border-border rounded-[18px] px-3.5 py-3 text-xs text-text focus:outline-none focus:border-secondary cursor-pointer"
                >
                  <option value="" className="bg-card text-text">All Difficulties</option>
                  <option value="Beginner" className="bg-card text-text">Beginner</option>
                  <option value="Intermediate" className="bg-card text-text">Intermediate</option>
                  <option value="Advanced" className="bg-card text-text">Advanced</option>
                </select>
              </div>

              {/* Reset button */}
              {(selectedDomain || selectedDifficulty) && (
                <Button variant="secondary" className="w-full py-2 text-xs" onClick={() => { setSelectedDomain(''); setSelectedDifficulty(''); }}>
                  Reset Filters
                </Button>
              )}
            </Card>

            {/* AI Suggestion brainstorm box */}
            <Card className="border border-secondary/30 bg-gradient-to-b from-secondary/5 to-transparent p-6 space-y-4 rounded-[18px]">
              <h3 className="font-heading font-black text-sm text-text flex items-center gap-2 uppercase tracking-wider">
                <Sparkles size={16} className="text-secondary animate-pulse" /> AI Brainstorm
              </h3>
              <p className="text-xs text-muted leading-relaxed font-sans">
                Request three customized proposals matching your active expertise stack and interest categories.
              </p>
              <Button
                variant="glow"
                className="w-full py-2.5 text-xs font-heading font-black tracking-wide"
                onClick={handleBrainstorm}
                disabled={isBrainstorming}
              >
                {isBrainstorming ? 'Brainstorming...' : 'Generate New Proposals'}
              </Button>
            </Card>

            {/* Quick action buttons list */}
            <Card className="border border-border bg-card p-6 space-y-4 rounded-[18px]">
              <h3 className="font-heading font-black text-sm text-text uppercase tracking-wider border-b border-border pb-3">Quick Navigation</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/profile')}
                  className="w-full p-3 rounded-xl border border-border bg-card/60 dark:bg-black/15 hover:bg-secondary/10 text-xs text-left text-muted hover:text-text flex items-center justify-between transition group font-sans font-semibold cursor-pointer"
                >
                  <span className="flex items-center gap-2"><Code size={14} className="text-primary" /> Update My Skill Stack</span>
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition duration-200" />
                </button>
                <button
                  onClick={() => navigate('/saved')}
                  className="w-full p-3 rounded-xl border border-border bg-card/60 dark:bg-black/15 hover:bg-secondary/10 text-xs text-left text-muted hover:text-text flex items-center justify-between transition group font-sans font-semibold cursor-pointer"
                >
                  <span className="flex items-center gap-2"><Bookmark size={14} className="text-accent-orange" /> Saved Bookmarks</span>
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition duration-200" />
                </button>
              </div>
            </Card>
          </div>

          {/* Personalized recommendations feed */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl font-black text-text flex items-center gap-2 uppercase tracking-wide">
                <Layers className="text-secondary" size={18} /> Personalized Project Feed
              </h2>
              <span className="text-xs font-bold text-muted uppercase tracking-wider">
                {filteredProjects?.length || 0} projects locked in
              </span>
            </div>

            {/* Search inputs */}
            <div className="relative group">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects by name, description, or stack..."
                className="w-full bg-card/60 dark:bg-black/20 border border-border rounded-[18px] pl-11 pr-4 py-3.5 text-sm text-text placeholder-muted/60 focus:bg-card focus:border-secondary outline-none transition duration-200 shadow-hud group-hover:border-border/80"
              />
            </div>

            {/* Recommendations loader / cards */}
            {recsLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="glass-card p-6 rounded-[18px] border border-border animate-pulse space-y-4">
                    <div className="h-6 w-1/3 bg-black/10 dark:bg-white/5 rounded-xl"></div>
                    <div className="h-12 w-full bg-black/5 dark:bg-white/5 rounded-xl"></div>
                    <div className="h-4 w-1/2 bg-black/5 dark:bg-white/5 rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : filteredProjects?.length === 0 ? (
              <Card className="border border-border bg-card p-12 text-center text-muted rounded-[18px] shadow-warm">
                <HelpCircle size={32} className="mx-auto text-secondary mb-3 opacity-60" />
                <p className="text-sm font-semibold">No matches found in the Los Santos grid.</p>
                <p className="text-xs text-muted mt-1">Try updating your stack or interest categories.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredProjects?.map((proj) => {
                  const saved = isBookmarked(proj._id);
                  const isSelectedForCompare = compareList.some(p => p._id === proj._id);
                  
                  return (
                    <motion.div
                      key={proj._id}
                      whileHover={{ scale: 1.005, y: -2 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="rounded-[18px] overflow-hidden"
                    >
                      <Card className="border border-border p-6 flex flex-col md:flex-row justify-between gap-6 bg-card hover:border-secondary shadow-warm transition-all duration-300">
                        
                        {/* Info Section */}
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 
                              className="font-heading font-black text-xl text-text hover:text-secondary cursor-pointer transition uppercase tracking-wide" 
                              onClick={() => navigate(`/projects/${proj._id}`)}
                            >
                              {proj.name}
                            </h3>
                            <Badge type="difficulty">{proj.difficulty}</Badge>
                            <span className="text-[10px] font-heading font-black tracking-wider uppercase text-muted border border-border bg-background px-2.5 py-1 rounded-xl select-none">
                              {proj.domain}
                            </span>
                          </div>
                          
                          <p className="text-xs text-muted leading-relaxed font-sans line-clamp-2">
                            {proj.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted font-sans font-medium">
                            <span>Crew Size: <strong className="text-text">{proj.teamSize}</strong></span>
                            <span>Timeline: <strong className="text-text">{proj.estimatedTime}</strong></span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] uppercase font-bold text-muted">Required:</span>
                              {proj.requiredSkills.slice(0, 3).map((s, idx) => (
                                <span key={idx} className="bg-primary/10 px-2 py-0.5 rounded-lg text-accent-green text-[10px] font-semibold border border-accent-green/10">
                                  {s}
                                </span>
                              ))}
                              {proj.requiredSkills.length > 3 && (
                                <span className="text-[10px] text-muted">+{proj.requiredSkills.length - 3} more</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Recommendation indicators & controls */}
                        <div className="flex md:flex-col justify-between items-center md:items-end shrink-0 gap-4 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                          
                          {/* HUD Health Bar styled score */}
                          <div className="text-center md:text-right w-full md:w-auto">
                            <span className="text-[10px] uppercase text-muted font-bold block mb-1">Feasibility Index</span>
                            <div className="flex items-center gap-2">
                              <div className="hidden md:block w-24 h-2 bg-black/10 dark:bg-black/40 rounded-full overflow-hidden border border-border p-0.5">
                                <div 
                                  className={`h-full rounded-full ${
                                    proj.personalizedScore >= 85 
                                      ? 'bg-success' 
                                      : proj.personalizedScore >= 70 
                                      ? 'bg-secondary' 
                                      : 'bg-danger'
                                  }`} 
                                  style={{ width: `${proj.personalizedScore}%` }}
                                />
                              </div>
                              <span className={`text-2xl font-heading font-black tracking-wide ${
                                proj.personalizedScore >= 85 
                                  ? 'text-success' 
                                  : proj.personalizedScore >= 70 
                                  ? 'text-secondary' 
                                  : 'text-danger'
                              }`}>
                                {proj.personalizedScore}%
                              </span>
                            </div>
                          </div>

                          {/* Controls */}
                          <div className="flex items-center gap-2">
                            {/* Compare drawer selector */}
                            <button
                              onClick={() => handleToggleCompare(proj)}
                              title="Compare this project"
                              className={`p-2.5 rounded-xl border transition cursor-pointer ${
                                isSelectedForCompare
                                  ? 'bg-primary/20 border-primary text-primary'
                                  : 'border-border bg-card hover:bg-secondary/15 text-muted hover:text-text'
                              }`}
                            >
                              <BarChart2 size={14} />
                            </button>
                            
                            {/* Bookmark select */}
                            <button
                              onClick={() => handleToggleBookmark(proj._id)}
                              title={saved ? 'Remove saved bookmark' : 'Bookmark this project'}
                              className={`p-2.5 rounded-xl border transition cursor-pointer ${
                                saved
                                  ? 'bg-secondary/20 border-secondary text-secondary'
                                  : 'border-border bg-card hover:bg-secondary/15 text-muted hover:text-text'
                              }`}
                            >
                              <Bookmark size={14} fill={saved ? 'currentColor' : 'none'} />
                            </button>
                            
                            <Button variant="primary" className="px-4 py-2 text-xs gap-1" onClick={() => navigate(`/projects/${proj._id}`)}>
                              View <ArrowRight size={12} />
                            </Button>
                          </div>
                        </div>

                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
