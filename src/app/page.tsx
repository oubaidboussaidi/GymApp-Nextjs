import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, TrendingUp, UserCheck } from 'lucide-react';
import Link from 'next/link';
import AuthModal from '@/components/auth/AuthModal';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 md:py-32 px-4 text-center space-y-8 bg-gradient-to-b from-background to-muted/20">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl mx-auto">
            Crush Your Goals with <span className="text-primary">GymCore</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The ultimate platform to manage your training, track progress, and achieve your fitness dreams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <AuthModal>
              <Button size="lg" className="text-lg px-8">
                Join Now
              </Button>
            </AuthModal>
            <AuthModal>
              <Button variant="outline" size="lg" className="text-lg px-8">
                Login
              </Button>
            </AuthModal>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card/50 border-muted">
              <CardHeader>
                <UserCheck className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Expert Coaches</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Connect with top-tier coaches who will guide you through every step of your journey.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-muted">
              <CardHeader>
                <Dumbbell className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Custom Programs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Access personalized training programs tailored to your specific goals and level.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-muted">
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Track Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Visualize your gains with detailed analytics on your weight, lifts, and consistency.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-muted-foreground border-t">
        &copy; {new Date().getFullYear()} GymCore. All rights reserved.
      </footer>
    </div>
  );
}
