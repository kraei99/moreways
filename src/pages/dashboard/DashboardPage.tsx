import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { userApi } from '@/services/api/user';
import { leadApi } from '@/services/api/lead';
import { BarChart, Users, DollarSign, Home } from 'lucide-react';

export default function DashboardPage() {
  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => userApi.getNotifications()
  });

  const { data: recentLeads } = useQuery({
    queryKey: ['leads', 'recent'],
    queryFn: () => leadApi.getAll({ limit: 5 })
  });

  const stats = [
    { title: "Active Leads", value: "120", icon: Users, change: "+10%" },
    { title: "Properties Viewed", value: "450", icon: Home, change: "+23%" },
    { title: "Total Revenue", value: "$45,231", icon: DollarSign, change: "+15%" },
    { title: "Conversion Rate", value: "12.5%", icon: BarChart, change: "+4%" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                  {stat.change}
                </span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
          </CardHeader>
          <CardContent>
            {recentLeads?.map((lead) => (
              <div key={lead.id} className="py-2 border-b last:border-0">
                <div className="font-medium">{lead.name}</div>
                <div className="text-sm text-muted-foreground">{lead.email}</div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            {notifications?.map((notification) => (
              <div key={notification.id} className="py-2 border-b last:border-0">
                <div className="font-medium">{notification.title}</div>
                <div className="text-sm text-muted-foreground">{notification.message}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}