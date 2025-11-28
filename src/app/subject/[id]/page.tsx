'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Subject, Topic } from '@/lib/types';
import { TopicSidebar } from '@/app/components/app/topic-sidebar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function SubjectPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const savedSubjects = localStorage.getItem('eduplanner-subjects');
    if (savedSubjects) {
      const parsedSubjects = JSON.parse(savedSubjects);
      setSubjects(parsedSubjects);
      const currentSubject = parsedSubjects.find((s: Subject) => s.id === id);
      setSubject(currentSubject || null);
    }
    setIsMounted(true);
  }, [id]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('eduplanner-subjects', JSON.stringify(subjects));
      if (id) {
         const currentSubject = subjects.find((s: Subject) => s.id === id);
         setSubject(currentSubject || null);
      }
    }
  }, [subjects, isMounted, id]);


  const handleTopicsChange = (updatedTopics: Topic[]) => {
    if (subject) {
      const updatedSubject = { ...subject, topics: updatedTopics };
      setSubjects(subjects.map((s) => (s.id === updatedSubject.id ? updatedSubject : s)));
    }
  };

  if (!isMounted) {
    return (
      <div className="p-4 pt-6">
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-4 w-full mb-6" />
        <div className="space-y-2">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-dvh bg-card">
       <header className="p-4 border-b flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
            <h1 className="text-xl font-bold truncate">{subject?.title}</h1>
        </div>
      </header>
      <TopicSidebar
        subject={subject}
        onTopicsChange={handleTopicsChange}
        className="flex-1 flex flex-col"
      />
    </div>
  );
}
