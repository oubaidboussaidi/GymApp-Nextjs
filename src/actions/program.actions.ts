'use server';

import dbConnect from '@/lib/db';
import Program, { IProgram } from '@/models/Program';
import { revalidatePath } from 'next/cache';

export async function createProgram(data: Partial<IProgram>) {
  await dbConnect();
  try {
    await Program.create(data);
    revalidatePath('/dashboard/coach');
    return { success: true };
  } catch (error) {
    console.error('Create program error:', error);
    return { error: 'Failed to create program' };
  }
}

export async function getPrograms(query?: string, level?: string) {
  await dbConnect();
  try {
    const filter: any = {};
    if (query) {
      filter.title = { $regex: query, $options: 'i' };
    }
    if (level && level !== 'All') {
      filter.level = level;
    }

    const programs = await Program.find(filter).populate('coachId', 'name image').lean();
    return JSON.parse(JSON.stringify(programs));
  } catch (error) {
    console.error('Get programs error:', error);
    return [];
  }
}

export async function getCoachPrograms(coachId: string) {
  await dbConnect();
  try {
    const programs = await Program.find({ coachId }).lean();
    return JSON.parse(JSON.stringify(programs));
  } catch (error) {
    console.error('Get coach programs error:', error);
    return [];
  }
}

export async function deleteProgram(programId: string) {
  await dbConnect();
  try {
    await Program.findByIdAndDelete(programId);
    revalidatePath('/dashboard/coach');
    return { success: true };
  } catch (error) {
    console.error('Delete program error:', error);
    return { error: 'Failed to delete program' };
  }
}

export async function getProgramById(programId: string) {
    await dbConnect();
    try {
        const program = await Program.findById(programId).populate('coachId', 'name image').lean();
        return JSON.parse(JSON.stringify(program));
    } catch (error) {
        console.error('Get program by id error:', error);
        return null;
    }
}
