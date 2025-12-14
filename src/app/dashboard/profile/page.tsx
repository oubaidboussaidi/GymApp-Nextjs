import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import ProfileForm from './profile-form';

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Profile Settings</h2>
      <ProfileForm userId={session.user.id} />
    </div>
  );
}
