import { vi } from 'vitest';

export const auth = {
  currentUser: { 
    uid: 'test-uid', 
    email: 'test@test.com',
    getIdTokenResult: vi.fn().mockResolvedValue({ expirationTime: new Date(Date.now() + 3600000).toISOString() }),
    getIdToken: vi.fn().mockResolvedValue('mock-token'),
    reload: vi.fn(),
    emailVerified: true
  },
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn((callback) => {
    callback({ uid: 'test-uid', email: 'test@test.com' });
    return vi.fn(); // unsubscribe
  }),
};

export const getAuth = vi.fn(() => auth);
export const GoogleAuthProvider = vi.fn();
export const signInWithEmailAndPassword = vi.fn();
export const createUserWithEmailAndPassword = vi.fn();
export const signInWithPopup = vi.fn();
export const sendEmailVerification = vi.fn();
export const sendPasswordResetEmail = vi.fn();
export const signOut = vi.fn();
