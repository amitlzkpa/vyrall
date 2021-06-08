import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyATv80DF3VOgJSB-COX4vLhsC4cESE2OJQ",
  authDomain: "vyrall.firebaseapp.com",
  projectId: "vyrall",
  storageBucket: "vyrall.appspot.com",
  messagingSenderId: "429094377009",
  appId: "1:429094377009:web:19364668bb00df5fb52710",
  measurementId: "G-SB0E11C90Y",
};
firebase.initializeApp(firebaseConfig);

// utils
const db = firebase.firestore();
const auth = firebase.auth();

// collection references
const usersCollection = db.collection("users");
const campaignsCollection = db.collection("campaign");

const postsCollection = db.collection("posts");
const likesCollection = db.collection("likes");

// export utils/refs
export {
  db,
  auth,
  usersCollection,
  campaignsCollection,
  postsCollection,
  likesCollection,
};