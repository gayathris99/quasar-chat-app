import firebase from 'firebase/app'

import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBOc12JmhB-UQtJnRnrR_OD8oOlTlCKIig",
  authDomain: "chat-app-8db8f.firebaseapp.com",
  projectId: "chat-app-8db8f",
  storageBucket: "chat-app-8db8f.appspot.com",
  messagingSenderId: "149431588964",
  appId: "1:149431588964:web:6be7330d6e9c23260a2771"
};

const firebaseApp = firebase.initializeApp(firebaseConfig)
const firebaseAuth = firebaseApp.auth()
const firebaseDb = firebaseApp.firestore()

export { firebaseAuth, firebaseDb}
