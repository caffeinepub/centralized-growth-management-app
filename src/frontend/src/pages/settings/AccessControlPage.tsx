import { useState } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useActor } from '../../hooks/useActor';
import { Principal } from '@dfinity/principal';
import { UserRole } from '../../backend';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { RequireRole } from '../../components/auth/RequireRole';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AccessControlPage() {
  const [principalText, setPrincipalText] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { actor } = useActor();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    
    if (!actor) {
      setMessage({ type: 'error', text: 'Actor not available' });
      return;
    }

    try {
      setIsSubmitting(true);
      const principal = Principal.fromText(principalText.trim());
      await actor.assignRole(principal, role);
      setMessage({ type: 'success', text: 'Role assigned successfully' });
      setPrincipalText('');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to assign role' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RequireRole role="Admin">
      <div>
        <PageHeader
          title="Access Control"
          description="Manage user roles and permissions"
          actions={
            <Button variant="outline" onClick={() => navigate({ to: '/settings' })}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Settings
            </Button>
          }
        />
        <div className="p-6">
          <div className="mx-auto max-w-2xl">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Assign Role to User</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="principal">User Principal ID *</Label>
                  <Input
                    id="principal"
                    value={principalText}
                    onChange={(e) => setPrincipalText(e.target.value)}
                    placeholder="Enter principal ID"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    The unique identifier for the user (e.g., from Internet Identity)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Select
                    value={role}
                    onValueChange={(value) => setRole(value as UserRole)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UserRole.admin}>Admin - Full access</SelectItem>
                      <SelectItem value={UserRole.user}>Editor - Can create and edit</SelectItem>
                      <SelectItem value={UserRole.guest}>Viewer - Read-only access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {message && (
                  <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
                    <AlertDescription>{message.text}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" disabled={!principalText.trim() || isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Assigning...
                    </>
                  ) : (
                    'Assign Role'
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </RequireRole>
  );
}
