'use client';

import { getAllPrograms } from '@/actions/program.actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, Star, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminProgramsClient() {
    const { data: programs = [], isLoading } = useQuery({
        queryKey: ['all-programs'],
        queryFn: async () => await getAllPrograms(),
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Programs Management</h2>
                    <p className="text-muted-foreground">View and manage all training programs.</p>
                </div>
            </div>

            {/* Programs Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Programs</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full" />
                            ))}
                        </div>
                    ) : programs.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Dumbbell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No programs created yet.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Program</TableHead>
                                    <TableHead>Coach</TableHead>
                                    <TableHead>Level</TableHead>
                                    <TableHead>Exercises</TableHead>
                                    <TableHead>Enrollments</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead>Created</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {programs.map((program: any) => (
                                    <TableRow key={program._id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{program.title}</div>
                                                <div className="text-sm text-muted-foreground line-clamp-1">
                                                    {program.description || 'No description'}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">{program.coachId?.name || 'Unknown'}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    program.level === 'Beginner'
                                                        ? 'default'
                                                        : program.level === 'Intermediate'
                                                            ? 'secondary'
                                                            : 'destructive'
                                                }
                                            >
                                                {program.level}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-sm">
                                                <Dumbbell className="h-4 w-4" />
                                                {program.exercises?.length || 0}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-sm">
                                                <Users className="h-4 w-4" />
                                                {program.totalEnrollments || 0}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-sm">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                {program.averageRating?.toFixed(1) || '0.0'}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(program.createdAt).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
