'use client';

import { PlusCircle, BookOpenCheck, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

type HeaderProps = {
  onAddSubject: () => void;
  onToggleSidebar: () => void;
  hasSelectedSubject: boolean;
};

export function AppHeader({ onAddSubject, onToggleSidebar, hasSelectedSubject }: HeaderProps) {
  return (
    <header className="bg-card border-b sticky top-0 z-10 shrink-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
             <BookOpenCheck className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground font-headline">EduPlanner</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={onAddSubject}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Subject
            </Button>
            {hasSelectedSubject && (
              <Button onClick={onToggleSidebar} variant="outline" size="icon" className="md:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Topics Sidebar</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
