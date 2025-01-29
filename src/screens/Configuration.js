import React, { useState } from 'react';
import { FaLink, FaUnlink } from 'react-icons/fa';
import '../CSS/Configuration.css'; // Importez le fichier CSS

const Configuration = ({ isConnected, connectSocket, disconnectSocket, passwordLength, setPasswordLength, intervalTime, setIntervalTime }) => {
    // Fonctions pour incrémenter/décrémenter les valeurs
    const incrementPasswordLength = () => setPasswordLength((prev) => prev + 1);
    const decrementPasswordLength = () => setPasswordLength((prev) => (prev > 1 ? prev - 1 : 1));

    const incrementIntervalTime = () => setIntervalTime((prev) => prev + 100);
    const decrementIntervalTime = () => setIntervalTime((prev) => (prev > 100 ? prev - 100 : 100));

    return (
        <div className="configuration">
            <h2>Configuration</h2>
            <div className="settings">
                <label className="label">
                    Passwords Length:
                    <div className="input-wrapper">
                        <input
                            className="input"
                            type="number"
                            value={passwordLength}
                            onChange={(e) => setPasswordLength(parseInt(e.target.value))}
                            min="1" // Valeur minimale pour éviter des valeurs négatives
                        />
                        <div className="custom-buttons">
                            <button onClick={incrementPasswordLength} className="custom-button">▲</button>
                            <button onClick={decrementPasswordLength} className="custom-button">▼</button>
                        </div>
                    </div>
                </label>
                <label className="label">
                    Time interval (ms):
                    <div className="input-wrapper">
                        <input
                            className="input"
                            type="number"
                            value={intervalTime}
                            onChange={(e) => setIntervalTime(parseInt(e.target.value))}
                            min="100" // Valeur minimale pour éviter des intervalles trop courts
                        />
                        <div className="custom-buttons">
                            <button onClick={incrementIntervalTime} className="custom-button">▲</button>
                            <button onClick={decrementIntervalTime} className="custom-button">▼</button>
                        </div>
                    </div>
                </label>
            </div>

            <div className="controls">
                {!isConnected ? (
                    <button onClick={connectSocket}>
                        <FaLink /> Connect WS
                    </button>
                ) : (
                    <button onClick={disconnectSocket}>
                        <FaUnlink /> Disconnect WS
                    </button>
                )}
            </div>
        </div>
    );
};

export default Configuration;