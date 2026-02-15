import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { FileText } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div>
      <PageHeader title="Reports" description="Generate and export performance reports" />
      <EmptyState
        icon={FileText}
        title="Reports Coming Soon"
        description="Weekly and monthly report generation with PDF export will be available here."
      />
    </div>
  );
}
