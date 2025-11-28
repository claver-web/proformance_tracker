'use client';

import { PlusCircle, BookOpenCheck, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { signOut } from '@/firebase/auth';
import { useRouter } from 'next/navigation';

type HeaderProps = {
  onAddSubject: () => void;
};

export function AppHeader({ onAddSubject }: HeaderProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <header className="bg-card border-b sticky top-0 z-10 shrink-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <BookOpenCheck className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground font-headline">EduPlanner</h1>
          </Link>
          <div className="flex items-center gap-2">
            <Button onClick={onAddSubject}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Subject
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
