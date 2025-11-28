'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { Subject } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Edit, Trash2, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

type SubjectCardProps = {
  subject: Subject;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function SubjectCard({ subject, isSelected, onSelect, onEdit, onDelete }: SubjectCardProps) {
  const completedTopics = subject.topics.filter((t) => t.isCompleted).length;
  const totalTopics = subject.topics.length;
  const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <Card
      className={cn(
        'flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
        isSelected ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-border bg-card'
      )}
      style={{ '--subject-color': subject.color } as React.CSSProperties}
    >
      <div className="h-2 w-full bg-[var(--subject-color)] rounded-t-lg" />
      <CardHeader className="flex-row items-start gap-4 space-y-0">
        <div className="flex-1">
          <CardTitle className="font-headline text-xl leading-tight">{subject.title}</CardTitle>
          <CardDescription className="line-clamp-2 mt-2">{subject.description}</CardDescription>
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 -mt-1 -mr-1">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-1 space-y-2">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" indicatorClassName="bg-[var(--subject-color)]" />
         <div className="text-xs text-muted-foreground pt-1">
          {completedTopics} of {totalTopics} topics completed
        </div>
      </CardContent>
      <CardFooter>
        <Button variant={isSelected ? 'default' : 'outline'} className="w-full" onClick={onSelect}>
          {isSelected ? 'Selected' : 'View Topics'}
        </Button>
      </CardFooter>
    </Card>
  );
}
