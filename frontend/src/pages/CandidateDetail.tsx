import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, CheckCircle2, Clock, XCircle, FileText, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const CandidateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);

  // Mock data for candidate
  const candidate = {
    id: id,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1 (555) 123-4567',
    position: 'Product Manager',
    status: 'Pending',
    appliedDate: '2024-05-18',
    aadhaar: 'XXXX-XXXX-1234',
    pan: 'ABCDE1234F',
    address: '123 Tech Lane, San Francisco, CA 94105',
  };

  const timeline = [
    { id: 1, stage: 'Identity Verification', status: 'Completed', date: 'May 19, 10:30 AM', icon: CheckCircle2, color: 'text-success-500' },
    { id: 2, stage: 'Criminal Background Check', status: 'Pending', date: 'In progress', icon: Clock, color: 'text-warning-500' },
    { id: 3, stage: 'Employment History', status: 'Pending', date: 'Waiting to start', icon: Clock, color: 'text-slate-400' },
    { id: 4, stage: 'Education Verification', status: 'Pending', date: 'Waiting to start', icon: Clock, color: 'text-slate-400' },
  ];

  const logs = [
    { id: 1, action: 'Candidate profile created', user: 'System', date: 'May 18, 09:15 AM' },
    { id: 2, action: 'Documents uploaded', user: 'Jane Smith', date: 'May 18, 02:45 PM' },
    { id: 3, action: 'Identity verification started', user: 'Admin User', date: 'May 19, 10:00 AM' },
    { id: 4, action: 'Identity verified successfully', user: 'System', date: 'May 19, 10:30 AM' },
    { id: 5, action: 'Criminal check initiated', user: 'System', date: 'May 19, 10:35 AM' },
  ];

  const handleStartVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      // Status update logic here
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/candidates')}
          className="p-2 rounded-full hover:bg-slate-200 transition-colors text-slate-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            {candidate.name}
            <Badge variant="warning">{candidate.status}</Badge>
          </h1>
          <p className="text-sm text-slate-500 mt-1">{candidate.position} • Applied {candidate.appliedDate}</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Button 
            variant="outline"
            onClick={() => window.open(`http://localhost:3000/api/candidates/${id}/report?action=preview`, '_blank')}
            className="hidden sm:flex"
          >
            Preview Report
          </Button>
          <Button 
            variant="secondary"
            onClick={() => window.open(`http://localhost:3000/api/candidates/${id}/report?action=download`, '_blank')}
          >
            Download Report
          </Button>
          <Button 
            onClick={handleStartVerification} 
            isLoading={isVerifying}
            className="shadow-md shadow-primary-500/20 gap-2"
          >
            {!isVerifying && <Play className="w-4 h-4 fill-current" />}
            Start Verification
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details & Documents */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-600" />
                Candidate Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                <div>
                  <dt className="text-sm font-medium text-slate-500">Full Name</dt>
                  <dd className="mt-1 text-sm text-slate-900">{candidate.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500">Email Address</dt>
                  <dd className="mt-1 text-sm text-slate-900">{candidate.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500">Phone Number</dt>
                  <dd className="mt-1 text-sm text-slate-900">{candidate.phone}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500">Position</dt>
                  <dd className="mt-1 text-sm text-slate-900">{candidate.position}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500">Aadhaar Number</dt>
                  <dd className="mt-1 text-sm text-slate-900 font-mono bg-slate-100 px-2 py-1 rounded inline-block">{candidate.aadhaar}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500">PAN Number</dt>
                  <dd className="mt-1 text-sm text-slate-900 font-mono bg-slate-100 px-2 py-1 rounded inline-block">{candidate.pan}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-slate-500">Residential Address</dt>
                  <dd className="mt-1 text-sm text-slate-900">{candidate.address}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary-600" />
                Activity Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {logs.map((log) => (
                  <div key={log.id} className="flex justify-between items-start py-3 border-b border-slate-100 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{log.action}</p>
                      <p className="text-xs text-slate-500 mt-1">by {log.user}</p>
                    </div>
                    <span className="text-xs text-slate-400 whitespace-nowrap">{log.date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Timeline */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Verification Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative border-l border-slate-200 ml-3 space-y-8 pb-4">
                {timeline.map((item, index) => (
                  <div key={item.id} className="relative pl-6">
                    <div className="absolute -left-2 top-0.5 bg-white p-0.5">
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${item.status === 'Completed' ? 'text-slate-900' : 'text-slate-600'}`}>
                        {item.stage}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{item.status} • {item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
