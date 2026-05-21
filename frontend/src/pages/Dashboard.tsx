import React from 'react';
import { Users, ShieldCheck, XCircle, Clock } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

const stats = [
  { name: 'Total Candidates', value: '2,845', icon: Users, color: 'text-primary-600', bg: 'bg-primary-50' },
  { name: 'Verified', value: '1,932', icon: ShieldCheck, color: 'text-success-600', bg: 'bg-success-50' },
  { name: 'Failed', value: '342', icon: XCircle, color: 'text-error-600', bg: 'bg-error-50' },
  { name: 'Pending', value: '571', icon: Clock, color: 'text-warning-600', bg: 'bg-warning-50' },
];

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-slate-500">Monitor your background verification metrics.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 truncate">{stat.name}</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-success-600 font-medium flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  12%
                </span>
                <span className="ml-2 text-slate-500">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 min-h-[400px] flex items-center justify-center">
          <div className="text-center text-slate-500">
            <p className="font-medium">Verification Trends Chart</p>
            <p className="text-sm">(Chart implementation placeholder)</p>
          </div>
        </Card>
        
        <Card className="col-span-1 min-h-[400px]">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-base font-semibold text-slate-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary-500 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">John Doe verified successfully</p>
                    <p className="text-xs text-slate-500 mt-0.5">{i * 2} hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
