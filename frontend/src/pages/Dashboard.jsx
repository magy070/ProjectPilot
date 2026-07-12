import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../context/AuthContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Sparkles, Bookmark, ArrowRight, BarChart2, Plus, Check, Settings, Code, FileText, Zap } from 'lucide-react';
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
  const [compareList, setCompareList] = useState([]); // selected project objects

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

  // 3. Fetch Bookmarked projects (to show bookmark status)
  const { data: savedData } = useQuery({
    queryKey: ['savedProjects'],
    queryFn: async () => {
      const res = await api.get('/api/saved-projects');
      return res.data.projects;
    }
  });

  // Mutation to toggle bookmark
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

  const handleToggleBookmark = (id) => {
    toggleBookmarkMutation.mutate(id);
  };

  const isBookmarked = (id) => {
    return savedData?.some(p => p._id === id) || false;
  };

  // Compare selection management
  const handleToggleCompare = (project) => {
    if (compareList.some(p => p._id === project._id)) {
      setCompareList(compareList.filter(p => p._id !== project._id));
    } else {
      if (compareList.length >= 3) {
        alert("You can compare a maximum of 3 projects side-by-side.");
        return;
      }
      setCompareList([...compareList, project]);
    }
  };

  const handleTriggerCompare = () => {
    if (compareList.length < 2) {
      alert("Please select at least 2 projects to compare.");
      return;
    }
    const ids = compareList.map(p => p._id).join(',');
    navigate(`/compare?ids=${ids}`);
  };

  // Filter projects by domain / difficulty
  const filteredProjects = recommendationsData?.filter(proj => {
    const domainMatch = selectedDomain ? proj.domain === selectedDomain : true;
    const diffMatch = selectedDifficulty ? proj.difficulty === selectedDifficulty : true;
    return domainMatch && diffMatch;
  });

  const domains = ['Web Dev', 'AI/ML', 'Cybersecurity', 'Blockchain', 'IoT', 'Cloud'];

  return (
    <div className="bg-background min-h-screen text-text py-12 relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-10">
        
        {/* Welcome Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-muted bg-clip-text text-transparent">
              Welcome back, {user?.name}
            </h1>
            <p className="text-sm text-muted mt-1">
              Here are your personalized project recommendations based on your profile skills.
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

        {/* Stats Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Saved Projects", val: statsData?.savedProjects, color: "text-primary" },
            { label: "Synopses Generated", val: statsData?.synopsesGenerated, color: "text-secondary" },
            { label: "AI Prompts Generated", val: statsData?.promptsGenerated, color: "text-primary" },
            { label: "Projects Explored", val: statsData?.projectsExplored, color: "text-emerald-400" }
          ].map((stat, i) => (
            <Card key={i} className="border border-white/5 bg-white/2 p-5 text-center flex flex-col justify-center min-h-[110px]">
              <span className="text-xs text-muted font-medium mb-1">{stat.label}</span>
              {statsLoading ? (
                <div className="h-8 w-12 bg-white/5 animate-pulse rounded mx-auto mt-1"></div>
              ) : (
                <span className={`text-2xl md:text-3xl font-extrabold ${stat.color}`}>
                  {stat.val || 0}
                </span>
              )}
            </Card>
          ))}
        </section>

        {/* Comparison floating panel */}
        {compareList.length > 0 && (
          <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-12 z-50 glass-card p-4 rounded-2xl border border-primary/30 shadow-2xl flex flex-col sm:flex-row items-center gap-4 bg-black/80 max-w-xl animate-fade-in">
            <div className="text-left shrink-0">
              <span className="text-xs text-muted block">Project Comparison Drawer</span>
              <span className="text-sm font-semibold text-white">
                {compareList.length} of 3 selected
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 flex-1 justify-center sm:justify-start">
              {compareList.map((p, idx) => (
                <span key={idx} className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-xs flex items-center gap-1 select-none">
                  {p.name.slice(0, 15)}...
                  <button className="text-rose-400 font-bold hover:text-white" onClick={() => handleToggleCompare(p)}>×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="ghost" className="px-3 py-1.5 text-xs text-rose-400" onClick={() => setCompareList([])}>
                Clear
              </Button>
              <Button variant="glow" className="px-4 py-2 text-xs" disabled={compareList.length < 2} onClick={handleTriggerCompare}>
                Compare <BarChart2 size={12} />
              </Button>
            </div>
          </div>
        )}

        {/* Dashboard Content split */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border border-white/5 bg-white/1 p-6 space-y-6">
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">Search Filters</h3>
              
              {/* Domain Filter */}
              <div className="space-y-2">
                <label className="text-xs text-muted font-medium">Domain Area</label>
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50"
                >
                  <option value="" className="bg-[#0e0e11] text-white">All Domains</option>
                  {domains.map((d, i) => (
                    <option key={i} value={d} className="bg-[#0e0e11] text-white">
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div className="space-y-2">
                <label className="text-xs text-muted font-medium">Difficulty Level</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50"
                >
                  <option value="" className="bg-[#0e0e11] text-white">All Difficulties</option>
                  <option value="Beginner" className="bg-[#0e0e11] text-white">Beginner</option>
                  <option value="Intermediate" className="bg-[#0e0e11] text-white">Intermediate</option>
                  <option value="Advanced" className="bg-[#0e0e11] text-white">Advanced</option>
                </select>
              </div>

              {/* Clear filters Button */}
              {(selectedDomain || selectedDifficulty) && (
                <Button variant="secondary" className="w-full py-2 text-xs" onClick={() => { setSelectedDomain(''); setSelectedDifficulty(''); }}>
                  Reset Filters
                </Button>
              )}
            </Card>

            {/* Quick Actions Card */}
            <Card className="border border-white/5 bg-white/1 p-6 space-y-4">
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/profile')}
                  className="w-full p-3 rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 text-xs text-left text-muted hover:text-white flex items-center justify-between transition group"
                >
                  <span className="flex items-center gap-2"><Code size={14} className="text-primary" /> Update My Skill Stack</span>
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition" />
                </button>
                <button
                  onClick={() => navigate('/saved')}
                  className="w-full p-3 rounded-xl border border-white/5 bg-white/2 hover:bg-white/5 text-xs text-left text-muted hover:text-white flex items-center justify-between transition group"
                >
                  <span className="flex items-center gap-2"><Bookmark size={14} className="text-secondary" /> Saved Bookmarks</span>
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition" />
                </button>
              </div>
            </Card>
          </div>

          {/* Recommendations Feed */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Zap className="text-secondary" size={18} /> Personalized Project Feed
              </h2>
              <span className="text-xs text-muted">
                Showing {filteredProjects?.length || 0} projects
              </span>
            </div>

            {recsLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="glass-card p-6 rounded-2xl border border-white/5 animate-pulse space-y-4">
                    <div className="h-6 w-1/3 bg-white/10 rounded"></div>
                    <div className="h-12 w-full bg-white/5 rounded"></div>
                    <div className="h-4 w-1/2 bg-white/5 rounded"></div>
                  </div>
                ))}
              </div>
            ) : filteredProjects?.length === 0 ? (
              <Card className="border border-white/5 bg-white/1 p-12 text-center text-muted">
                No projects matched your active search filters. Try updating your filters or interest options.
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredProjects?.map((proj) => {
                  const saved = isBookmarked(proj._id);
                  const isSelectedForCompare = compareList.some(p => p._id === proj._id);
                  return (
                    <Card key={proj._id} hoverGlow className="border border-white/5 p-6 flex flex-col md:flex-row justify-between gap-6">
                      
                      {/* Left Block: Info */}
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="font-extrabold text-lg text-white hover:text-primary cursor-pointer transition" onClick={() => navigate(`/projects/${proj._id}`)}>
                            {proj.name}
                          </h3>
                          <Badge type="difficulty">{proj.difficulty}</Badge>
                          <span className="text-xs text-muted border border-white/10 bg-white/2 px-2 py-0.5 rounded">
                            {proj.domain}
                          </span>
                        </div>
                        
                        <p className="text-sm text-muted line-clamp-2 leading-relaxed">
                          {proj.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted">
                          <span>Team Size: <strong className="text-white">{proj.teamSize}</strong></span>
                          <span>Timeframe: <strong className="text-white">{proj.estimatedTime}</strong></span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] uppercase font-bold text-muted">Required Skills:</span>
                            {proj.requiredSkills.slice(0, 3).map((s, idx) => (
                              <span key={idx} className="bg-white/5 px-1.5 py-0.5 rounded text-white text-[10px] font-medium border border-white/5">
                                {s}
                              </span>
                            ))}
                            {proj.requiredSkills.length > 3 && (
                              <span className="text-[10px] text-muted">+{proj.requiredSkills.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Block: Score & Actions */}
                      <div className="flex md:flex-col justify-between items-center md:items-end shrink-0 gap-4 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
                        {/* Score Indicator */}
                        <div className="text-center md:text-right">
                          <span className="text-[10px] uppercase text-muted font-bold block mb-1">Feasibility Score</span>
                          <span className={`text-2xl font-black ${
                            proj.personalizedScore >= 85 
                              ? 'text-emerald-400' 
                              : proj.personalizedScore >= 70 
                              ? 'text-amber-400' 
                              : 'text-rose-400'
                          }`}>
                            {proj.personalizedScore}%
                          </span>
                        </div>

                        {/* Button controls */}
                        <div className="flex items-center gap-2">
                          {/* Compare toggle */}
                          <button
                            onClick={() => handleToggleCompare(proj)}
                            title="Select for comparison"
                            className={`p-2 rounded-xl border transition ${
                              isSelectedForCompare
                                ? 'bg-primary/20 border-primary text-primary'
                                : 'border-white/10 hover:border-white/20 text-muted hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <BarChart2 size={16} />
                          </button>
                          
                          {/* Bookmark Toggle */}
                          <button
                            onClick={() => handleToggleBookmark(proj._id)}
                            title={saved ? 'Remove bookmark' : 'Bookmark project'}
                            className={`p-2 rounded-xl border transition ${
                              saved
                                ? 'bg-secondary/20 border-secondary text-secondary'
                                : 'border-white/10 hover:border-white/20 text-muted hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />
                          </button>
                          
                          {/* View details */}
                          <Button variant="primary" className="px-4 py-2 text-xs gap-1" onClick={() => navigate(`/projects/${proj._id}`)}>
                            View <ArrowRight size={12} />
                          </Button>
                        </div>
                      </div>

                    </Card>
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
