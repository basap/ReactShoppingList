import { initializeApp } from "firebase/app";
import { getFirestore, Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDRAkqzxxofEvsbEUTR8Bx3Apdv-7lJItM",
  authDomain: "reactshoppinglist-52d07.firebaseapp.com",
  projectId: "reactshoppinglist-52d07",
  storageBucket: "reactshoppinglist-52d07.firebasestorage.app",
  messagingSenderId: "315444600909",
  appId: "1:315444600909:web:1bc429189ead85b7647c04"
};

const app = initializeApp(firebaseConfig);
const firestore: Firestore = getFirestore(app);

export { firestore };