import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import ProfileForm from './profile-form';
import User from '@/models/User';
import dbConnect from '@/lib/db';

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  await dbConnect();
  const user = await User.findById(session.user.id).lean();
  
  if (!user) redirect('/login');

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Profile Settings</h2>
      <ProfileForm user={JSON.parse(JSON.stringify(user))} />
    </div>
  );
}
