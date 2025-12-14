'use server';

import dbConnect from '@/lib/db';
import User from '@/models/User';
import { simulateLatency } from '@/lib/utils';

export async function getUserProfile(userId: string) {
  await simulateLatency();
  await dbConnect();
  try {
    const user = await User.findById(userId).select('-password').lean();
    return { success: true, data: JSON.parse(JSON.stringify(user)) };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { success: false, error: 'Failed to fetch profile' };
  }
}
