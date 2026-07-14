import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../context/AuthContext.jsx';
import { Bookmark, ArrowRight, ArrowLeft, Trash2, Search, Star } from 'lucide-react';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import Badge from '../components/Badge.jsx';

export default function SavedProjectsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch Bookmarked projects
  const { data: savedProjects, isLoading } = useQuery({
    queryKey: ['savedProjects'],
    queryFn: async () => {
      const res = await api.get('/api/saved-projects');
      return res.data.projects;
    }
  });

  // Mutation to toggle bookmark
  const deleteBookmarkMutation = useMutation({
    mutationFn: async (projectId) => {
      const res = await api.post(`/api/saved-projects/${projectId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedProjects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    }
  });

  const handleRemoveBookmark = (id) => {
    deleteBookmarkMutation.mutate(id);
  };

  const filteredProjects = savedProjects?.filter(proj => 
    proj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proj.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proj.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-background min-h-screen text-text pt-28 pb-12 relative overflow-hidden font-sans transition-colors duration-300">
      
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-15%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[-15%] w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-6">
        
        {/* Navigation */}
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 text-xs font-bold text-muted hover:text-text uppercase tracking-widest cursor-pointer select-none bg-transparent border-none"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="font-heading text-title md:text-5xl font-black text-text flex items-center gap-3.5 uppercase tracking-wide">
              <Bookmark className="text-secondary" /> Saved Bookmarks
            </h1>
            <p className="text-xs text-muted font-bold tracking-wider uppercase mt-1">
              LOS SANTOS OPERATIONS VAULT
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64 group">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search saved projects..."
              className="w-full bg-card/60 dark:bg-black/20 border border-border rounded-[18px] pl-9 pr-4 py-3.5 text-xs text-text placeholder-muted/60 focus:outline-none focus:border-secondary outline-none transition duration-200 group-hover:border-border/80"
            />
          </div>
        </div>

        {/* Content list */}
        {isLoading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-24 bg-black/10 dark:bg-white/5 rounded-[18px]"></div>
            <div className="h-24 bg-black/10 dark:bg-white/5 rounded-[18px]"></div>
          </div>
        ) : filteredProjects?.length === 0 ? (
          <Card className="border border-border bg-card p-16 text-center text-muted rounded-[18px] shadow-warm">
            <div className="w-16 h-16 rounded-full bg-secondary/15 flex items-center justify-center mx-auto text-secondary mb-4 shadow-warm animate-bounce">
              <Bookmark size={28} />
            </div>
            <h3 className="font-heading font-black text-lg text-text uppercase">VAULT IS EMPTY</h3>
            <p className="text-xs text-muted mt-1 max-w-sm mx-auto font-sans leading-relaxed">
              {searchTerm 
                ? 'No projects matching your keyword are currently locked in the vault.' 
                : 'You have not bookmarked any technical scopes yet. Go back to dashboard to start loading targets.'}
            </p>
            <Button variant="primary" className="mx-auto mt-6" onClick={() => navigate('/dashboard')}>
              Discover Recommendations
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredProjects?.map(proj => (
              <Card key={proj._id} hoverGlow className="border border-border p-6 flex flex-col sm:flex-row items-center justify-between gap-6 bg-card rounded-[18px] shadow-warm">
                <div className="space-y-2 flex-1 w-full text-left">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-heading font-black text-xl text-text hover:text-secondary transition cursor-pointer uppercase tracking-wide" onClick={() => navigate(`/projects/${proj._id}`)}>
                      {proj.name}
                    </h3>
                    <Badge type="difficulty">{proj.difficulty}</Badge>
                    <span className="text-[10px] font-heading font-black tracking-wider uppercase text-muted border border-border bg-background px-2.5 py-0.5 rounded-xl select-none">
                      {proj.domain}
                    </span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed font-sans line-clamp-2">
                    {proj.description}
                  </p>
                </div>
                
                <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-6 justify-between sm:justify-start">
                  <button
                    onClick={() => handleRemoveBookmark(proj._id)}
                    className="p-3 rounded-xl border border-danger/30 bg-danger/10 text-danger hover:bg-danger hover:text-white transition duration-200 cursor-pointer select-none outline-none flex items-center justify-center"
                    title="Remove from saved list"
                  >
                    <Trash2 size={15} />
                  </button>
                  <Button variant="primary" className="px-4 py-2 text-xs gap-1.5" onClick={() => navigate(`/projects/${proj._id}`)}>
                    View Roadmap <ArrowRight size={12} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
