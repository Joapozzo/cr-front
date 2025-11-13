// src/lib/firebase.config.ts
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBqa_2xdobFsh5FMWCtiaVFpY6xfUAyOmc",
  authDomain: "coparelampago-1dd7e.firebaseapp.com",
  projectId: "coparelampago-1dd7e",
  storageBucket: "coparelampago-1dd7e.appspot.com",
  messagingSenderId: "386465473163",
  appId: "1:386465473163:web:235f0539432cfad1d4aa8e",
};

// Inicializar Firebase solo una vez
let app: FirebaseApp;
let auth: Auth;
let storage: FirebaseStorage;

if (typeof window !== 'undefined') {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    storage = getStorage(app);
  } else {
    app = getApps()[0];
    auth = getAuth(app);
    storage = getStorage(app);
  }
}

export { app, auth, storage };