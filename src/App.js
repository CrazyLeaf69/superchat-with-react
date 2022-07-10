import React, { useRef, useState } from 'react';

import './App.css';
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'

import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

firebase.initializeApp({
  apiKey: "AIzaSyB0C_TN2xkCazuq85URgK-hskmwbS0wiAM",
  authDomain: "superchat-with-react.firebaseapp.com",
  projectId: "superchat-with-react",
  storageBucket: "superchat-with-react.appspot.com",
  messagingSenderId: "621337516956",
  appId: "1:621337516956:web:d7f2865ff9847d93770659",
  measurementId: "G-KH7V0DRBGK"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth)
  return (
    <div className="App">
      <header className="App-header">
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom/> : <SignIn/>}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button className="sign-in" onClick={signInWithGoogle}>Sign in with google</button>
  )
}
function SignOut() {
  return auth.currentUser && (
    <>
      <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
    </>
  )
}

function ChatRoom() {
  const dummy = useRef()

  const messagesRef = firestore.collection('messages')
  const query = messagesRef.orderBy('createdAt').limit(25)

  const [messages] =  useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('')

  const sendMessage = async(e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('')

    dummy.current.scrollIntoView({behavior: 'smooth'})
  }

  return (
    <>
    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>) }

      <div ref={dummy}></div>
    </main>

    <form onSubmit={sendMessage}>
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>

      <button type="submit">send</button>
    </form>
    </>
  )
}

function ChatMessage(props) {
  const { text, uid ,photoURL } = props.message

 const messageClass = uid === auth.currentUser.uid ? 'sent' : 'recieved';

 return (
  <div className={`message ${messageClass}`}>
    <img src={photoURL}/>
    <p>{text}</p>
  </div>
 )
}

export default App;
