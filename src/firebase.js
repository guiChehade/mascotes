import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2OWJsfmLFKEQuz99V9UMhRmiv7jqRGTI",
  authDomain: "parque-dos-mascotes.firebaseapp.com",
  databaseURL:"https://parque-dos-mascotes.firebaseio.com",
  projectId: "parque-dos-mascotes",
  storageBucket: "parque-dos-mascotes.appspot.com",
  messagingSenderId: "979810961225",
  appId: "1:979810961225:web:713b8925a3d7d2a98cfc98"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);