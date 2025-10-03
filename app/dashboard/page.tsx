'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Users, UserPlus, Briefcase, TrendingUp, SquareCheck as CheckSquare, Calendar } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import CountUp from 'react-countup';
import clsx from 'clsx';

type Stats = {
  totalContacts: number;
  totalLeads: number;
  totalDeals: number;
  totalActivities: number;
  dealValue: number;
  pendingActivities: number;
};

type LeadsByStatus = { name: string; value: number };
type DealsByStage = { stage: string; count: number; value: number };

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function DashboardPage() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalContacts: 0,
    totalLeads: 0,
    totalDeals: 0,
    totalActivities: 0,
    dealValue: 0,
    pendingActivities: 0,
  });
  const [leadsByStatus, setLeadsByStatus] = useState<LeadsByStatus[]>([]);
  const [dealsByStage, setDealsByStage] = useState<DealsByStage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // demo data
    const demoStats: Stats = {
      totalContacts: 120,
      totalLeads: 45,
      totalDeals: 18,
      totalActivities: 67,
      dealValue: 250000,
      pendingActivities: 12,
    };

    const demoLeadsByStatus: LeadsByStatus[] = [
      { name: 'New', value: 15 },
      { name: 'In Progress', value: 20 },
      { name: 'Won', value: 7 },
      { name: 'Lost', value: 3 },
    ];

    const demoDealsByStage: DealsByStage[] = [
      { stage: 'Prospecting', count: 5, value: 50000 },
      { stage: 'Qualification', count: 4, value: 30000 },
      { stage: 'Proposal', count: 6, value: 100000 },
      { stage: 'Closed Won', count: 3, value: 70000 },
    ];

    setTimeout(() => {
      setStats(demoStats);
      setLeadsByStatus(demoLeadsByStatus);
      setDealsByStage(demoDealsByStage);
      setLoading(false);
    }, 800); // smooth loading effect
  }, []);

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-b-4 border-blue-300"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  const statCards = [
    { title: 'Total Contacts', value: stats.totalContacts, icon: Users, description: 'Active contacts in your CRM', gradient: 'from-blue-100 to-blue-50' },
    { title: 'Total Leads', value: stats.totalLeads, icon: UserPlus, description: 'Potential opportunities', gradient: 'from-green-100 to-green-50' },
    { title: 'Active Deals', value: stats.totalDeals, icon: Briefcase, description: 'Deals in pipeline', gradient: 'from-yellow-100 to-yellow-50' },
    { title: 'Total Deal Value', value: stats.dealValue, icon: TrendingUp, description: 'Combined value of all deals', gradient: 'from-purple-100 to-purple-50' },
    { title: 'Pending Activities', value: stats.pendingActivities, icon: CheckSquare, description: 'Tasks awaiting completion', gradient: 'from-red-100 to-red-50' },
    { title: 'Total Activities', value: stats.totalActivities, icon: Calendar, description: 'All activities logged', gradient: 'from-indigo-100 to-indigo-50' },
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-1">
              Welcome back, {profile?.full_name || 'Charles Alyansis'}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {statCards.map((card) => (
              <Card
                key={card.title}
                className={clsx(
                  `bg-gradient-to-br ${card.gradient} shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl rounded-2xl`
                )}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-semibold text-slate-800">{card.title}</CardTitle>
                  <card.icon className="h-5 w-5 text-slate-700" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">
                    <CountUp end={typeof card.value === 'number' ? card.value : card.value} duration={1.5} separator="," prefix={card.title === 'Total Deal Value' ? '$' : ''} />
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{card.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Deals by Stage */}
            <Card className="shadow-xl rounded-2xl hover:shadow-2xl transition-all bg-gradient-to-br from-white to-slate-50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800">Deals by Stage</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dealsByStage} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="4 4" stroke="#e0e0e0" />
                    <XAxis dataKey="stage" angle={-35} textAnchor="end" height={80} tick={{ fill: '#555', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#555', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', padding: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      itemStyle={{ color: '#333', fontWeight: '600' }}
                    />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                      {dealsByStage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`url(#gradient-bar-${index})`} />
                      ))}
                    </Bar>
                    <defs>
                      {dealsByStage.map((entry, index) => (
                        <linearGradient key={`grad-${index}`} id={`gradient-bar-${index}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.6} />
                        </linearGradient>
                      ))}
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Leads by Status */}
            <Card className="shadow-xl rounded-2xl hover:shadow-2xl transition-all bg-gradient-to-br from-white to-slate-50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800">Leads by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={leadsByStatus}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={30}
                      dataKey="value"
                      paddingAngle={3}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                      isAnimationActive={true}
                    >
                      {leadsByStatus.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`url(#gradient-pie-${index})`}
                          style={{ transition: 'all 0.3s ease' }}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', padding: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      itemStyle={{ color: '#333', fontWeight: '600' }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                    <defs>
                      {leadsByStatus.map((entry, index) => (
                        <linearGradient key={`grad-pie-${index}`} id={`gradient-pie-${index}`} x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.8} />
                          <stop offset="100%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.5} />
                        </linearGradient>
                      ))}
                    </defs>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
