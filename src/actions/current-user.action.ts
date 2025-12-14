'use server';

import dbConnect from '@/lib/db';
import User from '@/models/User';
import { auth } from '@/auth';
import { simulateLatency } from '@/lib/utils';

export async function getCurrentUser() {
  await simulateLatency();
  const session = await auth();
  if (!session?.user) return { success: false, error: 'Not authenticated' };

  await dbConnect();
  try {
    const user = await User.findById(session.user.id).select('-password').lean();
    return { success: true, data: JSON.parse(JSON.stringify(user)) };
  } catch (error) {
    console.error('Error fetching current user:', error);
    return { success: false, error: 'Failed to fetch user' };
  }
}
