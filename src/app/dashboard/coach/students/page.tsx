import { auth } from '@/auth';
import CoachStudentsClient from './coach-students-client';

export default async function ManageStudentsPage() {
  const session = await auth();
  const user = session?.user;
  
  if (!user) return null;

  return <CoachStudentsClient userId={user.id} />;
}
