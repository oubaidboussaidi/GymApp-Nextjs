'use server';

import dbConnect from '@/lib/db';
import User, { IUser } from '@/models/User';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

export async function registerUser(formData: FormData) {
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
    await dbConnect();
    try {
        const users = await User.find({}).select('-password').lean();
        return JSON.parse(JSON.stringify(users));
    } catch (error) {
        console.error('Get all users error:', error);
        return [];
    }
}
