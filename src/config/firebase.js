// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: API_KEY,

  authDomain: "budgetfy-8924c.firebaseapp.com",

  projectId: "budgetfy-8924c",

  storageBucket: "budgetfy-8924c.firebasestorage.app",

  messagingSenderId: "75965777212",

  appId: "1:75965777212:web:b36b6d9369db2996054a39"

};


// Initialize Firebase

const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);

export const tripsRef = collection(FIREBASE_DB, 'trips');
export const expensesRef = collection(FIREBASE_DB, 'expenses');
