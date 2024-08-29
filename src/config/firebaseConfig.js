// firebaseConfig.js
import { getStorage } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { initializeAuth, getReactNativePersistence, signInWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyD3SeWV2APudbyGa8dvdUdgzeGOx23KLx4",
  authDomain: "questiongame-19fd2.firebaseapp.com",
  databaseURL: "https://questiongame-19fd2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "questiongame-19fd2",
  storageBucket: "questiongame-19fd2.appspot.com",
  messagingSenderId: "304301212730",
  appId: "1:304301212730:android:5780c9bed6f52a4a69a103"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

// Initialize Firebase Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Hardcoded sign-in credentials
const email = 'Questiongamez@gmail.com';
const password = 'Questiongamez@qg.com1';

const signIn = async () => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log('User signed in');
  } catch (error) {
    console.error('Error signing in', error);
  }
};

// Perform sign-in when this module is loaded
signIn();

export { app, storage, database };
