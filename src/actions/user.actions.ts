'use server';

import dbConnect from '@/lib/db';
import User, { IUser } from '@/models/User';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { simulateLatency } from '@/lib/utils';

export async function registerUser(formData: FormData) {
  await simulateLatency();
  await dbConnect();

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const age = formData.get('age') ? parseInt(formData.get('age') as string) : undefined;

  if (!name || !email || !password) {
    return { error: 'Missing required fields' };
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: 'Email already exists' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      age,
      role: 'client',
    });

    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'Failed to register user' };
  }
}

export async function updateUser(userId: string, data: Partial<IUser>) {
  await simulateLatency();
  await dbConnect();
  try {
    // Prevent role update via this action for security
    const { role, password, ...updateData } = data as any;

    await User.findByIdAndUpdate(userId, updateData);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Update user error:', error);
    return { error: 'Failed to update profile' };
  }
}

export async function getCoaches() {
  await simulateLatency();
  await dbConnect();
  try {
    const coaches = await User.find({ role: 'coach' }).select('-password').lean();
    // Convert ObjectId to string for client components
    return JSON.parse(JSON.stringify(coaches));
  } catch (error) {
    console.error('Get coaches error:', error);
    return [];
  }
}

export async function deleteUser(userId: string) {
  await simulateLatency();
  await dbConnect();
  try {
    await User.findByIdAndDelete(userId);
    revalidatePath('/dashboard/admin');
    return { success: true };
  } catch (error) {
    console.error('Delete user error:', error);
    return { error: 'Failed to delete user' };
  }
}

export async function createCoach(formData: FormData) {
  await simulateLatency();
  await dbConnect();
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) {
    return { error: 'Missing required fields' };
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: 'Email already exists' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'coach',
    });

    revalidatePath('/dashboard/admin');
    return { success: true };
  } catch (error) {
    console.error('Create coach error:', error);
    return { error: 'Failed to create coach' };
  }
}

export async function getAllUsers() {
  await simulateLatency();
  await dbConnect();
  try {
    const users = await User.find({}).select('-password').lean();
    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    console.error('Get all users error:', error);
    return [];
  }
}

export async function toggleUserStatus(userId: string) {
  await simulateLatency();
  await dbConnect();
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { error: 'User not found' };
    }

    user.isActive = !user.isActive;
    await user.save();

    revalidatePath('/dashboard/admin');
    return { success: true, isActive: user.isActive };
  } catch (error) {
    console.error('Toggle user status error:', error);
    return { error: 'Failed to toggle user status' };
  }
}

export async function getUserStats() {
  await simulateLatency();
  await dbConnect();
  try {
    const stats = {
      total: await User.countDocuments({ isActive: true }),
      coaches: await User.countDocuments({ role: 'coach', isActive: true }),
      clients: await User.countDocuments({ role: 'client', isActive: true }),
      admins: await User.countDocuments({ role: 'admin', isActive: true }),
      inactive: await User.countDocuments({ isActive: false }),
    };
    return { success: true, data: stats };
  } catch (error) {
    console.error('Get user stats error:', error);
    return { error: 'Failed to get user stats' };
  }
}

export async function getCoachesList() {
  await simulateLatency();
  await dbConnect();
  try {
    const coaches = await User.aggregate([
      { $match: { role: 'coach', isActive: true } },
      {
        $lookup: {
          from: 'programs',
          localField: '_id',
          foreignField: 'coachId',
          as: 'programs',
        },
      },
      {
        $addFields: {
          programCount: { $size: '$programs' },
        },
      },
      {
        $project: {
          password: 0,
          programs: 0,
        },
      },
    ]);
    return JSON.parse(JSON.stringify(coaches));
  } catch (error) {
    console.error('Get coaches list error:', error);
    return [];
  }
}

export async function updateUserByAdmin(userId: string, data: Partial<IUser>) {
  await simulateLatency();
  await dbConnect();
  try {
    const { password, ...updateData } = data as any;

    await User.findByIdAndUpdate(userId, updateData);
    revalidatePath('/dashboard/admin');
    return { success: true };
  } catch (error) {
    console.error('Update user by admin error:', error);
    return { error: 'Failed to update user' };
  }
}

export async function deleteOwnAccount(userId: string) {
  await simulateLatency();
  await dbConnect();
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { error: 'User not found' };
    }
    
    // Prevent admin from deleting their own account via this action
    if (user.role === 'admin') {
      return { error: 'Admin accounts cannot be deleted this way' };
    }
    
    // Delete related enrollments
    const Enrollment = (await import('@/models/Enrollment')).default;
    await Enrollment.deleteMany({ studentId: userId });
    
    // If coach, delete their programs and related enrollments
    if (user.role === 'coach') {
      const Program = (await import('@/models/Program')).default;
      const coachPrograms = await Program.find({ coachId: userId }).select('_id');
      const programIds = coachPrograms.map((p: any) => p._id);
      
      // Delete enrollments in coach's programs
      await Enrollment.deleteMany({ programId: { $in: programIds } });
      
      // Delete coach's programs
      await Program.deleteMany({ coachId: userId });
    }
    
    await User.findByIdAndDelete(userId);
    return { success: true };
  } catch (error) {
    console.error('Delete own account error:', error);
    return { error: 'Failed to delete account' };
  }
}
