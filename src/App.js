import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import './CSS/App.css';
import Header from './components/Header';
import Configuration from './screens/Configuration';
import Passwords from './screens/Passwords';
import Containers from './screens/Containers';

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

  const entriesPerPage = 6;

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
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={
            <Configuration
              isConnected={isConnected}
              connectSocket={connectSocket}
              disconnectSocket={disconnectSocket}
              passwordLength={passwordLength}
              setPasswordLength={setPasswordLength}
              intervalTime={intervalTime}
              setIntervalTime={setIntervalTime}
            />
          } />
          <Route path="/passwords" element={
            <Passwords
              generatedPassword={generatedPassword}
              hashedPassword={hashedPassword}
              status={status}
              passwordsList={passwordsList}
              currentPage={currentPage}
              sortOrderTime={sortOrderTime}
              sortOrderStatus={sortOrderStatus}
              brokenPasswordsCount={brokenPasswordsCount}
              unbrokenPasswordsCount={unbrokenPasswordsCount}
              handleSortByTime={handleSortByTime}
              handleSortByStatus={handleSortByStatus}
              currentEntries={currentEntries}
              handlePrevious={handlePrevious}
              handleNext={handleNext}
              entriesPerPage={entriesPerPage}
            />
          } />
          <Route path="/containers" element={<Containers />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;