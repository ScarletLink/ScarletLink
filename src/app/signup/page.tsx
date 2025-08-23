
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: fullName });
      toast({ title: t("Account created successfully!") });
      router.push('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t("Signup Failed"),
        description: t(error.message),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast({ title: t("Account created successfully with Google!") });
      router.push('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t("Google Signup Failed"),
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
          <CardTitle className="text-2xl font-headline">{t('Create an Account')}</CardTitle>
          <CardDescription>{t('Join our community of lifesavers.')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="full-name">{t('Full Name')}</Label>
                <Input id="full-name" placeholder={t('Alex Johnson')} required value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">{t('Email')}</Label>
                <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">{t('Password')}</Label>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button type="submit" className="w-full gradient-primary" disabled={loading || googleLoading}>
                {loading ? <Loader2 className="animate-spin" /> : t("Create Account")}
              </Button>
              <Button variant="outline" className="w-full" disabled={loading || googleLoading} onClick={handleGoogleSignUp} type="button">
                {googleLoading ? <Loader2 className="animate-spin" /> : t("Sign up with Google")}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            {t('Already have an account?')}{' '}
            <Link href="/login" className="underline">
              {t('Login')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
