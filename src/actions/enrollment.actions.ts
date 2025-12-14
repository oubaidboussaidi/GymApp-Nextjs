'use server';

import dbConnect from '@/lib/db';
import Enrollment from '@/models/Enrollment';
import { revalidatePath } from 'next/cache';

export async function enrollUser(studentId: string, programId: string) {
  await dbConnect();
  try {
    const existing = await Enrollment.findOne({ studentId, programId });
    if (existing) {
      return { error: 'Already enrolled' };
    }

    await Enrollment.create({ studentId, programId });
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Enrollment error:', error);
    return { error: 'Failed to enroll' };
  }
}

export async function getStudentEnrollments(studentId: string) {
  await dbConnect();
  try {
    const enrollments = await Enrollment.find({ studentId })
      .populate({
        path: 'programId',
        populate: { path: 'coachId', select: 'name' }
      })
      .lean();
    return JSON.parse(JSON.stringify(enrollments));
  } catch (error) {
    console.error('Get student enrollments error:', error);
    return [];
  }
}

export async function getProgramStudents(programId: string) {
  await dbConnect();
  try {
    const enrollments = await Enrollment.find({ programId })
      .populate('studentId', 'name email image physicalStats')
      .lean();
    return JSON.parse(JSON.stringify(enrollments));
  } catch (error) {
    console.error('Get program students error:', error);
    return [];
  }
}

export async function kickStudent(enrollmentId: string) {
  await dbConnect();
  try {
    await Enrollment.findByIdAndDelete(enrollmentId);
    revalidatePath('/dashboard/coach');
    return { success: true };
  } catch (error) {
    console.error('Kick student error:', error);
    return { error: 'Failed to remove student' };
  }
}
