import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import BrowseProgramsClient from './browse-client';
import { getStudentEnrollments } from '@/actions/enrollment.actions';

export default async function BrowsePage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  // We can still fetch initial enrollments server-side as it's fast/critical, 
  // or move it to client too. For now, let's keep it mixed or move all to client.
  // The user wants "Refactor Fetching: Move your data fetching... into React Query hooks".
  // So I should move enrollments fetching to client too, or pass it as initial data.
  // But to demonstrate the loading state, client fetching is best.
  
  // However, we need the userId for the client component.
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Browse Programs</h1>
        <p className="text-muted-foreground">Find the perfect workout plan for you.</p>
      </div>
      
      <BrowseProgramsClient userId={session.user.id} />
    </div>
  );
}
