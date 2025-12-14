'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { registerUser } from '@/actions/user.actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function AuthModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Email ou mot de passe invalide');
        toast.error('Email ou mot de passe invalide');
      } else {
        setOpen(false);
        toast.success('Bon retour parmi nous !');
        router.refresh();
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Une erreur inattendue s\'est produite');
      toast.error('Une erreur inattendue s\'est produite');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);

    try {
      const result = await registerUser(formData);
      if (result.success) {
        setActiveTab('login');
        setError(null);
        toast.success('Inscription réussie ! Veuillez vous connecter.');
      } else {
        setError(result.error || 'Échec de l\'inscription');
        toast.error(result.error || 'Échec de l\'inscription');
      }
    } catch (err) {
      setError('Une erreur inattendue s\'est produite');
      toast.error('Une erreur inattendue s\'est produite');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bienvenue sur GymCore</DialogTitle>
          <DialogDescription>
            Connectez-vous ou créez un compte pour commencer.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="register">Inscription</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 py-4">
              {error && activeTab === 'login' && (
                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/50 rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input id="login-email" name="email" type="email" required placeholder="jean@exemple.fr" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Mot de passe</Label>
                <Input id="login-password" name="password" type="password" required placeholder="••••••" />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Connexion...' : 'Se Connecter'}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4 py-4">
              {error && activeTab === 'register' && (
                <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/50 rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="register-name">Nom</Label>
                <Input id="register-name" name="name" required placeholder="Jean Dupont" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input id="register-email" name="email" type="email" required placeholder="jean@exemple.fr" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Mot de passe</Label>
                <Input id="register-password" name="password" type="password" required placeholder="••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-age">Âge</Label>
                <Input id="register-age" name="age" type="number" required placeholder="25" />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Inscription...' : 'S\'inscrire'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
