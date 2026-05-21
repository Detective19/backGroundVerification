import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Candidate } from '../types';

const MOCK_CANDIDATES: Partial<Candidate>[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', position: 'Software Engineer', status: 'Pending', appliedDate: '2024-05-20' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', position: 'Product Manager', status: 'Verified', appliedDate: '2024-05-18' },
  { id: '3', name: 'Robert Johnson', email: 'robert@example.com', position: 'Data Scientist', status: 'Failed', appliedDate: '2024-05-15' },
  { id: '4', name: 'Emily Davis', email: 'emily@example.com', position: 'UX Designer', status: 'Verified', appliedDate: '2024-05-12' },
  { id: '5', name: 'Michael Wilson', email: 'michael@example.com', position: 'DevOps Engineer', status: 'Pending', appliedDate: '2024-05-10' },
];

export const CandidateList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  const filteredCandidates = MOCK_CANDIDATES.filter(candidate => {
    const matchesSearch = candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          candidate.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || candidate.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status?: string) => {
    switch(status) {
      case 'Verified': return <Badge variant="success">Verified</Badge>;
      case 'Failed': return <Badge variant="error">Failed</Badge>;
      case 'Pending': return <Badge variant="warning">Pending</Badge>;
      default: return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Candidates</h1>
          <p className="mt-1 text-sm text-slate-500">Manage and view all candidate verifications.</p>
        </div>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/50">
          <div className="w-full sm:max-w-md">
            <Input 
              placeholder="Search by name or email..." 
              icon={<Search className="w-4 h-4" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto flex items-center">
              <Filter className="w-4 h-4 absolute left-3 text-slate-400" />
              <select 
                className="pl-9 pr-8 py-2 w-full border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Verified">Verified</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Candidate</th>
                <th className="px-6 py-4 font-medium">Position</th>
                <th className="px-6 py-4 font-medium">Applied Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCandidates.map((candidate) => (
                <tr 
                  key={candidate.id} 
                  className="bg-white hover:bg-slate-50/80 transition-colors cursor-pointer"
                  onClick={() => navigate(`/candidates/${candidate.id}`)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold shrink-0">
                        {candidate.name?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{candidate.name}</div>
                        <div className="text-slate-500">{candidate.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{candidate.position}</td>
                  <td className="px-6 py-4 text-slate-600">{candidate.appliedDate}</td>
                  <td className="px-6 py-4">{getStatusBadge(candidate.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors" onClick={(e) => { e.stopPropagation(); }}>
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCandidates.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No candidates found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <div>
            Showing <span className="font-medium text-slate-900">1</span> to <span className="font-medium text-slate-900">{filteredCandidates.length}</span> of <span className="font-medium text-slate-900">{filteredCandidates.length}</span> results
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1 rounded border border-slate-200 disabled:opacity-50 hover:bg-slate-50">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="p-1 rounded border border-slate-200 disabled:opacity-50 hover:bg-slate-50">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
