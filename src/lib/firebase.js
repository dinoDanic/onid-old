import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAbFEkMPZ0C-mjI4bhh7iY2m-mDTFlwoLs",
  authDomain: "onid-36.firebaseapp.com",
  projectId: "onid-36",
  storageBucket: "onid-36.appspot.com",
  messagingSenderId: "896365022044",
  appId: "1:896365022044:web:d623d1a317a015a4ddcf99",
};

const Firebase = firebase.initializeApp(firebaseConfig);
const db = Firebase.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, provider, auth, Firebase };
