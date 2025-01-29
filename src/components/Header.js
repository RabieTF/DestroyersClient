import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../CSS/Header.css'; // Importez le fichier CSS

const Header = () => {
    const location = useLocation(); // Récupère le chemin actuel
    const [activeLink, setActiveLink] = useState(location.pathname); // Définit l'état du lien actif

    return (
        <header className="header">
            <nav className="nav">
                <div className='head'>
                    <h1>☠︎︎ MD5 Destroyer</h1>
                </div>
                <ul>
                    <li>
                        <Link
                            to="/"
                            className={activeLink === '/' ? 'active' : ''}
                            onClick={() => setActiveLink('/')}
                        >
                            Configuration
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/passwords"
                            className={activeLink === '/passwords' ? 'active' : ''}
                            onClick={() => setActiveLink('/passwords')}
                        >
                            Passwords
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/containers"
                            className={activeLink === '/containers' ? 'active' : ''}
                            onClick={() => setActiveLink('/containers')}
                        >
                            Containers
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;