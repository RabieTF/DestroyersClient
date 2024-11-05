import React, { useState, useEffect } from 'react';
import './CSS/App.css';
import CryptoJS from 'crypto-js'; // Assurez-vous d'importer crypto-js


function App() {
  const [passwordLength, setPasswordLength] = useState(4);
  const [intervalTime, setIntervalTime] = useState(5000);
  const [isConnected, setIsConnected] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [hashedPassword, setHashedPassword] = useState('');
  const [status, setStatus] = useState('Disconnected');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    let interval;

    if (isConnected && socket) {
      interval = setInterval(() => {
        const password = generatePassword(passwordLength);
        const hash = hashPassword(password);
        setGeneratedPassword(password);
        setHashedPassword(hash);

        // send hash (WebSocket)
        socket.send(hash);
        console.log(`Password sent: ${hash}`);
      }, intervalTime);
    }

    return () => clearInterval(interval);
  }, [isConnected, socket, passwordLength, intervalTime]);

  const connectSocket = () => {
    const ws = new WebSocket('wss://localhost:xxxx');
    ws.onopen = () => {
      setStatus('Connected');
      setIsConnected(true);
      setSocket(ws);
      console.log("WebSocket connected");
    };
    ws.onclose = () => {
      setStatus('Disconnected');
      setIsConnected(false);
      setSocket(null);
      console.log("WebSocket disconnected");
    };
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setStatus('Error');
    };
  };

  const disconnectSocket = () => {
    if (socket) socket.close();
  };
  //TODO : to delete (just for test)
  const generate_pwd_test = () => {
    const password = generatePassword(passwordLength);
    const hash = hashPassword(password);
    setGeneratedPassword(password);
    setHashedPassword(hash);
  };

  const generatePassword = (length) => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };


  function hashPassword(password) {
    return CryptoJS.MD5(password).toString();
  }

  return (
    <div className="App">
      <div className='head'>
        <h1>☠︎︎ MD5 Destroyer </h1>
      </div>
      <header className="App-header">
        <div className="settings">
          <label className="label">
            Passwords Length:
            <input
              className="input"
              type="number"
              value={passwordLength}
              onChange={(e) => setPasswordLength(parseInt(e.target.value))}
            />
          </label>
          <label className="label">
            Time interval (ms):
            <input
              className="input"
              type="number"
              value={intervalTime}
              onChange={(e) => setIntervalTime(parseInt(e.target.value))}
            />
          </label>
        </div>

        <div className="controls">
          {!isConnected ? (
            <button onClick={connectSocket}>Connect</button>
          ) : (
            <button onClick={disconnectSocket}>Disconnect</button>
          )}
        </div>

        <div className="controls">
          <button onClick={generate_pwd_test}>Generate pwd</button>
        </div>

        <ul className="status">
          <li>Status: <span>{status}</span></li>
          <li>Last enerated Password: <span>{generatedPassword}</span></li>
          <li>Last ashed Password (MD5): <span>{hashedPassword}</span></li>
        </ul>
      </header>
    </div>

    //TODO : add generated pwd lists and it status
    //TODO: add slaves status
  );
}

export default App;
