import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { useListTasks } from '../hooks/useQueries';
import { CheckSquare, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskDialog } from '../components/tasks/TaskDialog';
import { TaskList } from '../components/tasks/TaskList';
import { useUserRole } from '../hooks/useUserRole';

export default function TasksPage() {
  const { data: tasks, isLoading } = useListTasks();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { hasPermission } = useUserRole();

  const canEdit = hasPermission('Editor');

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Tasks" description="Manage your workflow and priorities" />
        <div className="p-6">
          <div className="h-64 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div>
        <PageHeader title="Tasks" description="Manage your workflow and priorities" />
        <EmptyState
          icon={CheckSquare}
          title="No tasks yet"
          description="Create tasks to organize your work and track priorities across brands."
          action={
            canEdit && (
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Task
              </Button>
            )
          }
        />
        {canEdit && <TaskDialog open={dialogOpen} onOpenChange={setDialogOpen} />}
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Tasks"
        description={`${tasks.length} task${tasks.length !== 1 ? 's' : ''} in your workflow`}
        actions={
          canEdit && (
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          )
        }
      />
      <div className="p-6">
        <TaskList tasks={tasks} />
      </div>
      {canEdit && <TaskDialog open={dialogOpen} onOpenChange={setDialogOpen} />}
    </div>
  );
}
