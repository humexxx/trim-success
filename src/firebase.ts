// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzmS7TYxhpIVJEORwIP3f9s5nijfz_bgo",
  authDomain: "trim-success.firebaseapp.com",
  projectId: "trim-success",
  storageBucket: "trim-success.appspot.com",
  messagingSenderId: "1217526278",
  appId: "1:1217526278:web:05733dd88c3edf80caa187",
  measurementId: "G-6VQQFQKHXG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;
