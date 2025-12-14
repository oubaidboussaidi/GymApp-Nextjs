'use server';

import dbConnect from '@/lib/db';
import User from '@/models/User';
import Program from '@/models/Program';
import Enrollment from '@/models/Enrollment';
import ProgramRating from '@/models/ProgramRating';

export async function getAdminAnalytics() {
    try {
        await dbConnect();

        const [
            totalUsers,
            totalCoaches,
            totalClients,
            totalPrograms,
            totalEnrollments,
            activeEnrollments,
            recentUsers,
        ] = await Promise.all([
            User.countDocuments({ isActive: true }),
            User.countDocuments({ role: 'coach', isActive: true }),
            User.countDocuments({ role: 'client', isActive: true }),
            Program.countDocuments(),
            Enrollment.countDocuments(),
            Enrollment.countDocuments({ status: 'active' }),
            User.find({ isActive: true })
                .sort({ createdAt: -1 })
                .limit(7)
                .select('createdAt role')
                .lean(),
        ]);

        // Users by role
        const usersByRole = {
            admin: await User.countDocuments({ role: 'admin', isActive: true }),
            coach: totalCoaches,
            client: totalClients,
        };

        // Top programs by enrollment
        const topPrograms = await Program.find()
            .sort({ totalEnrollments: -1 })
            .limit(5)
            .populate('coachId', 'name')
            .lean();

        // Programs per coach
        const coachPrograms = await Program.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'coachId',
                    foreignField: '_id',
                    as: 'coach',
                },
            },
            { $unwind: '$coach' },
            {
                $group: {
                    _id: '$coachId',
                    name: { $first: '$coach.name' },
                    programCount: { $sum: 1 },
                },
            },
            { $sort: { programCount: -1 } },
            { $limit: 10 },
        ]);

        // Average rating
        const ratingStats = await ProgramRating.aggregate([
            {
                $group: {
                    _id: null,
                    avgRating: { $avg: '$rating' },
                    totalRatings: { $sum: 1 },
                },
            },
        ]);

        const avgSystemRating = ratingStats[0]?.avgRating || 0;

        return {
            success: true,
            data: {
                overview: {
                    totalUsers,
                    totalCoaches,
                    totalClients,
                    totalPrograms,
                    totalEnrollments,
                    activeEnrollments,
                    avgSystemRating,
                },
                usersByRole,
                topPrograms: JSON.parse(JSON.stringify(topPrograms)),
                coachPrograms,
                recentUsers: JSON.parse(JSON.stringify(recentUsers)),
            },
        };
    } catch (error) {
        console.error('Error fetching admin analytics:', error);
        return { success: false, error: 'Failed to fetch admin analytics' };
    }
}

export async function getCoachAnalytics(coachId: string) {
    try {
        await dbConnect();

        const programs = await Program.find({ coachId }).lean();
        const programIds = programs.map((p) => p._id);

        const [
            totalPrograms,
            totalEnrollments,
            activeStudents,
            programRatings,
        ] = await Promise.all([
            Program.countDocuments({ coachId }),
            Enrollment.countDocuments({ programId: { $in: programIds } }),
            Enrollment.distinct('studentId', {
                programId: { $in: programIds },
                status: 'active',
            }),
            ProgramRating.find({ programId: { $in: programIds } })
                .populate('userId', 'name')
                .lean(),
        ]);

        // Students per program
        const studentsPerProgram = await Enrollment.aggregate([
            { $match: { programId: { $in: programIds } } },
            {
                $group: {
                    _id: '$programId',
                    studentCount: { $sum: 1 },
                },
            },
        ]);

        const programsWithStats = programs.map((program) => {
            const stats = studentsPerProgram.find(
                (s) => s._id.toString() === program._id.toString()
            );
            return {
                ...program,
                studentCount: stats?.studentCount || 0,
            };
        });

        return {
            success: true,
            data: {
                overview: {
                    totalPrograms,
                    totalEnrollments,
                    totalActiveStudents: activeStudents.length,
                    avgRating: programs.reduce((sum, p) => sum + (p.averageRating || 0), 0) / programs.length || 0,
                },
                programs: JSON.parse(JSON.stringify(programsWithStats)),
                ratings: JSON.parse(JSON.stringify(programRatings)),
            },
        };
    } catch (error) {
        console.error('Error fetching coach analytics:', error);
        return { success: false, error: 'Failed to fetch coach analytics' };
    }
}

export async function getClientAnalytics(clientId: string) {
    try {
        await dbConnect();

        const [user, enrollments] = await Promise.all([
            User.findById(clientId).lean(),
            Enrollment.find({ studentId: clientId })
                .populate('programId')
                .lean(),
        ]);

        if (!user) {
            return { success: false, error: 'User not found' };
        }

        const totalPrograms = enrollments.length;
        const completedPrograms = enrollments.filter((e) => e.status === 'completed').length;
        const avgProgress = enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / totalPrograms || 0;

        return {
            success: true,
            data: {
                totalPrograms,
                completedPrograms,
                activePrograms: totalPrograms - completedPrograms,
                avgProgress,
                enrollments: JSON.parse(JSON.stringify(enrollments)),
            },
        };
    } catch (error) {
        console.error('Error fetching client analytics:', error);
        return { success: false, error: 'Failed to fetch client analytics' };
    }
}
