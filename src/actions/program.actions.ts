'use server';

import dbConnect from '@/lib/db';
import Program, { IProgram } from '@/models/Program';
import { revalidatePath } from 'next/cache';
import { simulateLatency } from '@/lib/utils';

export async function createProgram(data: Partial<IProgram>) {
  await simulateLatency();
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
  await simulateLatency();
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
  await simulateLatency();
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
  await simulateLatency();
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
  await simulateLatency();
  await dbConnect();
  try {
    const program = await Program.findById(programId).populate('coachId', 'name image').lean();
    return JSON.parse(JSON.stringify(program));
  } catch (error) {
    console.error('Get program by id error:', error);
    return null;
  }
}

export async function updateProgram(programId: string, data: Partial<IProgram>) {
  await simulateLatency();
  await dbConnect();
  try {
    await Program.findByIdAndUpdate(programId, data);
    revalidatePath('/dashboard/coach');
    revalidatePath('/dashboard/client/browse');
    return { success: true };
  } catch (error) {
    console.error('Update program error:', error);
    return { error: 'Failed to update program' };
  }
}

export async function getAllPrograms() {
  await simulateLatency();
  await dbConnect();
  try {
    const programs = await Program.find().populate('coachId', 'name').lean();
    return JSON.parse(JSON.stringify(programs));
  } catch (error) {
    console.error('Get all programs error:', error);
    return [];
  }
}

export async function getTopPrograms(limit: number = 5) {
  await simulateLatency();
  await dbConnect();
  try {
    const programs = await Program.find()
      .sort({ totalEnrollments: -1, averageRating: -1 })
      .limit(limit)
      .populate('coachId', 'name image')
      .lean();
    return JSON.parse(JSON.stringify(programs));
  } catch (error) {
    console.error('Get top programs error:', error);
    return [];
  }
}

export async function searchPrograms(filters: {
  query?: string;
  level?: string;
  minRating?: number;
  tags?: string[];
  sortBy?: string;
}) {
  await simulateLatency();
  await dbConnect();
  try {
    const { query, level, minRating, tags, sortBy } = filters;
    const filter: any = {};

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ];
    }

    if (level && level !== 'All') {
      filter.level = level;
    }

    if (minRating) {
      filter.averageRating = { $gte: minRating };
    }

    if (tags && tags.length > 0) {
      filter.tags = { $in: tags };
    }

    let sortOption: any = {};
    switch (sortBy) {
      case 'popular':
        sortOption = { totalEnrollments: -1 };
        break;
      case 'rating':
        sortOption = { averageRating: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const programs = await Program.find(filter)
      .sort(sortOption)
      .populate('coachId', 'name image')
      .lean();

    return JSON.parse(JSON.stringify(programs));
  } catch (error) {
    console.error('Search programs error:', error);
    return [];
  }
}

export async function rateProgram(programId: string, userId: string, rating: number, review?: string) {
  await simulateLatency();
  await dbConnect();
  try {
    const ProgramRating = (await import('@/models/ProgramRating')).default;


    await ProgramRating.findOneAndUpdate(
      { programId, userId },
      { rating, review },
      { upsert: true, new: true }
    );


    const ratings = await ProgramRating.find({ programId });
    const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

    await Program.findByIdAndUpdate(programId, { averageRating: avgRating });

    revalidatePath('/dashboard/client/browse');
    revalidatePath('/dashboard/coach');
    return { success: true };
  } catch (error) {
    console.error('Rate program error:', error);
    return { error: 'Failed to rate program' };
  }
}

export async function getProgramRatings(programId: string) {
  await simulateLatency();
  await dbConnect();
  try {
    const ProgramRating = (await import('@/models/ProgramRating')).default;
    const ratings = await ProgramRating.find({ programId })
      .populate('userId', 'name image')
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(ratings));
  } catch (error) {
    console.error('Get program ratings error:', error);
    return [];
  }
}

export async function getProgramAnalytics(programId: string) {
  await simulateLatency();
  await dbConnect();
  try {
    const Enrollment = (await import('@/models/Enrollment')).default;

    const [program, enrollments] = await Promise.all([
      Program.findById(programId).lean(),
      Enrollment.find({ programId }).populate('studentId', 'name').lean(),
    ]);

    if (!program) {
      return { error: 'Program not found' };
    }

    const activeStudents = enrollments.filter((e) => e.status === 'active').length;
    const completedStudents = enrollments.filter((e) => e.status === 'completed').length;
    const avgProgress = enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length || 0;

    return {
      success: true,
      data: {
        program: JSON.parse(JSON.stringify(program)),
        totalStudents: enrollments.length,
        activeStudents,
        completedStudents,
        avgProgress,
        enrollments: JSON.parse(JSON.stringify(enrollments)),
      },
    };
  } catch (error) {
    console.error('Get program analytics error:', error);
    return { error: 'Failed to get program analytics' };
  }
}

