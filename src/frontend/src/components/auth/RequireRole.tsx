import { ReactNode } from 'react';
import { useUserRole, AppRole } from '../../hooks/useUserRole';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';

interface RequireRoleProps {
  children: ReactNode;
  role: AppRole;
  fallback?: ReactNode;
}

export function RequireRole({ children, role, fallback }: RequireRoleProps) {
  const { hasPermission, isLoading } = useUserRole();

  if (isLoading) {
    return null;
  }

  if (!hasPermission(role)) {
    if (fallback) return <>{fallback}</>;
    
    return (
      <div className="flex min-h-[400px] items-center justify-center p-8">
        <Alert variant="destructive" className="max-w-md">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You don't have permission to access this section. Please contact an administrator.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}
