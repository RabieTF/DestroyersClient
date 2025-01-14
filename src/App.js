import React, { useState, useEffect } from 'react';
import './CSS/App.css';
import CryptoJS from 'crypto-js';
import { FaLink, FaUnlink, FaKey, FaLock, FaLockOpen, FaClock, FaCheck, FaTimes, FaSortUp, FaSortDown } from 'react-icons/fa';

function App() {
  const [passwordLength, setPasswordLength] = useState(4);
  const [intervalTime, setIntervalTime] = useState(5000);
  const [isConnected, setIsConnected] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [hashedPassword, setHashedPassword] = useState('');
  const [status, setStatus] = useState('Disconnected');
  const [socket, setSocket] = useState(null);
  const [passwordsList, setPasswordsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortOrderTime, setSortOrderTime] = useState('asc');
  const [sortOrderStatus, setSortOrderStatus] = useState('asc');
  const [brokenPasswordsCount, setBrokenPasswordsCount] = useState(0);
  const [unbrokenPasswordsCount, setUnbrokenPasswordsCount] = useState(0);

  const entriesPerPage = 10;

  useEffect(() => {
    let interval;

    if (isConnected && socket) {
      interval = setInterval(() => {
        const password = generatePassword(passwordLength);
        const hash = hashPassword(password);
        const time = getCurrentTime();
        setGeneratedPassword(password);
        setHashedPassword(hash);

        setPasswordsList((prevList) => [
          { password, hash, time, status: 'Not Broken' },
          ...prevList,
        ]);

        socket.send(hash);
        console.log(`Password sent: ${hash}`);
      }, intervalTime);
    }

    return () => clearInterval(interval);
  }, [isConnected, socket, passwordLength, intervalTime]);

  useEffect(() => {
    updatePasswordCounts(passwordsList);
  }, [passwordsList]);

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

  const generatePassword = (length) => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const generate_pwd_test = () => {
    const password = generatePassword(passwordLength);
    const hash = hashPassword(password);
    setGeneratedPassword(password);
    setHashedPassword(hash);

    setPasswordsList((prevList) => [
      { password, hash, time: getCurrentTime(), status: 'Not Broken' },
      ...prevList,
    ]);
  };

  const hashPassword = (password) => {
    return CryptoJS.MD5(password).toString();
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const sortPasswordsByTime = (list, order) => {
    return list.slice().sort((a, b) => {
      const timeA = new Date(`1970/01/01 ${a.time}`).getTime();
      const timeB = new Date(`1970/01/01 ${b.time}`).getTime();
      return order === 'asc' ? timeA - timeB : timeB - timeA;
    });
  };

  const sortPasswordsByStatus = (list, order) => {
    return list.slice().sort((a, b) => {
      const statusA = a.status === 'Broken' ? 1 : 0;
      const statusB = b.status === 'Broken' ? 1 : 0;
      return order === 'asc' ? statusA - statusB : statusB - statusA;
    });
  };

  const updatePasswordCounts = (list) => {
    const broken = list.filter((entry) => entry.status === 'Broken').length;
    const unbroken = list.filter((entry) => entry.status === 'Not Broken').length;
    setBrokenPasswordsCount(broken);
    setUnbrokenPasswordsCount(unbroken);
  };

  const handleSortByTime = () => {
    setSortOrderTime(sortOrderTime === 'asc' ? 'desc' : 'asc');
  };

  const handleSortByStatus = () => {
    setSortOrderStatus(sortOrderStatus === 'asc' ? 'desc' : 'asc');
  };

  const sortedPasswords = sortPasswordsByTime(
    sortPasswordsByStatus(passwordsList, sortOrderStatus),
    sortOrderTime
  );

  const currentEntries = sortedPasswords.slice(
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
            <button onClick={connectSocket}>
              <FaLink /> Connect ws
            </button>
          ) : (
            <button onClick={disconnectSocket}>
              <FaUnlink /> Disconnect
            </button>
          )}
        </div>

        <ul className="status">
          <li>Status: <span>{status}</span></li>
          <li>Last Generated Password: <span>{generatedPassword}</span></li>
          <li>Last Hashed Password (MD5): <span>{hashedPassword}</span></li>
        </ul>

        <div className="password-stats">
          <h3>Password Statistics</h3>
          <ul>
            <li>
              <FaCheck /> Broken Passwords: {brokenPasswordsCount} (
              {((brokenPasswordsCount / passwordsList.length) * 100 || 0).toFixed(2)}%)
            </li>
            <li>
              <FaTimes /> Unbroken Passwords: {unbrokenPasswordsCount} (
              {((unbrokenPasswordsCount / passwordsList.length) * 100 || 0).toFixed(2)}%)
            </li>
            <li>
              <FaKey /> Total Passwords: {passwordsList.length}
            </li>
          </ul>
        </div>

        <div className="password-table">
          <h3>Generated Passwords</h3>
          <table>
            <thead>
              <tr>
                <th>Password</th>
                <th>Hash (MD5)</th>
                <th onClick={handleSortByTime} style={{ cursor: 'pointer' }}>
                  Time {sortOrderTime === 'asc' ? <FaSortUp /> : <FaSortDown />}
                </th>
                <th onClick={handleSortByStatus} style={{ cursor: 'pointer' }}>
                  Status {sortOrderStatus === 'asc' ? <FaSortUp /> : <FaSortDown />}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentEntries.length > 0 ? (
                currentEntries.map((entry, index) => (
                  <tr key={index}>
                    <td>
                      <FaKey /> {entry.password}
                    </td>
                    <td>
                      <FaLock /> {entry.hash}
                    </td>
                    <td>
                      <FaClock /> {entry.time}
                    </td>
                    <td>
                      {entry.status === 'Broken' ? <FaLockOpen /> : <FaLock />} {entry.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>
                    No passwords generated yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {passwordsList?.length > entriesPerPage &&
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
            </div>}
        </div>
      </header>
    </div>
  );
}

export default App;