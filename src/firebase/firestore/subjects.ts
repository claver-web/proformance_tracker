'use client';
import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { app } from '@/firebase/config';
import { Subject } from '@/lib/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const db = getFirestore(app);

// Function to get the subjects collection for a user
const getSubjectsCollection = (userId: string) => {
  return collection(db, 'users', userId, 'subjects');
}

// Create a new subject
export const addSubject = async (userId: string, subject: Subject) => {
  const subjectsCollection = getSubjectsCollection(userId);
  await addDoc(subjectsCollection, subject).catch(serverError => {
    const permissionError = new FirestorePermissionError({
      path: subjectsCollection.path,
      operation: 'create',
      requestResourceData: subject,
    });
    errorEmitter.emit('permission-error', permissionError);
  });
};

// Update an existing subject
export const updateSubject = async (userId: string, subject: Subject) => {
  const subjectDoc = doc(getSubjectsCollection(userId), subject.id);
  await setDoc(subjectDoc, subject, { merge: true }).catch(serverError => {
    const permissionError = new FirestorePermissionError({
        path: subjectDoc.path,
        operation: 'update',
        requestResourceData: subject,
    });
    errorEmitter.emit('permission-error', permissionError);
  });
};

// Delete a subject
export const deleteSubject = async (userId: string, subjectId: string) => {
  const subjectDoc = doc(getSubjectsCollection(userId), subjectId);
  await deleteDoc(subjectDoc).catch(serverError => {
    const permissionError = new FirestorePermissionError({
        path: subjectDoc.path,
        operation: 'delete',
    });
    errorEmitter.emit('permission-error', permissionError);
  });
};

// Get all subjects for a user
export const getSubjects = async (userId: string): Promise<Subject[]> => {
  const subjectsCollection = getSubjectsCollection(userId);
  try {
    const snapshot = await getDocs(subjectsCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Subject));
  } catch (serverError) {
    const permissionError = new FirestorePermissionError({
        path: subjectsCollection.path,
        operation: 'list',
    });
    errorEmitter.emit('permission-error', permissionError);
    return [];
  }
};
