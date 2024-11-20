import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { Users, Building2, DollarSign, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface DashboardStats {
  totalLeads: number;
  activeProperties: number;
  revenue: number;
  growthRate: number;
  leadsChange: number;
  propertiesChange: number;
  revenueChange: number;
  growthChange: number;
}

interface RecentLead {
  id: string;
  name: string;
  email: string;
  date: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  date: string;
}

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  change 
}: { 
  title: string; 
  value: string; 
  icon: any; 
  change: number;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground">
          <span className={change >= 0 ? 'text-green-600' : 'text-red-600'}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
          {' '}from last month
        </div>
      </CardContent>
    </Card>
  );
}

function RecentLeadCard({ lead }: { lead: RecentLead }) {
  const statusColors = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    qualified: 'bg-green-100 text-green-800',
    lost: 'bg-red-100 text-red-800',
  };

  return (
    <div className="flex items-center justify-between p-4 border-b last:border-0">
      <div className="space-y-1">
        <p className="font-medium">{lead.name}</p>
        <p className="text-sm text-muted-foreground">{lead.email}</p>
      </div>
      <div className="flex items-center gap-4">
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[lead.status]}`}>
          {lead.status}
        </span>
        <span className="text-sm text-muted-foreground">
          {new Date(lead.date).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

function NotificationCard({ notification }: { notification: Notification }) {
  const typeColors = {
    info: 'bg-blue-50 border-blue-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
  };

  return (
    <div className={`p-4 rounded-lg border ${typeColors[notification.type]} mb-3 last:mb-0`}>
      <div className="flex justify-between items-start mb-1">
        <h4 className="font-medium">{notification.title}</h4>
        <span className="text-xs text-muted-foreground">
          {new Date(notification.date).toLocaleDateString()}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">{notification.message}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { data: stats } = useQuery<DashboardStats>(['dashboard-stats'], 
    () => api.get('/dashboard/stats').then(res => res.data)
  );

  const { data: recentLeads } = useQuery<RecentLead[]>(['recent-leads'],
    () => api.get('/leads/recent').then(res => res.data)
  );

  const { data: notifications } = useQuery<Notification[]>(['notifications'],
    () => api.get('/notifications').then(res => res.data)
  );

  const defaultStats = {
    totalLeads: 0,
    activeProperties: 0,
    revenue: 0,
    growthRate: 0,
    leadsChange: 0,
    propertiesChange: 0,
    revenueChange: 0,
    growthChange: 0,
  };

  const currentStats = stats || defaultStats;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleString()}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Leads"
          value={currentStats.totalLeads.toString()}
          icon={Users}
          change={currentStats.leadsChange}
        />
        <StatCard
          title="Active Properties"
          value={currentStats.activeProperties.toString()}
          icon={Building2}
          change={currentStats.propertiesChange}
        />
        <StatCard
          title="Revenue"
          value={formatCurrency(currentStats.revenue)}
          icon={DollarSign}
          change={currentStats.revenueChange}
        />
        <StatCard
          title="Growth Rate"
          value={`${currentStats.growthRate}%`}
          icon={TrendingUp}
          change={currentStats.growthChange}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recentLeads?.map(lead => (
              <RecentLeadCard key={lead.id} lead={lead} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            {notifications?.map(notification => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}