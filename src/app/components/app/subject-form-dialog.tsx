'use client';

import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Subject } from '@/lib/types';
import { suggestTopicsBasedOnExistingSubjects } from '@/ai/flows/suggest-topics-based-on-existing-subjects';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2, Sparkles, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const subjectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
  description: z.string().min(10, 'Description must be at least 10 characters long.'),
  topics: z.array(z.object({ title: z.string().min(1, "Topic can't be empty.") })),
});

type SubjectFormValues = z.infer<typeof subjectSchema>;

type SubjectFormDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (subject: Subject) => void;
  subjectToEdit?: Subject;
  existingSubjects: string[];
};

const colors = [
  '#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#14b8a6',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e',
];
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

export function SubjectFormDialog({ isOpen, onOpenChange, onSave, subjectToEdit, existingSubjects }: SubjectFormDialogProps) {
  const { toast } = useToast();
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestedTopics, setSuggestedTopics] = useState<string[]>([]);
  
  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: { title: '', description: '', topics: [] },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'topics' });

  useEffect(() => {
    if (isOpen) {
      if (subjectToEdit) {
        form.reset({
          title: subjectToEdit.title,
          description: subjectToEdit.description,
          topics: subjectToEdit.topics.map(t => ({ title: t.title })),
        });
      } else {
        form.reset({ title: '', description: '', topics: [{ title: '' }] });
      }
      setSuggestedTopics([]);
    }
  }, [subjectToEdit, isOpen, form]);

  const onSubmit = (data: SubjectFormValues) => {
    const newOrUpdatedSubject: Subject = {
      id: subjectToEdit?.id || Date.now().toString(),
      title: data.title,
      description: data.description,
      topics: data.topics
        .filter(t => t.title.trim() !== '')
        .map((t, index) => {
          const existingTopic = subjectToEdit?.topics.find(et => et.title === t.title);
          return {
            id: existingTopic?.id || `${Date.now()}-${index}`,
            title: t.title,
            isCompleted: existingTopic?.isCompleted || false,
          }
        }),
      color: subjectToEdit?.color || getRandomColor(),
    };
    onSave(newOrUpdatedSubject);
  };

  const handleSuggestTopics = async () => {
    const description = form.getValues('description');
    if (!description || description.length < 20) {
      form.setError('description', { type: 'manual', message: 'Please provide a more detailed description (at least 20 characters) to get suggestions.' });
      return;
    }
    
    setIsSuggesting(true);
    setSuggestedTopics([]);
    try {
      const result = await suggestTopicsBasedOnExistingSubjects({
        existingSubjects,
        newSubjectDescription: description,
      });
      setSuggestedTopics(result.suggestedTopics);
    } catch (error) {
      console.error('Error suggesting topics:', error);
      toast({
        variant: 'destructive',
        title: 'Suggestion Failed',
        description: 'Could not get AI-powered topic suggestions. Please try again.',
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  const addSuggestedTopic = (topic: string) => {
    // Prevent adding duplicates
    if (!fields.some(field => field.title === topic)) {
      append({ title: topic });
    }
    setSuggestedTopics(current => current.filter(t => t !== topic));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{subjectToEdit ? 'Edit Subject' : 'Create New Subject'}</DialogTitle>
          <DialogDescription>
            {subjectToEdit ? 'Update the details of your subject.' : 'Fill in the details for your new subject.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
            <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="space-y-4 py-4">
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., Advanced Calculus" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="A brief description of the subject..." {...field} rows={3} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Topics</h3>
                      <Button type="button" variant="outline" onClick={handleSuggestTopics} disabled={isSuggesting}>
                        {isSuggesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4 text-primary" />}
                        Suggest with AI
                      </Button>
                    </div>
                    {suggestedTopics.length > 0 && (
                      <div className="p-3 border rounded-lg bg-muted/50">
                        <p className="text-sm font-medium mb-2">AI Suggestions:</p>
                        <div className="flex flex-wrap gap-2">
                          {suggestedTopics.map((topic, i) => (
                            <Badge key={i} variant="secondary" className="cursor-pointer hover:bg-accent hover:text-accent-foreground" onClick={() => addSuggestedTopic(topic)}>
                              <Plus className="h-3 w-3 mr-1"/>{topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      {fields.map((field, index) => (
                        <FormField key={field.id} control={form.control} name={`topics.${index}.title`} render={({ field: topicField }) => (
                          <FormItem>
                            <div className="flex items-center gap-2">
                              <FormControl><Input placeholder={`Topic ${index + 1}`} {...topicField} /></FormControl>
                              <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )} />
                      ))}
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ title: '' })} className="mt-2"><Plus className="mr-2 h-4 w-4" /> Add Topic</Button>
                  </div>
                </div>
            </ScrollArea>
            <DialogFooter className="mt-4 pt-4 border-t">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">Save Subject</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
