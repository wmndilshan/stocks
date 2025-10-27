import { auth } from '@/lib/better-auth/auth';
import { getWatchlist } from '@/lib/actions/watchlist.actions';
import WatchlistTable from '@/components/WatchlistTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default async function WatchlistPage() {
  const session = await auth.api.getSession({
    headers: await import('next/headers').then(m => m.headers())
  });

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-lg text-muted-foreground">Please sign in to view your watchlist</p>
      </div>
    );
  }

  const watchlist = await getWatchlist(session.user.id);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Watchlist</h1>
          <p className="text-muted-foreground">
            Keep track of stocks you're interested in
          </p>
        </div>
        <Link href="/search">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Stocks
          </Button>
        </Link>
      </div>

      <WatchlistTable watchlist={watchlist} userId={session.user.id} />
    </div>
  );
}
