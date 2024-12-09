import { React, useEffect, useState, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { MyContext } from '../MyContext';
import axios from "axios";

import styles from '../pageStyling/Landing.module.css';
import SelectButton from '../assets/Selection Arrow.png';

const Landing = () => {
    const [username, setName] = useState(null);
    const [balances, setBalances] = useState([]);
    const [displayIndex, setDisplay] = useState(14);
    const [balancesOpen, setBalancesOpen] = useState(false);
    const { user_id, validated} = useContext(MyContext);

    const capitalizeFirstLetter = (string) => {
        if (!string) return ""; // Handle empty or null strings
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };


    useEffect(() => {
        const getName = async () => {
            try {
                const nameresp = await axios.get('/api/getNames', {
                    params: { user_id: user_id }
                });
                setName(capitalizeFirstLetter(nameresp.data[0].username));
            } catch (e) {
                console.log("Error: ", e);
            }
        };

        const getBalances = async () => {
            try {
                await axios.post('/api/createTables');
                const response = await axios.get('/api/getBalances', {
                    params: { user_id: user_id }
                });
                setBalances(response.data);
                setDisplay(0);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        getName();
        getBalances();
    }, [user_id]);

    if (!validated) return <Navigate to='/login' />;
    if (displayIndex === null) return <div>Loading...</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Welcome {username}!</h1>
            
            <div className={styles.balanceBox}>
                <div className={styles.balanceHeader}>
                    <button 
                        className={styles.dropdownButton} 
                        onClick={() => setBalancesOpen(!balancesOpen)}
                    >
                        <h1>{balances[displayIndex]?.balance_name.replace(/^"|"$/g, '')}</h1>
                        <img src={SelectButton} alt="Select" className={styles.selectIcon} />
                    </button>
                    
                    {balancesOpen && (
                        <ul className={styles.menuList}>
                            {balances.map((balance, index) => (
                                <button 
                                    key={index}
                                    onClick={() => {
                                        setDisplay(index);
                                        setBalancesOpen(false);
                                    }}
                                >
                                    {balance.balance_name.replace(/^"|"$/g, '')}
                                </button>
                            ))}
                        </ul>
                    )}
                </div>
                <h2 className={styles.amount}>${balances[displayIndex]?.amount}</h2>
            </div>

            <div className={styles.actionLinks}>
                <Link to="/balancemanager" className={styles.buttonLink}>
                    Manage Balances
                </Link>
                <Link to="/transactionmanager" className={styles.buttonLink}>
                    Manage Transactions
                </Link>
            </div>
        </div>
    );
};

export default Landing;
