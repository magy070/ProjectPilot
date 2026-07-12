import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../context/AuthContext.jsx';
import { Bookmark, ArrowRight, ArrowLeft, Trash2, Search } from 'lucide-react';
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
    <div className="bg-background min-h-screen text-text py-12 relative overflow-hidden font-sans">
      <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-6">
        
        {/* Navigation */}
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 text-xs text-muted hover:text-white transition duration-200"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-muted bg-clip-text text-transparent flex items-center gap-2">
              <Bookmark className="text-secondary" /> Saved Bookmarks
            </h1>
            <p className="text-sm text-muted mt-1">
              Your bookmarks folder tracking candidate technical scopes.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search saved projects..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-muted focus:outline-none focus:border-primary/50"
            />
          </div>
        </div>

        {/* Content list */}
        {isLoading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-24 bg-white/5 rounded-xl"></div>
            <div className="h-24 bg-white/5 rounded-xl"></div>
          </div>
        ) : filteredProjects?.length === 0 ? (
          <Card className="border border-white/5 bg-white/1 p-16 text-center text-muted">
            {searchTerm ? 'No projects match your search query.' : 'You have not bookmarked any projects yet. Go back to discover recommendations.'}
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredProjects?.map(proj => (
              <Card key={proj._id} hoverGlow className="border border-white/5 p-6 flex items-center justify-between gap-6">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-extrabold text-base text-white hover:text-primary transition cursor-pointer" onClick={() => navigate(`/projects/${proj._id}`)}>
                      {proj.name}
                    </h3>
                    <Badge type="difficulty">{proj.difficulty}</Badge>
                    <span className="text-xs text-muted border border-white/10 bg-white/2 px-2 py-0.5 rounded">
                      {proj.domain}
                    </span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed line-clamp-2">
                    {proj.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 border-l border-white/5 pl-6">
                  <button
                    onClick={() => handleRemoveBookmark(proj._id)}
                    className="p-2.5 rounded-xl border border-white/5 bg-white/2 text-muted hover:text-rose-400 hover:border-rose-500/30 transition hover:bg-rose-500/5"
                    title="Remove from saved list"
                  >
                    <Trash2 size={16} />
                  </button>
                  <Button variant="primary" className="px-4 py-2 text-xs gap-1" onClick={() => navigate(`/projects/${proj._id}`)}>
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
