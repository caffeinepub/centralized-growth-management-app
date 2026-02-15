import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAddBrand } from '../../hooks/useQueries';
import { Loader2 } from 'lucide-react';
import type { BrandProfile } from '../../backend';

interface BrandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BrandDialog({ open, onOpenChange }: BrandDialogProps) {
  const [name, setName] = useState('');
  const [margin, setMargin] = useState('');
  const [adBudget, setAdBudget] = useState('');
  const addBrand = useAddBrand();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const profile: BrandProfile = {
        name: name.trim(),
        products: [],
        pricing: [],
        margin: parseFloat(margin) || 0,
        suppliers: [],
        adBudget: parseFloat(adBudget) || 0,
        weeklyGoals: {
          revenue: 0,
          profit: 0,
          roas: 0,
          cac: 0,
          conversionRate: 0,
          aov: 0,
          returnRate: 0,
          shippingCost: 0,
        },
        monthlyGoals: {
          revenue: 0,
          profit: 0,
          roas: 0,
          cac: 0,
          conversionRate: 0,
          aov: 0,
          returnRate: 0,
          shippingCost: 0,
        },
      };
      addBrand.mutate(
        { name: name.trim(), profile },
        {
          onSuccess: () => {
            setName('');
            setMargin('');
            setAdBudget('');
            onOpenChange(false);
          },
        }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Brand</DialogTitle>
          <DialogDescription>Add a new brand to your portfolio</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brandName">Brand Name *</Label>
            <Input
              id="brandName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter brand name"
              required
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="margin">Target Margin (%)</Label>
            <Input
              id="margin"
              type="number"
              step="0.01"
              value={margin}
              onChange={(e) => setMargin(e.target.value)}
              placeholder="e.g., 35"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adBudget">Monthly Ad Budget ($)</Label>
            <Input
              id="adBudget"
              type="number"
              step="0.01"
              value={adBudget}
              onChange={(e) => setAdBudget(e.target.value)}
              placeholder="e.g., 10000"
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || addBrand.isPending} className="flex-1">
              {addBrand.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Brand'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
