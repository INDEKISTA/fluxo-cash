import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAKoufj62A1TdT3FK5a_fGvVdYMSHfZWow",
  authDomain: "fluxo-cash-647f4.firebaseapp.com",
  projectId: "fluxo-cash-647f4",
  storageBucket: "fluxo-cash-647f4.firebasestorage.app",
  messagingSenderId: "109930761030",
  appId: "1:109930761030:web:8b2f2e2c6f283d4843f347",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)