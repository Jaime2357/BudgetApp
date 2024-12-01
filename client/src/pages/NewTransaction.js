//Menu to log new transaction
//Transaction Type to be sepcified in parameters on landing page (Spending, Income, Transfer, Pay Credit)
// If spending, amount inputted is subtracted from specified wallet balance or added to credit balance

import React, { useState, useContext } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { MyContext } from "../MyContext";
import styles from "../pageStyling/NewTransaction.module.css";

const NewTransaction = () => {
    const {user_id, validated} = useContext(MyContext);
    const [transaction_type, setTransactionType] = useState('spending');
    const [amount, setAmount] = useState(0.00);
    const [error, setError] = useState(null);
    const [redirect, setRedirect] = useState(false);
    const [balance_id, setBalanceID] = useState(0);
    const [transaction_name, setTransactionName] = useState("");

    const createTransaction = async (e) => {
        e.preventDefault();
        setError(null);

        if (!transaction_name.trim()) {
            setError('Transaction name is required.');
            return;
        }

        try {
            const response = await axios.post('api/insertTransaction', null, {
                params: {
                    balance_id,
                    user_id,
                    transaction_name,
                    transaction_type,
                    amount
                }
            });
            if (response.status === 204) {
                setRedirect(true);
            }
            if (response.status === 201) {
                setError('This transaction name already exists. Please choose a unique name.');
            }
        } catch (e) {
            setError('An error occurred. Please try again.');
            console.log("Error: ", e);
        }
    };
    if (redirect) return <Navigate to='/balancemanager' />;
    if (!validated) return <Navigate to='/login' />;

    return(
        <div className={styles.container}>
            <h1 className={styles.title}>New Transaction</h1>
            <form onSubmit={createTransaction} className={styles.newTransactionBox}>
                <h2>Transaction Name</h2>
                <input
                    type="text"
                    value={transaction_name}
                    onChange={(ev) => setTransactionName(ev.target.value)}
                    placeholder="Groceries"
                    required
                    minLength="1"
                />
                <h2>Transaction Type</h2>
                <select
                    value={transaction_type}
                    onChange={(ev) => setTransactionType(ev.target.value)}
                >
                    <option value="spending">Spending</option>
                    <option value="income">Income</option>
                    <option value="transfer">Transfer</option>
                    <option value="pay credit">Pay Credit</option>
                </select>
                <h2>Amount</h2>
                <input
                    type="number"
                    value={amount}
                    onChange={(ev) => setAmount(ev.target.value)}
                    placeholder="0.00"
                    required
                    min="0.01"
                />
                <button type="submit" className={styles.submitButton}>Submit</button>
                {error && <p className={styles.error}>{error}</p>}
            </form>
        </div>
    );
}

export default NewTransaction;