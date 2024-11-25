// Header.js
import React, { useContext } from 'react';
import { MyContext } from './MyContext'; // Adjust the import path as needed
import styles from './Header.module.css';

const Header = () => {
    const { setUserID, setValidated, validated } = useContext(MyContext);

    const handleLogout = () => {
        setUserID(null);
        setValidated(false);
        // You might want to add navigation to the login page here
        // For example: navigate('/login');
    };

    return (
        <header className={styles.header}>
            {validated && (
                <button className={styles.logoutButton} onClick={handleLogout}>
                    Logout
                </button>
            )}
        </header>
    );
};

export default Header;