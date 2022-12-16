// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdN2Yt5819ztaaYIMXjO-3x72wLRjN1LU",
  authDomain: "automatasim.firebaseapp.com",
  projectId: "automatasim",
  storageBucket: "automatasim.appspot.com",
  messagingSenderId: "649604977800",
  appId: "1:649604977800:web:424baf5d5981cc0973fb3d",
  measurementId: "G-65K16QKS7E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);