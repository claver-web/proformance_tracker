'use client';

import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  type User
} from 'firebase/auth';
import { app } from '@/firebase/config';
import { doc, setDoc, getFirestore } from 'firebase/firestore';

const auth = getAuth(app);
const db = getFirestore(app);

const saveUserToFirestore = (user: User) => {
    const userRef = doc(db, 'users', user.uid);
    const { uid, email, displayName, photoURL } = user;
    setDoc(userRef, { uid, email, displayName, photoURL }, { merge: true });
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        saveUserToFirestore(user);
    }
});


export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    saveUserToFirestore(result.user);
  } catch (error) {
    console.error('Error signing in with Google: ', error);
    throw error;
  }
};

export const signUpWithEmail = async (email: string, password: string): Promise<User> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        saveUserToFirestore(userCredential.user);
        return userCredential.user;
    } catch (error) {
        console.error('Error signing up with email: ', error);
        throw error;
    }
};

export const signInWithEmail = async (email: string, password: string): Promise<User> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error('Error signing in with email: ', error);
        throw error;
    }
};


export const signOut = () => {
  return firebaseSignOut(auth);
};
