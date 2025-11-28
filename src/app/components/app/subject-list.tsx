'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { SubjectCard } from './subject-card';
import type { Subject } from '@/lib/types';
import { motion } from 'framer-motion';
import { FileQuestion } from 'lucide-react';

type SubjectListProps = {
  subjects: Subject[];
  selectedSubject: Subject | null;
  onSelectSubject: (subject: Subject) => void;
  onEditSubject: (subject: Subject) => void;
  onDeleteSubject: (subject: Subject) => void;
};

export function SubjectList({
  subjects,
  selectedSubject,
  onSelectSubject,
  onEditSubject,
  onDeleteSubject,
}: SubjectListProps) {
  const [filter, setFilter] = useState('');

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.title.toLowerCase().includes(filter.toLowerCase()) ||
      subject.description.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground font-headline">Subjects</h2>
        <p className="text-muted-foreground mt-1">Manage and organize your learning journey.</p>
      </div>
      <Input
        placeholder="Filter subjects by title or description..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="max-w-sm"
      />
      {filteredSubjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSubjects.map((subject, index) => (
              <motion.div
                key={subject.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
              >
                <SubjectCard
                  subject={subject}
                  isSelected={selectedSubject?.id === subject.id}
                  onSelect={() => onSelectSubject(subject)}
                  onEdit={() => onEditSubject(subject)}
                  onDelete={() => onDeleteSubject(subject)}
                />
              </motion.div>
            ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-16 border-2 border-dashed rounded-lg bg-card/50 mt-8">
          <FileQuestion className="w-16 h-16 text-muted-foreground/50 mb-4" />
          <p className="text-xl font-semibold text-muted-foreground">No subjects found</p>
          <p className="text-sm text-muted-foreground/80 mt-1">Try adjusting your filter or adding a new subject.</p>
        </div>
      )}
    </div>
  );
}
