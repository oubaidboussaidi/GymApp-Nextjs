'use server';

import dbConnect from '@/lib/db';
import StatsHistory from '@/models/StatsHistory';
import User from '@/models/User';
import { revalidatePath } from 'next/cache';

export async function recordStatsHistory(userId: string, stats: {
    weight?: number;
    squat?: number;
    bench?: number;
}) {
    try {
        await dbConnect();

        const history = await StatsHistory.create({
            userId,
            ...stats,
            recordedAt: new Date(),
        });

        revalidatePath('/dashboard/client');
        revalidatePath('/dashboard/client/stats');

        return { success: true, data: JSON.parse(JSON.stringify(history)) };
    } catch (error) {
        console.error('Error recording stats history:', error);
        return { success: false, error: 'Failed to record stats history' };
    }
}

export async function getStatsHistory(userId: string, days: number = 30) {
    try {
        await dbConnect();

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const history = await StatsHistory.find({
            userId,
            recordedAt: { $gte: startDate },
        })
            .sort({ recordedAt: 1 })
            .lean();

        return { success: true, data: JSON.parse(JSON.stringify(history)) };
    } catch (error) {
        console.error('Error fetching stats history:', error);
        return { success: false, error: 'Failed to fetch stats history' };
    }
}

export async function getStatsAnalytics(userId: string) {
    try {
        await dbConnect();

        const user = await User.findById(userId).lean();
        const history = await StatsHistory.find({ userId })
            .sort({ recordedAt: -1 })
            .limit(30)
            .lean();

        if (!user) {
            return { success: false, error: 'User not found' };
        }

        // Calculate trends
        const current = user.physicalStats || {};
        const oldestStats = history[history.length - 1] || {};

        const trends = {
            weight: current.weight && oldestStats.weight
                ? current.weight - oldestStats.weight
                : 0,
            squat: current.squat && oldestStats.squat
                ? current.squat - oldestStats.squat
                : 0,
            bench: current.bench && oldestStats.bench
                ? current.bench - oldestStats.bench
                : 0,
        };

        return {
            success: true,
            data: {
                current,
                trends,
                history: JSON.parse(JSON.stringify(history)),
            },
        };
    } catch (error) {
        console.error('Error fetching stats analytics:', error);
        return { success: false, error: 'Failed to fetch stats analytics' };
    }
}
