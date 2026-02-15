import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetBrand, useDeleteBrand } from '../../hooks/useQueries';
import { PageHeader } from '../../components/PageHeader';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2, Loader2 } from 'lucide-react';
import { MetricCard } from '../../components/MetricCard';
import { useUserRole } from '../../hooks/useUserRole';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { BrandEditDialog } from '../../components/brands/BrandEditDialog';

export default function BrandDetailPage() {
  const { brandName } = useParams({ from: '/brands/$brandName' });
  const navigate = useNavigate();
  const { data: brand, isLoading } = useGetBrand(brandName);
  const deleteBrand = useDeleteBrand();
  const { hasPermission, isAdmin } = useUserRole();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const canEdit = hasPermission('Editor');

  const handleDelete = () => {
    deleteBrand.mutate(brandName, {
      onSuccess: () => {
        navigate({ to: '/brands' });
      },
    });
  };

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Loading..." />
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div>
        <PageHeader title="Brand Not Found" />
        <div className="p-6">
          <Button onClick={() => navigate({ to: '/brands' })}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Brands
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={brandName}
        description="Brand profile and performance"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate({ to: '/brands' })}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            {canEdit && (
              <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
            {isAdmin && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Brand</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete {brandName}? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        }
      />
      <div className="p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <MetricCard>
            <h3 className="text-sm font-medium text-muted-foreground">Target Margin</h3>
            <p className="mt-2 text-3xl font-bold">{brand.margin.toFixed(1)}%</p>
          </MetricCard>
          <MetricCard>
            <h3 className="text-sm font-medium text-muted-foreground">Monthly Ad Budget</h3>
            <p className="mt-2 text-3xl font-bold">${brand.adBudget.toLocaleString()}</p>
          </MetricCard>
          <MetricCard>
            <h3 className="text-sm font-medium text-muted-foreground">Products</h3>
            <p className="mt-2 text-3xl font-bold">{brand.products.length}</p>
          </MetricCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">Weekly Goals</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Revenue</span>
                <span className="font-medium">${brand.weeklyGoals.revenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Profit</span>
                <span className="font-medium">${brand.weeklyGoals.profit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">ROAS</span>
                <span className="font-medium">{brand.weeklyGoals.roas.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">Monthly Goals</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Revenue</span>
                <span className="font-medium">${brand.monthlyGoals.revenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Profit</span>
                <span className="font-medium">${brand.monthlyGoals.profit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">ROAS</span>
                <span className="font-medium">{brand.monthlyGoals.roas.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {brand.products.length > 0 && (
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">Products</h2>
            <div className="space-y-2">
              {brand.products.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${product.price.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">{product.margin.toFixed(1)}% margin</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {brand.suppliers.length > 0 && (
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">Suppliers</h2>
            <div className="space-y-2">
              {brand.suppliers.map((supplier, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-lg border p-3">
                  <p className="font-medium">{supplier.name}</p>
                  <p className="text-sm text-muted-foreground">{supplier.contact}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {canEdit && (
        <BrandEditDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          brandName={brandName}
          currentBrand={brand}
        />
      )}
    </div>
  );
}
