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

    // Increment program enrollment count
    const Program = (await import('@/models/Program')).default;
    await Program.findByIdAndUpdate(programId, {
      $inc: { totalEnrollments: 1 },
    });

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

export async function updateProgress(enrollmentId: string, progress: number, completedExercises?: string[]) {
  await dbConnect();
  try {
    const updateData: any = {
      progress,
      lastActivityDate: new Date(),
    };

    if (completedExercises) {
      updateData.completedExercises = completedExercises;
    }

    if (progress >= 100) {
      updateData.status = 'completed';
    }

    await Enrollment.findByIdAndUpdate(enrollmentId, updateData);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Update progress error:', error);
    return { error: 'Failed to update progress' };
  }
}

export async function getCoachStudents(coachId: string) {
  await dbConnect();
  try {
    const Program = (await import('@/models/Program')).default;

    const programs = await Program.find({ coachId }).select('_id').lean();
    const programIds = programs.map((p) => p._id);

    const enrollments = await Enrollment.find({ programId: { $in: programIds } })
      .populate('studentId', 'name email image physicalStats age')
      .populate('programId', 'title level')
      .sort({ lastActivityDate: -1 })
      .lean();

    return JSON.parse(JSON.stringify(enrollments));
  } catch (error) {
    console.error('Get coach students error:', error);
    return [];
  }
}

export async function getStudentProgress(studentId: string, programId?: string) {
  await dbConnect();
  try {
    const filter: any = { studentId };
    if (programId) {
      filter.programId = programId;
    }

    const enrollments = await Enrollment.find(filter)
      .populate('programId', 'title exercises')
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(enrollments));
  } catch (error) {
    console.error('Get student progress error:', error);
    return [];
  }
}

export async function markProgramComplete(enrollmentId: string) {
  await dbConnect();
  try {
    await Enrollment.findByIdAndUpdate(enrollmentId, {
      status: 'completed',
      progress: 100,
      lastActivityDate: new Date(),
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Mark program complete error:', error);
    return { error: 'Failed to mark program as complete' };
  }
}

export async function incrementProgramEnrollment(programId: string) {
  await dbConnect();
  try {
    const Program = (await import('@/models/Program')).default;
    await Program.findByIdAndUpdate(programId, {
      $inc: { totalEnrollments: 1 },
    });
    return { success: true };
  } catch (error) {
    console.error('Increment enrollment error:', error);
    return { error: 'Failed to update enrollment count' };
  }
}

