// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, connectAuthEmulator } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Debug log the config (without sensitive values)
console.log('Firebase Config:', {
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  hasApiKey: !!firebaseConfig.apiKey,
  hasAppId: !!firebaseConfig.appId,
  hasMessagingSenderId: !!firebaseConfig.messagingSenderId
});

// Initialize Firebase
let app: FirebaseApp;
let analytics = null;
let auth = null;
let db = null;

try {
  if (typeof window !== 'undefined') {
    // Client-side initialization
    if (!getApps().length) {
      console.log('Initializing Firebase app...');
      app = initializeApp(firebaseConfig);
      
      // Initialize analytics only on client side
      isSupported().then(yes => {
        if (yes) {
          console.log('Initializing Analytics...');
          analytics = getAnalytics(app);
        }
      });
      
      // Initialize auth
      console.log('Initializing Auth...');
      auth = getAuth(app);
      
      // Initialize Firestore with offline persistence
      console.log('Initializing Firestore...');
      db = getFirestore(app);
      
      // Enable offline persistence
      import('firebase/firestore').then(({ enableIndexedDbPersistence }) => {
        console.log('Enabling offline persistence...');
        enableIndexedDbPersistence(db).catch((err) => {
          if (err.code === 'failed-precondition') {
            console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
          } else if (err.code === 'unimplemented') {
            console.warn('The current browser does not support persistence.');
          }
        });
      });

      // Connect to emulators in development
      if (process.env.NODE_ENV === 'development') {
        connectFirestoreEmulator(db, 'localhost', 8080);
        connectAuthEmulator(auth, 'http://localhost:9099');
      }
    } else {
      console.log('Using existing Firebase app...');
      app = getApp();
      auth = getAuth(app);
      db = getFirestore(app);
    }
  } else {
    // Server-side initialization
    if (!getApps().length) {
      console.log('Initializing Firebase app on server...');
      app = initializeApp(firebaseConfig);
      db = getFirestore(app);
    } else {
      console.log('Using existing Firebase app on server...');
      app = getApp();
      db = getFirestore(app);
    }
  }
  console.log('Firebase initialization complete');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

export { app, db, analytics, auth };
