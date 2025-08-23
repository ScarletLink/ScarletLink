// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "scarlet-link",
  "appId": "1:912035249933:web:54a83d30ab23a4b9313a44",
  "storageBucket": "scarlet-link.firebasestorage.app",
  "apiKey": "AIzaSyCQ47sTLmNr9xPMKsmzFkbPNuatWUndcfA",
  "authDomain": "scarlet-link.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "912035249933"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
