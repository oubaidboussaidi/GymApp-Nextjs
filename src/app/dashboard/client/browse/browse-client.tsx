'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { enrollUser } from '@/actions/enrollment.actions';
import { toast } from 'sonner';

export default function BrowseProgramsClient({ programs, userId, enrollments }: { programs: any[], userId: string, enrollments: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [loading, setLoading] = useState<string | null>(null);

  const enrolledProgramIds = new Set(enrollments.map((e: any) => e.programId._id || e.programId));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (search) params.set('q', search);
    else params.delete('q');
    router.push(`?${params.toString()}`);
  };

  const handleLevelChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'All') params.set('level', value);
    else params.delete('level');
    router.push(`?${params.toString()}`);
  };

  const handleEnroll = async (programId: string) => {
    setLoading(programId);
    try {
        const result = await enrollUser(userId, programId);
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success('Successfully enrolled!');
            router.push('/dashboard/client');
        }
    } catch (error) {
        console.error(error);
        toast.error('Failed to enroll');
    } finally {
        setLoading(null);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search programs..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
        <Select onValueChange={handleLevelChange} defaultValue={searchParams.get('level') || 'All'}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Levels</SelectItem>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {programs.filter(p => !enrolledProgramIds.has(p._id)).map((program) => (
          <Card key={program._id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{program.title}</CardTitle>
              <p className="text-sm text-muted-foreground">by {program.coachId.name}</p>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {program.description}
              </p>
              <div className="flex gap-2 text-sm font-medium">
                <span className="px-2 py-1 bg-secondary rounded-md">{program.level}</span>
                <span className="px-2 py-1 bg-secondary rounded-md">{program.exercises.length} Exercises</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleEnroll(program._id)}
                disabled={loading === program._id}
              >
                {loading === program._id ? 'Enrolling...' : 'Enroll Now'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {programs.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
            No programs found. Try adjusting your search or filters.
        </div>
      )}
    </>
  );
}
