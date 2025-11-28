'use client';
// This is a simple event emitter.
// It's used to globally handle Firestore permission errors
// without tightly coupling the UI components to the data layer.

type Listener<T> = (data: T) => void;

class Emitter<Events extends Record<string, any>> {
  private listeners: { [K in keyof Events]?: Listener<Events[K]>[] } = {};

  on<K extends keyof Events>(event: K, listener: Listener<Events[K]>) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
  }

  off<K extends keyof Events>(event: K, listener: Listener<Events[K]>) {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event] = this.listeners[event]!.filter(l => l !== listener);
  }

  emit<K extends keyof Events>(event: K, data: Events[K]) {
    if (this.listeners[event]) {
      this.listeners[event]!.forEach(l => l(data));
    }
  }
}

// We are only emitting one type of error for now.
type ErrorEvents = {
  'permission-error': any;
};

export const errorEmitter = new Emitter<ErrorEvents>();
