
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: t("Logged in successfully!") });
      router.push('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t("Login Failed"),
        description: t(error.message),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast({ title: t("Logged in successfully with Google!") });
      router.push('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t("Google Login Failed"),
        description: t(error.message),
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">{t('Welcome Back')}</CardTitle>
          <CardDescription>{t('Enter your email below to login to your account')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">{t('Email')}</Label>
                <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="grid gap-2">
                  <div className="flex items-center">
                      <Label htmlFor="password">{t('Password')}</Label>
                      <Link href="#" className="ml-auto inline-block text-sm underline">
                          {t('Forgot your password?')}
                      </Link>
                  </div>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button type="submit" className="w-full gradient-primary" disabled={loading || googleLoading}>
                {loading ? <Loader2 className="animate-spin" /> : t("Login")}
              </Button>
              <Button variant="outline" className="w-full" disabled={loading || googleLoading} onClick={handleGoogleLogin} type="button">
                {googleLoading ? <Loader2 className="animate-spin" /> : t("Login with Google")}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            {t("Don't have an account?")}{' '}
            <Link href="/signup" className="underline">
              {t('Sign up')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
