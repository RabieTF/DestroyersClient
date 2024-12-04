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
  const [passwordsList, setPasswordsList] = useState([]); // Stores generated passwords
  const [currentPage, setCurrentPage] = useState(0); // For pagination

  const entriesPerPage = 10; // Maximum entries per page

  useEffect(() => {
    let interval;

    if (isConnected && socket) {
      interval = setInterval(() => {
        const password = generatePassword(passwordLength);
        const hash = hashPassword(password);
        const time = getCurrentTime();
        setGeneratedPassword(password);
        setHashedPassword(hash);

        // Add the new password to the list
        setPasswordsList((prevList) => [
          { password, hash, time, status: 'Not Broken' },
          ...prevList,
        ]);

        // Send hash via WebSocket
        socket.send(hash);
        console.log(`Password sent: ${hash}`);
      }, intervalTime);
    }

    return () => clearInterval(interval);
  }, [isConnected, socket, passwordLength, intervalTime]);

  const connectSocket = () => {
    const ws = new WebSocket('ws://localhost:8080/ws');
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

  //TODO : test
  const generate_pwd_test = () => {
    const password = generatePassword(passwordLength);
    const hash = hashPassword(password);
    setGeneratedPassword(password);
    setHashedPassword(hash);

    // Add the new password to the list
    setPasswordsList((prevList) => [
      { password, hash, status: 'Not Broken' },
      ...prevList,
    ]);
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

  // Pagination
  const currentEntries = passwordsList.slice(
    currentPage * entriesPerPage,
    (currentPage + 1) * entriesPerPage
  );

  const handleNext = () => {
    if ((currentPage + 1) * entriesPerPage < passwordsList.length) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0'); // Ensure 2 digits
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Ensure 2 digits
    const seconds = String(now.getSeconds()).padStart(2, '0'); // Ensure 2 digits
    return `${hours}:${minutes}:${seconds}`;
  };

  console.log(getCurrentTime());

  return (
    <div className="App">
      <div className='head'>
        <h1>☠︎︎ MD5 Destroyer</h1>
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
            <button onClick={connectSocket}>Connect ws</button>
          ) : (
            <button onClick={disconnectSocket}>Disconnect</button>
          )}
        </div>

        <ul className="status">
          <li>Status: <span>{status}</span></li>
          <li>Last Generated Password: <span>{generatedPassword}</span></li>
          <li>Last Hashed Password (MD5): <span>{hashedPassword}</span></li>
        </ul>

        <div className="password-table">
          <h3>Generated Passwords</h3>
          <table>
            <thead>
              <tr>
                <th>Password</th>
                <th>Hash (MD5)</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentEntries.length > 0 ? (
                currentEntries.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.password}</td>
                    <td>{entry.hash}</td>
                    <td>{entry.time}</td>
                    <td>{entry.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>No passwords generated yet</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="pagination">
            <button onClick={handlePrevious} disabled={currentPage === 0}>
              &laquo; Previous
            </button>
            <button
              onClick={handleNext}
              disabled={(currentPage + 1) * entriesPerPage >= passwordsList.length}
            >
              Next &raquo;
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
