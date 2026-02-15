import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Platform } from '../../backend';
import type { Campaign } from '../../backend';

interface CampaignTableProps {
  campaigns: Campaign[];
}

type SortField = 'name' | 'spend' | 'revenue' | 'roas';
type SortDirection = 'asc' | 'desc';

export function CampaignTable({ campaigns }: CampaignTableProps) {
  const [sortField, setSortField] = useState<SortField>('roas');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedCampaigns = [...campaigns].sort((a, b) => {
    let aVal: number | string = 0;
    let bVal: number | string = 0;

    switch (sortField) {
      case 'name':
        aVal = a.name;
        bVal = b.name;
        break;
      case 'spend':
        aVal = a.spend;
        bVal = b.spend;
        break;
      case 'revenue':
        aVal = a.revenue;
        bVal = b.revenue;
        break;
      case 'roas':
        aVal = a.roas;
        bVal = b.roas;
        break;
    }

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }

    return sortDirection === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
  });

  const getPlatformLabel = (campaign: Campaign): string => {
    if (campaign.platform === Platform.meta) return 'Meta';
    if (campaign.platform === Platform.google) return 'Google';
    return 'Other';
  };

  const isUnderperforming = (roas: number) => roas < 2.0;

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
              Campaign {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead>Platform</TableHead>
            <TableHead className="cursor-pointer text-right" onClick={() => handleSort('spend')}>
              Spend {sortField === 'spend' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead className="cursor-pointer text-right" onClick={() => handleSort('revenue')}>
              Revenue {sortField === 'revenue' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead className="cursor-pointer text-right" onClick={() => handleSort('roas')}>
              ROAS {sortField === 'roas' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCampaigns.map((campaign) => (
            <TableRow key={campaign.id.toString()} className={isUnderperforming(campaign.roas) ? 'bg-destructive/5' : ''}>
              <TableCell className="font-medium">{campaign.name}</TableCell>
              <TableCell>
                <Badge variant="outline">{getPlatformLabel(campaign)}</Badge>
              </TableCell>
              <TableCell className="text-right">${campaign.spend.toLocaleString()}</TableCell>
              <TableCell className="text-right">${campaign.revenue.toLocaleString()}</TableCell>
              <TableCell className="text-right">
                <span className={isUnderperforming(campaign.roas) ? 'font-semibold text-destructive' : 'font-semibold'}>
                  {campaign.roas.toFixed(2)}x
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
