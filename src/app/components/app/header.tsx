'use client';

import { PlusCircle, BookOpenCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type HeaderProps = {
  onAddSubject: () => void;
};

export function AppHeader({ onAddSubject }: HeaderProps) {
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
          </div>
        </div>
      </div>
    </header>
  );
}
