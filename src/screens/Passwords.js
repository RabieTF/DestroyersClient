import React from 'react';
import { FaKey, FaLock, FaLockOpen, FaClock, FaCheck, FaTimes, FaSortUp, FaSortDown } from 'react-icons/fa';
import '../CSS/Passwords.css'; // Importez le fichier CSS

const Passwords = ({
    generatedPassword,
    hashedPassword,
    status,
    passwordsList,
    currentPage,
    sortOrderTime,
    sortOrderStatus,
    brokenPasswordsCount,
    unbrokenPasswordsCount,
    handleSortByTime,
    handleSortByStatus,
    currentEntries,
    handlePrevious,
    handleNext,
    entriesPerPage
}) => {
    return (
        <div className="passwords">
            <h2>Passwords</h2>
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
        </div>
    );
};

export default Passwords;