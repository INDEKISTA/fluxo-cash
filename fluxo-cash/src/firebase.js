import { initializeApp } from 'firebase/app'
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// ⚠️ CONFIGURAR COM SUAS CREDENCIAIS DO FIREBASE
// Vá em Firebase Console > Projeto > Configurações > SDK do Web App
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "sua-api-key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "seu-auth-domain",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "seu-project-id",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "seu-storage-bucket",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "seu-sender-id",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "seu-app-id",
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)

// Autenticação com persistência local
export const auth = getAuth(app)
setPersistence(auth, browserLocalPersistence)
  .catch(error => console.log("Erro ao configurar persistência:", error))

// Firestore (banco de dados)
export const db = getFirestore(app)

// Storage (armazenamento de arquivos)
export const storage = getStorage(app)

export default app
