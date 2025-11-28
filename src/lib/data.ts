import type { Subject } from './types';

export const initialSubjects: Subject[] = [
  {
    id: '1',
    title: 'Quantum Mechanics',
    description: 'Exploring the fundamental principles of quantum mechanics, including wave-particle duality, superposition, and entanglement.',
    color: '#3b82f6',
    topics: [
      { id: '1-1', title: 'Introduction to Quantum Theory', isCompleted: true },
      { id: '1-2', title: 'Wave-Particle Duality', isCompleted: true },
      { id: '1-3', title: 'The Schrödinger Equation', isCompleted: false },
      { id: '1-4', title: 'Quantum Tunneling', isCompleted: false },
      { id: '1-5', title: 'Heisenberg Uncertainty Principle', isCompleted: false },
    ],
  },
  {
    id: '2',
    title: 'Web Development Fundamentals',
    description: 'Covering the basics of HTML, CSS, and JavaScript for modern web development, and diving into React for building interactive UIs.',
    color: '#14b8a6',
    topics: [
      { id: '2-1', title: 'HTML Structure and Semantics', isCompleted: true },
      { id: '2-2', title: 'CSS Flexbox and Grid', isCompleted: true },
      { id: '2-3', title: 'JavaScript DOM Manipulation', isCompleted: true },
      { id: '2-4', title: 'Introduction to React Hooks', isCompleted: false },
      { id: '2-5', title: 'Component State Management', isCompleted: false },
    ],
  },
  {
    id: '3',
    title: 'History of Ancient Rome',
    description: 'A comprehensive study of Roman history, from its founding to the fall of the Western Roman Empire.',
    color: '#f97316',
    topics: [
      { id: '3-1', title: 'The Roman Republic', isCompleted: true },
      { id: '3-2', title: 'The Punic Wars', isCompleted: false },
      { id: '3-3', title: 'Julius Caesar and the end of the Republic', isCompleted: false },
      { id: '3-4', title: 'The Roman Empire: Pax Romana', isCompleted: false },
      { id: '3-5', title: 'The Fall of Rome', isCompleted: false },
    ],
  },
];
