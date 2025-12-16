import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, TrendingUp, UserCheck } from 'lucide-react';
import AuthModal from '@/components/auth/AuthModal';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">

        <section className="py-24 md:py-32 px-4 text-center space-y-8 bg-gradient-to-b from-background to-muted/20">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl mx-auto">
            Atteignez vos Objectifs avec <span className="text-primary">GymCore</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            La plateforme ultime pour gérer votre entraînement, suivre vos progrès et réaliser vos rêves fitness.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <AuthModal>
              <Button size="lg" className="text-lg px-8">
                S'inscrire
              </Button>
            </AuthModal>
            <AuthModal>
              <Button variant="outline" size="lg" className="text-lg px-8">
                Se Connecter
              </Button>
            </AuthModal>
          </div>
        </section>


        <section className="py-20 px-4 container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card/50 border-muted">
              <CardHeader>
                <UserCheck className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Coachs Experts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Connectez-vous avec des coachs de haut niveau qui vous guideront à chaque étape de votre parcours.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-muted">
              <CardHeader>
                <Dumbbell className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Programmes Personnalisés</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Accédez à des programmes d'entraînement personnalisés adaptés à vos objectifs et votre niveau.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-muted">
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Suivez vos Progrès</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Visualisez vos gains avec des analyses détaillées sur votre poids, vos performances et votre régularité.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-muted-foreground border-t">
        &copy; {new Date().getFullYear()} GymCore. Tous droits réservés.
      </footer>
    </div>
  );
}
