import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { BookOpen } from 'lucide-react';

export default function KnowledgePage() {
  return (
    <div>
      <PageHeader title="Knowledge" description="Best practices and learning resources" />
      <EmptyState
        icon={BookOpen}
        title="Knowledge Base Coming Soon"
        description="Store best practices, case studies, playbooks, and personal notes will be available here."
      />
    </div>
  );
}
