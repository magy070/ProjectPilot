import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../context/AuthContext.jsx';
import { ArrowLeft, BarChart2 } from 'lucide-react';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import Badge from '../components/Badge.jsx';

export default function ProjectComparison() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const ids = searchParams.get('ids')?.split(',') || [];

  // Fetch all selected projects in a single query
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['compareProjects', ids.join(',')],
    queryFn: async () => {
      if (ids.length === 0) return [];
      const requests = ids.map(id => api.get(`/api/projects/${id}`));
      const responses = await Promise.all(requests);
      return responses.map(res => res.data.project);
    },
    enabled: ids.length > 0
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 text-center animate-pulse space-y-6">
        <h2 className="text-xl text-muted">Gathering comparison specs...</h2>
        <div className="h-64 bg-black/10 dark:bg-white/5 rounded-[18px] border border-border"></div>
      </div>
    );
  }

  if (error || !projects || projects.length < 2) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center space-y-4 font-sans">
        <h2 className="font-heading text-title font-black text-danger uppercase tracking-wide">Invalid Comparison</h2>
        <p className="text-xs text-muted leading-relaxed">Please select at least 2 projects from the dashboard to compare.</p>
        <Button variant="secondary" onClick={() => navigate('/dashboard')} className="mx-auto">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const comparisonRows = [
    { label: "Domain Area", key: "domain" },
    { label: "Difficulty Rank", key: "difficulty", render: (val) => <Badge type="difficulty">{val}</Badge> },
    { label: "Crew Timeframe", key: "estimatedTime" },
    { label: "Team Count", key: "teamSize", render: (val) => `${val} Developer${val > 1 ? 's' : ''}` },
    { label: "Skill Stack", key: "techStack", render: (val) => val.join(', ') },
    { label: "Feasibility Score", key: "feasibilityScore", render: (val) => <span className="font-heading font-black text-success text-base">{val}%</span> },
    { label: "Resume Value", key: "resumeValue" },
    { label: "Problem Statement", key: "problemStatement" }
  ];

  return (
    <div className="bg-background min-h-screen text-text pt-28 pb-12 relative overflow-hidden font-sans transition-colors duration-300">
      
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-15%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[-15%] w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10 space-y-8">
        
        {/* Navigation */}
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 text-xs font-bold text-muted hover:text-text uppercase tracking-widest cursor-pointer select-none bg-transparent border-none"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>

        <div>
          <h1 className="font-heading text-title md:text-5xl font-black text-text flex items-center gap-3 uppercase tracking-wide">
            <BarChart2 className="text-secondary" /> Project Comparison Matrix
          </h1>
          <p className="text-xs text-muted font-bold tracking-wider uppercase mt-1">
            LOS SANTOS SIDE-BY-SIDE MATCHMAKER
          </p>
        </div>

        {/* Comparison Table */}
        <Card className="border border-border bg-card p-0 overflow-x-auto rounded-[18px] shadow-hud">
          <table className="w-full text-left border-collapse min-w-[700px] font-sans">
            
            {/* Table Header */}
            <thead>
              <tr className="border-b border-border bg-black/5 dark:bg-black/25">
                <th className="p-6 text-[10px] font-bold text-muted uppercase tracking-widest w-1/4">Metric</th>
                {projects.map((proj, idx) => (
                  <th key={idx} className="p-6 text-sm font-extrabold text-text w-1/3 border-l border-border">
                    <div className="space-y-2 text-left">
                      <span 
                        className="font-heading font-black tracking-wide text-lg text-text hover:text-secondary transition cursor-pointer uppercase block" 
                        onClick={() => navigate(`/projects/${proj._id}`)}
                      >
                        {proj.name}
                      </span>
                      <button 
                        onClick={() => navigate(`/projects/${proj._id}`)}
                        className="text-[9px] text-secondary font-bold uppercase tracking-widest hover:text-accent-orange block cursor-pointer bg-transparent border-none"
                      >
                        Configure Proposal →
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody className="divide-y divide-border text-xs font-semibold">
              {comparisonRows.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-black/5 dark:hover:bg-white/5 transition duration-150">
                  <td className="p-6 text-muted font-bold uppercase tracking-wider bg-black/5 dark:bg-black/10">{row.label}</td>
                  {projects.map((proj, idx) => (
                    <td key={idx} className="p-6 text-text border-l border-border leading-relaxed font-sans font-medium text-xs">
                      {row.render ? row.render(proj[row.key]) : proj[row.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>

          </table>
        </Card>

      </div>
    </div>
  );
}
