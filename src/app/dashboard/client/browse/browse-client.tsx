'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Loader2 } from 'lucide-react';
import { enrollUser, getStudentEnrollments } from '@/actions/enrollment.actions';
import { getPrograms } from '@/actions/program.actions';
import { toast } from 'sonner';
import { ProgramCard } from '@/components/ProgramCard';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ProgramCardSkeleton } from '@/components/skeletons';

export default function BrowseProgramsClient({ userId }: { userId: string }) {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [level, setLevel] = useState(searchParams.get('level') || 'All');
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  // Fetch Programs
  const { data: programs = [], isLoading: isLoadingPrograms } = useQuery({
    queryKey: ['programs', search, level],
    queryFn: async () => {
      return await getPrograms(search, level === 'All' ? undefined : level);
    },
  });

  // Fetch Enrollments
  const { data: enrollments = [], isLoading: isLoadingEnrollments } = useQuery({
    queryKey: ['enrollments', userId],
    queryFn: async () => {
      return await getStudentEnrollments(userId);
    },
  });

  const isLoading = isLoadingPrograms || isLoadingEnrollments;

  const enrolledProgramIds = new Set(enrollments.map((e: any) => e.programId?._id || e.programId));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleEnroll = async (programId: string) => {
    setEnrollingId(programId);
    try {
      const result = await enrollUser(userId, programId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Inscription réussie ! 🎉');
        await queryClient.invalidateQueries({ queryKey: ['enrollments', userId] });
        await queryClient.invalidateQueries({ queryKey: ['my-enrollments', userId] });
        await queryClient.invalidateQueries({ queryKey: ['programs'] });
      }
    } catch (error) {
      console.error(error);
      toast.error('Échec de l\'inscription');
    } finally {
      setEnrollingId(null);
    }
  };

  const filteredPrograms = programs.filter((p: any) => !enrolledProgramIds.has(p._id));

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher des programmes..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button type="submit">Rechercher</Button>
        </form>
        <Select onValueChange={setLevel} defaultValue={level}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Niveau" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">Tous les Niveaux</SelectItem>
            <SelectItem value="Beginner">Débutant</SelectItem>
            <SelectItem value="Intermediate">Intermédiaire</SelectItem>
            <SelectItem value="Advanced">Avancé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
            {[...Array(6)].map((_, i) => (
               <ProgramCardSkeleton key={i} />
            ))}
         </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
          {filteredPrograms.map((program: any) => {
            const isEnrolling = enrollingId === program._id;
            
            return (
              <ProgramCard key={program._id} program={program} showStats>
                <Button 
                  className="w-full" 
                  onClick={() => handleEnroll(program._id)}
                  disabled={isEnrolling}
                >
                  {isEnrolling ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Inscription...
                    </>
                  ) : (
                    'S\'inscrire'
                  )}
                </Button>
              </ProgramCard>
            );
          })}
        </div>
      )}
      
      {!isLoading && filteredPrograms.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Aucun programme trouvé. Essayez d'ajuster votre recherche ou vos filtres.
        </div>
      )}
    </>
  );
}
