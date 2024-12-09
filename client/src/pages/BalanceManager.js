import { React, useContext, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { MyContext } from '../MyContext';
import axios from "axios";

import styles from '../pageStyling/BalanceManager.module.css';

const BalanceManager = () => {
    const [balances, setBalances] = useState([]);
    const [updated, setUpdated] = useState(true);
    const { user_id, validated } = useContext(MyContext);

    const deleteBalance = async (selected) => {
        try {
            await axios.post('api/deleteTable', null, {
                params: { balance_id: selected }
            });
            setUpdated(true);
        } catch (e) {
            console.error("Error deleting balance:", e);
        }
    };

    const capitalizeFirstLetter = (string) => {
        if (!string) return ""; // Handle empty strings
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    useEffect(() => {
        const getBalances = async () => {
            try {
                const response = await axios.get('/api/getBalances', {
                    params: { user_id: user_id }
                });
                setBalances(response.data);
                setUpdated(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        if (updated) getBalances();
    }, [updated, user_id]);

    if (!validated) {
        return <Navigate to={'/login'} />;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>List of Balances</h1>
            {balances.length > 0 ? (
                <div className={styles.balanceBox}>
                    {balances.map((balance) => (
                        <div key={balance.balance_id} className={styles.balanceItem}>
                            <div className={styles.balanceInfo}>
                                <h2>{capitalizeFirstLetter(balance.balance_name.replace(/^"|"$/g, ''))}</h2>
                                <h3>
                                    {capitalizeFirstLetter(balance.balance_type)}: ${balance.amount}
                                </h3>
                            </div>
                            <button
                                className={styles.deleteButton}
                                onClick={() => deleteBalance(balance.balance_id)}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className={styles.noBalances}>No balances created yet. Please create one!</p>
            )}
            <div className={styles.navigationButtons}>
                <Link to={'/newbalance'} className={styles.buttonLink}>
                    New Balance
                </Link>
                <Link to={'/'} className={styles.buttonLink}>
                    Return
                </Link>
            </div>
        </div>
    );
};

export default BalanceManager;