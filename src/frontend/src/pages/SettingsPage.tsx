import { PageHeader } from '../components/PageHeader';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { Shield } from 'lucide-react';
import { useUserRole } from '../hooks/useUserRole';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { isAdmin } = useUserRole();

  return (
    <div>
      <PageHeader title="Settings" description="Configure your application" />
      <div className="p-6">
        <div className="space-y-4">
          {isAdmin && (
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Access Control</h3>
                  <p className="text-sm text-muted-foreground">Manage user roles and permissions</p>
                </div>
                <Button onClick={() => navigate({ to: '/settings/access-control' })}>
                  <Shield className="mr-2 h-4 w-4" />
                  Manage Access
                </Button>
              </div>
            </div>
          )}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold">General Settings</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Additional settings will be available here as features are added.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
