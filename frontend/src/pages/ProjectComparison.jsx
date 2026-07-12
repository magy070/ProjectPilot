import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../context/AuthContext.jsx';
import { ArrowLeft, BarChart2 } from 'lucide-react';
import Card from '../components/Card.jsx';
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
        <div className="h-64 bg-white/5 rounded-2xl border border-white/5"></div>
      </div>
    );
  }

  if (error || !projects || projects.length < 2) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-rose-500">Invalid Comparison</h2>
        <p className="text-sm text-muted">Please select at least 2 projects from the dashboard to compare.</p>
        <Button variant="secondary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const comparisonRows = [
    { label: "Domain", key: "domain" },
    { label: "Difficulty", key: "difficulty", render: (val) => <Badge type="difficulty">{val}</Badge> },
    { label: "Duration", key: "estimatedTime" },
    { label: "Team Size", key: "teamSize", render: (val) => `${val} Developer${val > 1 ? 's' : ''}` },
    { label: "Tech Stack", key: "techStack", render: (val) => val.join(', ') },
    { label: "Base Feasibility", key: "feasibilityScore", render: (val) => `${val}%` },
    { label: "Resume value", key: "resumeValue" },
    { label: "Problem Statement", key: "problemStatement" }
  ];

  return (
    <div className="bg-background min-h-screen text-text py-12 relative overflow-hidden font-sans">
      <div className="max-w-6xl mx-auto px-6 relative z-10 space-y-8">
        
        {/* Navigation */}
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 text-xs text-muted hover:text-white transition duration-200"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>

        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-muted bg-clip-text text-transparent flex items-center gap-2">
            <BarChart2 className="text-secondary" /> Project Comparison Matrix
          </h1>
          <p className="text-sm text-muted mt-1">
            Analyze key differences side-by-side to determine which concept matches your schedule.
          </p>
        </div>

        {/* Comparison Table */}
        <Card className="border border-white/5 bg-white/2 p-0 overflow-x-auto rounded-2xl shadow-2xl">
          <table className="w-full text-left border-collapse min-w-[700px]">
            
            {/* Table Header */}
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="p-6 text-sm font-bold text-muted w-1/4">Metric</th>
                {projects.map((proj, idx) => (
                  <th key={idx} className="p-6 text-sm font-extrabold text-white w-1/3">
                    <div className="space-y-1 text-left">
                      <span className="block hover:text-primary transition cursor-pointer" onClick={() => navigate(`/projects/${proj._id}`)}>
                        {proj.name}
                      </span>
                      <button 
                        onClick={() => navigate(`/projects/${proj._id}`)}
                        className="text-[10px] text-primary font-semibold hover:underline block"
                      >
                        Configure Proposal →
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-white/5 text-sm">
              {comparisonRows.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-white/1 transition duration-150">
                  <td className="p-6 font-semibold text-muted text-xs uppercase tracking-wider">{row.label}</td>
                  {projects.map((proj, colIdx) => (
                    <td key={colIdx} className="p-6 text-muted font-medium text-xs md:text-sm">
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
