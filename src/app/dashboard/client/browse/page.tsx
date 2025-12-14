import { getPrograms } from '@/actions/program.actions';
import { getStudentEnrollments } from '@/actions/enrollment.actions';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

// Client component for interactivity would be better, but let's try server component with search params first
// or a client component wrapper. For simplicity in this "school project", 
// let's make a Client Component for the search/filter part, or just use a form for server-side search.
// Let's go with a Client Component for the whole page content to handle state easily.

import BrowseProgramsClient from './browse-client';

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: { q?: string; level?: string };
}) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const programs = await getPrograms(searchParams.q, searchParams.level);

  const enrollments = await getStudentEnrollments(session.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Browse Programs</h2>
        <p className="text-muted-foreground">Find the perfect workout plan for you.</p>
      </div>
      
      <BrowseProgramsClient programs={JSON.parse(JSON.stringify(programs))} userId={session.user.id} enrollments={JSON.parse(JSON.stringify(enrollments))} />
    </div>
  );
}
