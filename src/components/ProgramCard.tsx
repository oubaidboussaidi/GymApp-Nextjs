import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, Star, Users } from 'lucide-react';
import Image from 'next/image';

interface ProgramCardProps {
  program: {
    _id: string;
    title: string;
    description?: string;
    level: string;
    image?: string;
    exercises?: any[];
    averageRating?: number;
    totalEnrollments?: number;
    coachId?: {
      name: string;
      image?: string;
    };
  };
  children?: React.ReactNode;
  showStats?: boolean;
}

export function ProgramCard({ program, children, showStats = false }: ProgramCardProps) {
  const levelColors: Record<string, string> = {
    Beginner: 'bg-emerald-500/90 hover:bg-emerald-500',
    Intermediate: 'bg-amber-500/90 hover:bg-amber-500',
    Advanced: 'bg-red-500/90 hover:bg-red-500',
  };

  return (
    <Card className="flex flex-col overflow-hidden group">
      {/* Thumbnail or gradient placeholder */}
      <div className="h-36 relative overflow-hidden">
      {program.image ? (
          <Image 
            src={program.image} 
            alt={program.title} 
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105" 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-500/20 via-emerald-600/30 to-emerald-700/40 flex items-center justify-center">
            <Dumbbell className="h-12 w-12 text-emerald-600/50" />
          </div>
        )}
        {/* Level badge overlay */}
        <Badge className={`absolute top-3 right-3 ${levelColors[program.level] || 'bg-secondary'}`}>
          {program.level}
        </Badge>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-1">{program.title}</CardTitle>
        {program.coachId?.name && (
          <p className="text-sm text-muted-foreground">by {program.coachId.name}</p>
        )}
      </CardHeader>
      
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {program.description || 'No description provided.'}
        </p>
        
        {/* Stats row */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Dumbbell className="h-4 w-4" />
            <span>{program.exercises?.length || 0} exercises</span>
          </div>
          {showStats && (
            <>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{program.totalEnrollments || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{program.averageRating?.toFixed(1) || '0.0'}</span>
              </div>
            </>
          )}
        </div>
      </CardContent>
      
      {children && <CardFooter className="pt-0">{children}</CardFooter>}
    </Card>
  );
}
