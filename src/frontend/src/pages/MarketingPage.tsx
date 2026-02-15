import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { useListCampaigns } from '../hooks/useQueries';
import { Megaphone, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CampaignDialog } from '../components/marketing/CampaignDialog';
import { CampaignTable } from '../components/marketing/CampaignTable';
import { useUserRole } from '../hooks/useUserRole';

export default function MarketingPage() {
  const { data: campaigns, isLoading } = useListCampaigns();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { hasPermission } = useUserRole();

  const canEdit = hasPermission('Editor');

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Marketing" description="Track and optimize your ad campaigns" />
        <div className="p-6">
          <div className="h-64 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    );
  }

  if (!campaigns || campaigns.length === 0) {
    return (
      <div>
        <PageHeader title="Marketing" description="Track and optimize your ad campaigns" />
        <EmptyState
          icon={Megaphone}
          title="No campaigns yet"
          description="Start tracking your Meta and Google Ads campaigns to analyze performance and optimize ROAS."
          action={
            canEdit && (
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Campaign
              </Button>
            )
          }
        />
        {canEdit && <CampaignDialog open={dialogOpen} onOpenChange={setDialogOpen} />}
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Marketing"
        description={`${campaigns.length} campaign${campaigns.length !== 1 ? 's' : ''} tracked`}
        actions={
          canEdit && (
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Campaign
            </Button>
          )
        }
      />
      <div className="p-6">
        <CampaignTable campaigns={campaigns} />
      </div>
      {canEdit && <CampaignDialog open={dialogOpen} onOpenChange={setDialogOpen} />}
    </div>
  );
}
