import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { Truck } from 'lucide-react';

export default function OperationsPage() {
  return (
    <div>
      <PageHeader title="Operations" description="Shipping and operations tracking" />
      <EmptyState
        icon={Truck}
        title="Operations Tools Coming Soon"
        description="Track delivery times, RTO rates, shipping costs, and operations issues will be available here."
      />
    </div>
  );
}
