import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { useListBrands } from '../hooks/useQueries';
import { LayoutDashboard, TrendingUp, DollarSign, Target, Users } from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

export default function DashboardPage() {
  const { data: brands, isLoading } = useListBrands();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Dashboard" description="Overview of your D2C brands performance" />
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!brands || brands.length === 0) {
    return (
      <div>
        <PageHeader title="Dashboard" description="Overview of your D2C brands performance" />
        <EmptyState
          icon={LayoutDashboard}
          title="No brands yet"
          description="Create your first brand to start tracking performance metrics and KPIs."
          action={
            <Button onClick={() => navigate({ to: '/brands' })}>
              Create Your First Brand
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={`Managing ${brands.length} brand${brands.length !== 1 ? 's' : ''}`}
      />
      <div className="p-6">
        <div className="mb-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Brands</p>
                <p className="mt-2 text-3xl font-bold">{brands.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </MetricCard>

          <MetricCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                <p className="mt-2 text-3xl font-bold">-</p>
                <p className="text-xs text-muted-foreground">Add KPI data</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-chart-1/10">
                <DollarSign className="h-6 w-6 text-chart-1" />
              </div>
            </div>
          </MetricCard>

          <MetricCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">ROAS</p>
                <p className="mt-2 text-3xl font-bold">-</p>
                <p className="text-xs text-muted-foreground">Add campaign data</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-chart-2/10">
                <Target className="h-6 w-6 text-chart-2" />
              </div>
            </div>
          </MetricCard>

          <MetricCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Growth</p>
                <p className="mt-2 text-3xl font-bold">-</p>
                <p className="text-xs text-muted-foreground">Track over time</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-chart-3/10">
                <TrendingUp className="h-6 w-6 text-chart-3" />
              </div>
            </div>
          </MetricCard>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Button variant="outline" className="justify-start" onClick={() => navigate({ to: '/brands' })}>
              <Users className="mr-2 h-4 w-4" />
              Manage Brands
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => navigate({ to: '/marketing' })}>
              <Target className="mr-2 h-4 w-4" />
              Track Campaigns
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => navigate({ to: '/tasks' })}>
              <TrendingUp className="mr-2 h-4 w-4" />
              View Tasks
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
