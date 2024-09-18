// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_APIKEY,

  authDomain: process.env.EXPO_PUBLIC_AUTHDOMAIN,

  projectId: process.env.EXPO_PUBLIC_PROJECTID,

  storageBucket: process.env.EXPO_PUBLIC_STORAGEBUCKET,

  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGINGSENDERID,

  appId: process.env.EXPO_PUBLIC_APPID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
