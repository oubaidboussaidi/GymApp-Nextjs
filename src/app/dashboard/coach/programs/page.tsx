import { auth } from '@/auth';
import CreateProgramForm from '../create-program-form';
import CoachProgramsClient from './coach-programs-client';

export default async function CoachProgramsPage() {
  const session = await auth();
  const user = session?.user;
  
  if (!user) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Programs</h2>
          <p className="text-muted-foreground">Create and manage your training programs.</p>
        </div>
        <CreateProgramForm coachId={user.id} />
      </div>

      <CoachProgramsClient userId={user.id} />
    </div>
  );
}
