import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyBH6uWxw3T5vdJBi8Q4JGBGhX4PkK0GFUU',
  authDomain: 'music-cvm.firebaseapp.com',
  projectId: 'music-cvm',
  storageBucket: 'music-cvm.appspot.com',
  appId: '1:48490844250:web:a0950984b261adfbb24863'
}

firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()
const db = firebase.firestore()
const storage = firebase.storage()

const usersCollection = db.collection('users')
const songsCollection = db.collection('songs')
const commentsCollection = db.collection('comments')

export {
  auth,
  db,
  storage,
  usersCollection,
  songsCollection,
  commentsCollection
}
