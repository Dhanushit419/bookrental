// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";


 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCF-2h_oWgMKkErz1NPJtfn6M4VU4f2nAs",
  authDomain: "rentbook-3c4eb.firebaseapp.com",
  projectId: "rentbook-3c4eb",
  storageBucket: "rentbook-3c4eb.firebasestorage.app",
  messagingSenderId: "475671551095",
  appId: "1:475671551095:web:f650275141a731b0893a72",
  measurementId: "G-94G45RC5QC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export { firestore };