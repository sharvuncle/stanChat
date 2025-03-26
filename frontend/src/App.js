// src/App.js
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Reference to the "messages" collection
    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'desc'));

    // Set up a real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;
    try {
      await addDoc(collection(db, 'messages'), {
        text: newMessage,
        timestamp: new Date(),
      });
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  return (
    <div className="App" style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Stanford Chat MVP</h1>
      <div className="chat-container" style={{ border: "1px solid #ccc", padding: "10px", height: "400px", overflowY: "scroll" }}>
        {messages.map(message => (
          <div key={message.id} style={{ padding: "5px 0", borderBottom: "1px solid #eee" }}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="chat-input" style={{ marginTop: "10px" }}>
        <input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          style={{ width: "80%", padding: "8px" }}
        />
        <button onClick={handleSendMessage} style={{ padding: "8px 16px", marginLeft: "5px" }}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
