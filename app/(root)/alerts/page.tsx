import { auth } from '@/lib/better-auth/auth';
import { getUserAlerts } from '@/lib/actions/alert.actions';
import AlertsTable from '@/components/AlertsTable';
import AddAlertDialog from '@/components/AddAlertDialog';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';

export default async function AlertsPage() {
  const session = await auth.api.getSession({
    headers: await import('next/headers').then(m => m.headers())
  });

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-lg text-muted-foreground">Please sign in to view your alerts</p>
      </div>
    );
  }

  const alerts = await getUserAlerts(session.user.id);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Price Alerts</h1>
          <p className="text-muted-foreground">
            Get notified when stocks reach your target prices
          </p>
        </div>
        <AddAlertDialog>
          <Button>
            <Bell className="h-4 w-4 mr-2" />
            Create Alert
          </Button>
        </AddAlertDialog>
      </div>

      <AlertsTable alerts={alerts} userId={session.user.id} />
    </div>
  );
}
