// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: API_KEY,

  authDomain: "budgetfy-8924c.firebaseapp.com",

  projectId: "budgetfy-8924c",

  storageBucket: "budgetfy-8924c.firebasestorage.app",

  messagingSenderId: "75965777212",

  appId: API_ID

};


// Initialize Firebase

const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
