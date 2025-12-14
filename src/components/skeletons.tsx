import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"

export function ProgramCardSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden h-full">
      {/* Image placeholder - Aspect ratio matching real card */}
      <div className="h-36 relative overflow-hidden">
        <Skeleton className="h-full w-full rounded-none" />
      </div>
      
      {/* Content block placeholder */}
      <CardContent className="flex-1 p-4 space-y-4">
        {/* Title block */}
        <Skeleton className="h-6 w-3/4" />
        
        {/* Description block */}
        <Skeleton className="h-20 w-full" />
        
        {/* Stats row block */}
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
    </Card>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Column - Identity Form */}
      <div className="lg:col-span-2">
        <Card className="h-[600px]">
          <Skeleton className="h-full w-full rounded-xl" />
        </Card>
      </div>
      
      {/* Sidebar Column - Settings & Danger Zone */}
      <div className="space-y-6">
        <Card className="h-[150px]">
          <Skeleton className="h-full w-full rounded-xl" />
        </Card>
        <Card className="h-[150px]">
          <Skeleton className="h-full w-full rounded-xl" />
        </Card>
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>

      {/* Programs Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-[300px]">
            <Skeleton className="h-full w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function BrowseSkeleton() {
  return (
    <div className="space-y-6">
      {/* Search Bar Area */}
      <div className="flex flex-col md:flex-row gap-4">
        <Skeleton className="h-10 flex-1 rounded-md" />
        <Skeleton className="h-10 w-[180px] rounded-md" />
      </div>

      {/* Program Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <ProgramCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
