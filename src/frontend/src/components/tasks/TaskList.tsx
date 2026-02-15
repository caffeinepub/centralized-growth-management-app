import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Priority, TaskStatus } from '../../backend';
import type { Task } from '../../backend';
import { useUpdateTask } from '../../hooks/useQueries';
import { useUserRole } from '../../hooks/useUserRole';

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  const updateTask = useUpdateTask();
  const { hasPermission } = useUserRole();
  const canEdit = hasPermission('Editor');

  const handleToggle = (task: Task) => {
    if (!canEdit) return;
    const newStatus: TaskStatus = task.status === TaskStatus.completed
      ? TaskStatus.pending
      : TaskStatus.completed;
    updateTask.mutate({ id: task.id, task: { ...task, status: newStatus } });
  };

  const getPriorityLabel = (task: Task): string => {
    if (task.priority === Priority.high) return 'High';
    if (task.priority === Priority.medium) return 'Medium';
    return 'Low';
  };

  const getPriorityVariant = (task: Task): 'default' | 'secondary' | 'outline' => {
    if (task.priority === Priority.high) return 'default';
    if (task.priority === Priority.medium) return 'secondary';
    return 'outline';
  };

  const formatDate = (timestamp: bigint | undefined): string => {
    if (!timestamp) return '';
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString();
  };

  const isOverdue = (task: Task): boolean => {
    if (!task.dueDate || task.status === TaskStatus.completed) return false;
    const now = Date.now();
    const due = Number(task.dueDate) / 1000000;
    return due < now;
  };

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id.toString()}
          className={`flex items-start gap-4 rounded-lg border p-4 ${
            task.status === TaskStatus.completed ? 'bg-muted/50' : 'bg-card'
          } ${isOverdue(task) ? 'border-destructive' : ''}`}
        >
          <Checkbox
            checked={task.status === TaskStatus.completed}
            onCheckedChange={() => handleToggle(task)}
            disabled={!canEdit}
            className="mt-1"
          />
          <div className="flex-1 space-y-2">
            <p className={`font-medium ${task.status === TaskStatus.completed ? 'line-through text-muted-foreground' : ''}`}>
              {task.description}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant={getPriorityVariant(task)}>{getPriorityLabel(task)}</Badge>
              {task.brand && <Badge variant="outline">{task.brand}</Badge>}
              {task.dueDate && (
                <Badge variant={isOverdue(task) ? 'destructive' : 'secondary'}>
                  Due: {formatDate(task.dueDate)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
