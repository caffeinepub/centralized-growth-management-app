import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { MousePointerClick } from 'lucide-react';

export default function CROPage() {
  return (
    <div>
      <PageHeader title="CRO & Website" description="Conversion rate optimization tools" />
      <EmptyState
        icon={MousePointerClick}
        title="CRO Tools Coming Soon"
        description="Website optimization checklist, A/B test tracker, and UX feedback notes will be available here."
      />
    </div>
  );
}
