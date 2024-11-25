import React, {useState, useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { MyContext } from '../MyContext';
import axios from "axios";
import styles from '../pageStyling/NewBalance.module.css';

const NewBalance = () => {
    const [balance_name, setBalanceName] = useState("");
    const [balance_type, setType] = useState('wallet');
    const [amount, setAmount] = useState(0.00);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const {user_id, validated} = useContext(MyContext);

    const createBalance = async (e) => {
        e.preventDefault();
        setError(null);

        if (!balance_name.trim()) {
            setError('Balance name is required.');
            return;
        }

        try {
            const response = await axios.post('api/insertBalance', null, {
                params: {
                    user_id,
                    balance_name,
                    balance_type,
                    amount
                }
            });
            if (response.status === 204) {
                setRedirect(true);
            }
            if (response.status === 201) {
                setError('This balance name already exists. Please choose a unique name.');
            }
        } catch (e) {
            setError('An error occurred. Please try again.');
            console.log("Error: ", e);
        }
    };

    if (redirect) return <Navigate to='/balancemanager' />;
    if (!validated) return <Navigate to='/login' />;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>New Balance</h1>
            <form onSubmit={createBalance} className={styles.newBalanceBox}>
                <h2>Balance Name</h2>
                <input
                    type="text"
                    value={balance_name}
                    onChange={(ev) => setBalanceName(ev.target.value)}
                    placeholder="Savings Account"
                    required
                    minLength="1"
                    maxLength="20"
                    className={styles.input}
                />

                <h2>Initial Balance</h2>
                <input
                    type="number"
                    value={amount}
                    onChange={(ev) => setAmount(parseFloat(ev.target.value))}
                    placeholder="0.00"
                    step="0.01"
                    maxLength="20"
                    className={styles.input}
                />

                <div className={styles.dropdownMenu}>
                    <button 
                        type="button" 
                        className={styles.dropdownButton} 
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {balance_type}
                    </button>
                    {isOpen && (
                        <ul className={styles.menuList}>
                            {['wallet', 'credit'].map((type) => (
                                <p key={type}>
                                    <button 
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setType(type);
                                            setIsOpen(false);
                                        }}
                                    >
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </button>
                                </p>
                            ))}
                        </ul>
                    )}
                </div>

                {error && <div className={styles.errorMessage}>{error}</div>}

                <button type="submit" className={styles.submitButton}>
                    Save
                </button>
            </form>

            <Link to='/balancemanager' className={styles.returnLink}>
                Return
            </Link>
        </div>
    );
};

export default NewBalance;