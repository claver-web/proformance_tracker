'use client';

import React, { useState, useEffect } from 'react';
import { AppHeader } from '@/app/components/app/header';
import { SubjectList } from '@/app/components/app/subject-list';
import { TopicSidebar } from '@/app/components/app/topic-sidebar';
import { SubjectFormDialog } from '@/app/components/app/subject-form-dialog';
import { initialSubjects } from '@/lib/data';
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
import { Sheet, SheetContent } from '@/components/ui/sheet';

export default function Home() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState<Subject | undefined>(undefined);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);
  const [isTopicSidebarOpenOnMobile, setIsTopicSidebarOpenOnMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Load from local storage or initial data
    const savedSubjects = localStorage.getItem('eduplanner-subjects');
    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects));
    } else {
      setSubjects(initialSubjects);
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('eduplanner-subjects', JSON.stringify(subjects));
      // Update selected subject with fresh data from subjects array
      if (selectedSubject) {
        const updatedSelected = subjects.find(s => s.id === selectedSubject.id);
        setSelectedSubject(updatedSelected || null);
      } else if (subjects.length > 0) {
        setSelectedSubject(subjects[0]);
      } else {
        setSelectedSubject(null);
      }
    }
  }, [subjects, isMounted]);

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

  const confirmDelete = () => {
    if (subjectToDelete) {
      setSubjects(subjects.filter((s) => s.id !== subjectToDelete.id));
      if (selectedSubject?.id === subjectToDelete.id) {
        const remainingSubjects = subjects.filter((s) => s.id !== subjectToDelete.id);
        setSelectedSubject(remainingSubjects.length > 0 ? remainingSubjects[0] : null);
      }
      setSubjectToDelete(null);
    }
  };

  const handleFormSave = (subjectData: Subject) => {
    if (subjectToEdit) {
      setSubjects(subjects.map((s) => s.id === subjectData.id ? subjectData : s));
    } else {
      setSubjects([...subjects, subjectData]);
      if (!selectedSubject) {
        setSelectedSubject(subjectData);
      }
    }
    setIsFormOpen(false);
    setSubjectToEdit(undefined);
  };

  const handleTopicUpdate = (updatedTopics: Topic[]) => {
    if (selectedSubject) {
      const updatedSubject = { ...selectedSubject, topics: updatedTopics };
      setSubjects(subjects.map((s) => (s.id === updatedSubject.id ? updatedSubject : s)));
    }
  };

  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex h-dvh bg-background">
      <div className="hidden md:flex">
        <TopicSidebar
          subject={selectedSubject}
          onTopicsChange={handleTopicUpdate}
          className="w-80 lg:w-96 border-r bg-card flex-col"
        />
      </div>
      <main className="flex-1 flex flex-col overflow-hidden">
        <AppHeader 
          onAddSubject={handleAddSubjectClick} 
          onToggleSidebar={() => setIsTopicSidebarOpenOnMobile(true)}
          hasSelectedSubject={!!selectedSubject}
        />
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <SubjectList
            subjects={subjects}
            selectedSubject={selectedSubject}
            onSelectSubject={setSelectedSubject}
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

      <Sheet open={isTopicSidebarOpenOnMobile} onOpenChange={setIsTopicSidebarOpenOnMobile}>
        <SheetContent side="left" className="w-80 p-0 flex flex-col bg-card border-r">
          <TopicSidebar
            subject={selectedSubject}
            onTopicsChange={handleTopicUpdate}
            className="flex flex-col h-full"
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
