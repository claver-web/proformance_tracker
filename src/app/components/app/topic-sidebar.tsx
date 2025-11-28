'use client';

import { useState } from 'react';
import type { Subject, Topic } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TopicItem } from './topic-item';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, BookOpen } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type TopicSidebarProps = {
  subject: Subject | null;
  onTopicsChange: (topics: Topic[]) => void;
  className?: string;
};

export function TopicSidebar({ subject, onTopicsChange, className }: TopicSidebarProps) {
  const [newTopicTitle, setNewTopicTitle] = useState('');

  if (!subject) {
    return (
      <aside className={className}>
        <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-muted/30">
          <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">No Subject Selected</h3>
          <p className="text-sm text-muted-foreground/80 mt-1">Select a subject to view its topics.</p>
        </div>
      </aside>
    );
  }

  const handleAddTopic = () => {
    if (newTopicTitle.trim() === '') return;
    const newTopic: Topic = {
      id: `${subject.id}-${Date.now()}`,
      title: newTopicTitle.trim(),
      isCompleted: false,
    };
    onTopicsChange([...subject.topics, newTopic]);
    setNewTopicTitle('');
  };

  const handleUpdateTopic = (updatedTopic: Topic) => {
    onTopicsChange(
      subject.topics.map((t) => (t.id === updatedTopic.id ? updatedTopic : t))
    );
  };

  const handleDeleteTopic = (topicId: string) => {
    onTopicsChange(subject.topics.filter((t) => t.id !== topicId));
  };
  
  const handleToggleComplete = (topicId: string) => {
    onTopicsChange(
      subject.topics.map((t) =>
        t.id === topicId ? { ...t, isCompleted: !t.isCompleted } : t
      )
    );
  };

  return (
    <aside className={className}>
        <div className="p-4 pt-6 border-b">
            <h2 className="text-2xl font-bold font-headline">{subject.title}</h2>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{subject.description}</p>
        </div>
        
        <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
                {subject.topics.length > 0 ? (
                  subject.topics.map((topic, index) => (
                      <TopicItem
                          key={topic.id}
                          topic={topic}
                          index={index}
                          onUpdate={handleUpdateTopic}
                          onDelete={handleDeleteTopic}
                          onToggleComplete={handleToggleComplete}
                      />
                  ))
                ) : (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    No topics yet. Add one below!
                  </div>
                )}
            </div>
        </ScrollArea>
        <Separator />
        <div className="p-4 space-y-2 border-t">
            <div className="flex gap-2">
                <Input
                    placeholder="Add a new topic..."
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTopic()}
                />
                <Button size="icon" onClick={handleAddTopic} aria-label="Add Topic">
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
        </div>
    </aside>
  );
}
