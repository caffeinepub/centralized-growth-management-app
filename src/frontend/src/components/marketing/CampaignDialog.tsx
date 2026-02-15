import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddCampaign } from '../../hooks/useQueries';
import { Loader2 } from 'lucide-react';
import { Platform } from '../../backend';
import type { Campaign } from '../../backend';

interface CampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CampaignDialog({ open, onOpenChange }: CampaignDialogProps) {
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState<Platform>(Platform.meta);
  const [spend, setSpend] = useState('');
  const [revenue, setRevenue] = useState('');
  const addCampaign = useAddCampaign();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const spendNum = parseFloat(spend) || 0;
      const revenueNum = parseFloat(revenue) || 0;
      const roas = spendNum > 0 ? revenueNum / spendNum : 0;

      const campaign: Campaign = {
        id: BigInt(0),
        name: name.trim(),
        platform,
        spend: spendNum,
        revenue: revenueNum,
        roas,
        startDate: BigInt(Date.now() * 1000000),
        endDate: undefined,
        creativeLinks: [],
      };

      addCampaign.mutate(campaign, {
        onSuccess: () => {
          setName('');
          setSpend('');
          setRevenue('');
          onOpenChange(false);
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Campaign</DialogTitle>
          <DialogDescription>Track a new advertising campaign</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Campaign Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Summer Sale 2026"
              required
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="platform">Platform *</Label>
            <Select
              value={platform}
              onValueChange={(value) => setPlatform(value as Platform)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Platform.meta}>Meta Ads</SelectItem>
                <SelectItem value={Platform.google}>Google Ads</SelectItem>
                <SelectItem value={Platform.other}>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="spend">Spend ($)</Label>
              <Input
                id="spend"
                type="number"
                step="0.01"
                value={spend}
                onChange={(e) => setSpend(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="revenue">Revenue ($)</Label>
              <Input
                id="revenue"
                type="number"
                step="0.01"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || addCampaign.isPending} className="flex-1">
              {addCampaign.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Campaign'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
