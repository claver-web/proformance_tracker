'use client';

import { useState, useRef, useEffect } from 'react';
import type { Topic } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Edit, Trash2, Check as CheckIcon, X } from 'lucide-react';
import { motion } from 'framer-motion';

type TopicItemProps = {
  topic: Topic;
  index: number;
  onUpdate: (topic: Topic) => void;
  onDelete: (topicId: string) => void;
  onToggleComplete: (topicId: string) => void;
};

export function TopicItem({ topic, index, onUpdate, onDelete, onToggleComplete }: TopicItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(topic.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editedTitle.trim() === '') {
        setEditedTitle(topic.title);
    } else {
        onUpdate({ ...topic, title: editedTitle.trim() });
    }
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditedTitle(topic.title);
    setIsEditing(false);
  }

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="group flex items-center gap-3 p-2 rounded-lg hover:bg-muted/80"
    >
      <span className="text-sm font-medium text-muted-foreground w-6 text-right">{index + 1}.</span>
      <Checkbox
        id={`topic-${topic.id}`}
        checked={topic.isCompleted}
        onCheckedChange={() => onToggleComplete(topic.id)}
        aria-label={`Mark topic ${topic.title} as ${topic.isCompleted ? 'incomplete' : 'complete'}`}
      />
      {isEditing ? (
        <div className="flex-1 flex gap-1 items-center">
          <Input 
            ref={inputRef}
            value={editedTitle} 
            onChange={(e) => setEditedTitle(e.target.value)} 
            className="h-8"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
            onBlur={handleSave}
          />
          <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:text-green-600 hover:bg-green-100" onClick={handleSave}><CheckIcon className="h-4 w-4"/></Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-600 hover:bg-red-100" onClick={handleCancel}><X className="h-4 w-4"/></Button>
        </div>
      ) : (
        <>
          <label
            htmlFor={`topic-${topic.id}`}
            className={cn(
              'flex-1 text-sm cursor-pointer py-1',
              topic.isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'
            )}
          >
            {topic.title}
          </label>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4"/>
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onDelete(topic.id)}>
                  <Trash2 className="h-4 w-4"/>
              </Button>
          </div>
        </>
      )}
    </motion.div>
  );
}
