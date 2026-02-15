import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { Package } from 'lucide-react';

export default function ProductsPage() {
  return (
    <div>
      <PageHeader title="Products" description="Product and category management" />
      <EmptyState
        icon={Package}
        title="Product Management Coming Soon"
        description="Track SKU performance, inventory alerts, and profitability analysis will be available here."
      />
    </div>
  );
}
