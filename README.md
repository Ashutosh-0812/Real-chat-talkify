<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  
 
</head>
<body>

  <h1>Talkify - Full Stack Chat App</h1>

  <p>This is a full stack chat application built using <strong>React.js</strong> and <strong>Firebase</strong>. Users can create an account, log in, and chat with friends in real time. The app supports sending text messages as well as images.</p>

  <h2>🚀 Features</h2>
  <ul>
    <li>User Authentication using Firebase Auth</li>
    <li>Real-time messaging with Firebase Firestore</li>
    <li>Image upload and storage with Firebase Storage</li>
    <li>Modern and responsive UI using React</li>
  </ul>

  <h2>🛠️ Tech Stack</h2>
  <ul>
    <li><strong>Frontend:</strong> React.js, CSS</li>
    <li><strong>Backend:</strong> Firebase Auth, Firebase Firestore, Firebase Storage</li>
  </ul>

  <h2>📦 Installation</h2>
  <p>Follow these steps to run the project locally:</p>
  <pre><code>git clone https://github.com/your-username/chat-app.git
cd chat-app
npm install
</code></pre>

  <h2>⚙️ Configuration</h2>
  <p>Create a Firebase project and add your Firebase config in a <code>.env</code> file or directly in your Firebase initialization file:</p>

  <pre><code>// firebase-config.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MSG_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export default app;
</code></pre>

  <h2>🚀 Run the App</h2>
  <pre><code>npm start</code></pre>

  <h2>📬 Contributions</h2>
  <p>Feel free to contribute by submitting a pull request or reporting issues!</p>

  <h2>📄 License</h2>
  <p>This project is licensed under the MIT License.</p>

</body>
</html>
