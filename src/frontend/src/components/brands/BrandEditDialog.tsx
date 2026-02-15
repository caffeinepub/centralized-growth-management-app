import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateBrand } from '../../hooks/useQueries';
import { Loader2 } from 'lucide-react';
import type { BrandProfile } from '../../backend';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BrandEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brandName: string;
  currentBrand: BrandProfile;
}

export function BrandEditDialog({ open, onOpenChange, brandName, currentBrand }: BrandEditDialogProps) {
  const [margin, setMargin] = useState(currentBrand.margin.toString());
  const [adBudget, setAdBudget] = useState(currentBrand.adBudget.toString());
  const [weeklyRevenue, setWeeklyRevenue] = useState(currentBrand.weeklyGoals.revenue.toString());
  const [weeklyProfit, setWeeklyProfit] = useState(currentBrand.weeklyGoals.profit.toString());
  const [weeklyRoas, setWeeklyRoas] = useState(currentBrand.weeklyGoals.roas.toString());
  const [monthlyRevenue, setMonthlyRevenue] = useState(currentBrand.monthlyGoals.revenue.toString());
  const [monthlyProfit, setMonthlyProfit] = useState(currentBrand.monthlyGoals.profit.toString());
  const [monthlyRoas, setMonthlyRoas] = useState(currentBrand.monthlyGoals.roas.toString());
  const updateBrand = useUpdateBrand();

  useEffect(() => {
    if (open) {
      setMargin(currentBrand.margin.toString());
      setAdBudget(currentBrand.adBudget.toString());
      setWeeklyRevenue(currentBrand.weeklyGoals.revenue.toString());
      setWeeklyProfit(currentBrand.weeklyGoals.profit.toString());
      setWeeklyRoas(currentBrand.weeklyGoals.roas.toString());
      setMonthlyRevenue(currentBrand.monthlyGoals.revenue.toString());
      setMonthlyProfit(currentBrand.monthlyGoals.profit.toString());
      setMonthlyRoas(currentBrand.monthlyGoals.roas.toString());
    }
  }, [open, currentBrand]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profile: BrandProfile = {
      ...currentBrand,
      margin: parseFloat(margin) || 0,
      adBudget: parseFloat(adBudget) || 0,
      weeklyGoals: {
        ...currentBrand.weeklyGoals,
        revenue: parseFloat(weeklyRevenue) || 0,
        profit: parseFloat(weeklyProfit) || 0,
        roas: parseFloat(weeklyRoas) || 0,
      },
      monthlyGoals: {
        ...currentBrand.monthlyGoals,
        revenue: parseFloat(monthlyRevenue) || 0,
        profit: parseFloat(monthlyProfit) || 0,
        roas: parseFloat(monthlyRoas) || 0,
      },
    };
    updateBrand.mutate(
      { name: brandName, profile },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Brand: {brandName}</DialogTitle>
          <DialogDescription>Update brand details and goals</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs defaultValue="basic">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="weekly">Weekly Goals</TabsTrigger>
              <TabsTrigger value="monthly">Monthly Goals</TabsTrigger>
            </TabsList>
            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="margin">Target Margin (%)</Label>
                <Input
                  id="margin"
                  type="number"
                  step="0.01"
                  value={margin}
                  onChange={(e) => setMargin(e.target.value)}
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
                />
              </div>
            </TabsContent>
            <TabsContent value="weekly" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="weeklyRevenue">Revenue ($)</Label>
                <Input
                  id="weeklyRevenue"
                  type="number"
                  step="0.01"
                  value={weeklyRevenue}
                  onChange={(e) => setWeeklyRevenue(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weeklyProfit">Profit ($)</Label>
                <Input
                  id="weeklyProfit"
                  type="number"
                  step="0.01"
                  value={weeklyProfit}
                  onChange={(e) => setWeeklyProfit(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weeklyRoas">ROAS</Label>
                <Input
                  id="weeklyRoas"
                  type="number"
                  step="0.01"
                  value={weeklyRoas}
                  onChange={(e) => setWeeklyRoas(e.target.value)}
                />
              </div>
            </TabsContent>
            <TabsContent value="monthly" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyRevenue">Revenue ($)</Label>
                <Input
                  id="monthlyRevenue"
                  type="number"
                  step="0.01"
                  value={monthlyRevenue}
                  onChange={(e) => setMonthlyRevenue(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyProfit">Profit ($)</Label>
                <Input
                  id="monthlyProfit"
                  type="number"
                  step="0.01"
                  value={monthlyProfit}
                  onChange={(e) => setMonthlyProfit(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyRoas">ROAS</Label>
                <Input
                  id="monthlyRoas"
                  type="number"
                  step="0.01"
                  value={monthlyRoas}
                  onChange={(e) => setMonthlyRoas(e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={updateBrand.isPending} className="flex-1">
              {updateBrand.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
