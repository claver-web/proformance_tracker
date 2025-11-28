'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { AppHeader } from '@/app/components/app/header';
import { SubjectList } from '@/app/components/app/subject-list';
import { TopicSidebar } from '@/app/components/app/topic-sidebar';
import { SubjectFormDialog } from '@/app/components/app/subject-form-dialog';
import type { Subject, Topic } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useUser } from '@/firebase';
import { addSubject, deleteSubject, getSubjects, updateSubject } from '@/firebase/firestore/subjects';
import { useToast } from '@/hooks/use-toast';
import { initialSubjects } from '@/lib/data';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState<Subject | undefined>(undefined);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const isMobile = useIsMobile();
  const { user, loading: userLoading } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    if (user) {
      getSubjects(user.uid)
        .then(userSubjects => {
          if(userSubjects.length === 0) {
            // If no subjects, load initial subjects for new user
            const seededSubjects = initialSubjects.map(subject => ({...subject, id: `${user.uid}-${subject.id}`}))
            seededSubjects.forEach(subject => {
                addSubject(user.uid, subject);
            });
            setSubjects(seededSubjects);
          } else {
            setSubjects(userSubjects);
          }
        })
        .catch(err => {
          console.error("Error fetching subjects: ", err);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not fetch subjects.",
          });
        });
    }
    setIsMounted(true);
  }, [user, toast]);

  useEffect(() => {
    if (isMounted) {
      // Update selected subject with fresh data from subjects array
      if (selectedSubject) {
        const updatedSelected = subjects.find(s => s.id === selectedSubject.id);
        setSelectedSubject(updatedSelected || null);
      } else if (subjects.length > 0 && !isMobile) {
        setSelectedSubject(subjects[0]);
      } else if (!isMobile) {
        setSelectedSubject(null);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjects, isMounted, isMobile]);

  const handleSelectSubject = (subject: Subject) => {
    if (isMobile) {
      router.push(`/subject/${subject.id}`);
    } else {
      setSelectedSubject(subject);
    }
  };

  const handleAddSubjectClick = () => {
    setSubjectToEdit(undefined);
    setIsFormOpen(true);
  };

  const handleEditSubject = (subject: Subject) => {
    setSubjectToEdit(subject);
    setIsFormOpen(true);
  };
  
  const handleDeleteSubject = (subject: Subject) => {
    setSubjectToDelete(subject);
  };

  const confirmDelete = async () => {
    if (subjectToDelete && user) {
      await deleteSubject(user.uid, subjectToDelete.id);
      const newSubjects = subjects.filter((s) => s.id !== subjectToDelete.id);
      setSubjects(newSubjects);

      if (selectedSubject?.id === subjectToDelete.id) {
        setSelectedSubject(newSubjects.length > 0 ? newSubjects[0] : null);
      }
      setSubjectToDelete(null);
      toast({ title: 'Subject deleted' });
    }
  };

  const handleFormSave = async (subjectData: Subject) => {
    if (user) {
        if (subjectToEdit) {
            await updateSubject(user.uid, subjectData);
            setSubjects(subjects.map((s) => s.id === subjectData.id ? subjectData : s));
        } else {
            const newSubject = {...subjectData, id: `${user.uid}-${Date.now()}`};
            await addSubject(user.uid, newSubject);
            const newSubjects = [...subjects, newSubject];
            setSubjects(newSubjects);
            if (!selectedSubject && !isMobile) {
                setSelectedSubject(newSubject);
            }
        }
    }
    setIsFormOpen(false);
    setSubjectToEdit(undefined);
  };

  const handleTopicUpdate = async (updatedTopics: Topic[]) => {
    if (selectedSubject && user) {
      const updatedSubject = { ...selectedSubject, topics: updatedTopics };
      await updateSubject(user.uid, updatedSubject);
      setSubjects(subjects.map((s) => (s.id === updatedSubject.id ? updatedSubject : s)));
    }
  };

  if (userLoading || !isMounted || !user) {
    return (
        <div className="flex h-dvh w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  return (
    <div className="flex h-dvh bg-background">
      <div className="hidden md:flex flex-col">
        <TopicSidebar
          subject={selectedSubject}
          onTopicsChange={handleTopicUpdate}
          className="w-80 lg:w-96 border-r bg-card flex-col"
        />
      </div>
      <main className="flex-1 flex flex-col overflow-hidden">
        <AppHeader onAddSubject={handleAddSubjectClick} />
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <SubjectList
            subjects={subjects}
            selectedSubject={selectedSubject}
            onSelectSubject={handleSelectSubject}
            onEditSubject={handleEditSubject}
            onDeleteSubject={handleDeleteSubject}
          />
        </div>
      </main>

      <SubjectFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleFormSave}
        subjectToEdit={subjectToEdit}
        existingSubjects={subjects.map(s => s.title)}
      />

      <AlertDialog open={!!subjectToDelete} onOpenChange={() => setSubjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the subject "{subjectToDelete?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} variant="destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
