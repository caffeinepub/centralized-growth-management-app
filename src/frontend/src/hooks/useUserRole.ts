import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { UserRole } from '../backend';

export type AppRole = 'Admin' | 'Editor' | 'Viewer';

export function useUserRole() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserRole>({
    queryKey: ['userRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !actorFetching,
  });

  const mapRole = (role: UserRole | undefined): AppRole => {
    if (role === UserRole.admin) return 'Admin';
    if (role === UserRole.user) return 'Editor';
    return 'Viewer';
  };

  const hasPermission = (requiredRole: AppRole): boolean => {
    const currentRole = mapRole(query.data);
    if (currentRole === 'Admin') return true;
    if (currentRole === 'Editor' && requiredRole !== 'Admin') return true;
    if (currentRole === 'Viewer' && requiredRole === 'Viewer') return true;
    return false;
  };

  return {
    role: mapRole(query.data),
    isAdmin: query.data === UserRole.admin,
    isEditor: query.data === UserRole.user,
    isViewer: query.data === UserRole.guest,
    hasPermission,
    isLoading: actorFetching || query.isLoading,
  };
}
