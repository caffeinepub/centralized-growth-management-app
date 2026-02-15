import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { useListBrands } from '../hooks/useQueries';
import { Store, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { BrandDialog } from '../components/brands/BrandDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserRole } from '../hooks/useUserRole';

export default function BrandsPage() {
  const { data: brands, isLoading } = useListBrands();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { hasPermission } = useUserRole();

  const canEdit = hasPermission('Editor');

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Brands" description="Manage your D2C brand portfolio" />
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!brands || brands.length === 0) {
    return (
      <div>
        <PageHeader title="Brands" description="Manage your D2C brand portfolio" />
        <EmptyState
          icon={Store}
          title="No brands yet"
          description="Create your first brand profile to start tracking products, margins, and goals."
          action={
            canEdit && (
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Brand
              </Button>
            )
          }
        />
        {canEdit && <BrandDialog open={dialogOpen} onOpenChange={setDialogOpen} />}
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Brands"
        description={`${brands.length} brand${brands.length !== 1 ? 's' : ''} in your portfolio`}
        actions={
          canEdit && (
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Brand
            </Button>
          )
        }
      />
      <div className="p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {brands.map((brandName) => (
            <Card
              key={brandName}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => navigate({ to: '/brands/$brandName', params: { brandName } })}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  {brandName}
                </CardTitle>
                <CardDescription>Click to view details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  View products, goals, and performance metrics
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      {canEdit && <BrandDialog open={dialogOpen} onOpenChange={setDialogOpen} />}
    </div>
  );
}
