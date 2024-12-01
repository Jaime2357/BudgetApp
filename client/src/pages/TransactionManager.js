//List of transactions with buttons for deletion and updates
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import styles from "../pageStyling/TransactionManager.module.css";

const TransactionManager = () => {
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        axios.get("/api/transactions")
            .then(response => {
                setTransactions(response.data);
            })
            .catch(error => {
                setError(error.message);
            });
        }, []
    );

    const handleDelete = (id) => {
        axios.delete(`/api/transactions/${id}`)
            .then(() => {
                setTransactions(transactions.filter(transaction => transaction.id !== id));
            })
            .catch(error => {
                setError(error.message);
            });
    };

    const handleUpdate = (id) => {
        navigate(`/update-transaction/${id}`);
    };

    return (
        <div className={styles.transactionManager}>
            <h1>Transaction Manager</h1>
            {error && <p className={styles.error}>{error}</p>}
            <ul className={styles.transactionList}>
                {transactions.map(transaction => (
                    <li key={transaction.id} className={styles.transactionItem}>
                        <span>{transaction.description}</span>
                        <span>{transaction.amount}</span>
                        <button onClick={() => handleUpdate(transaction.id)}>Update</button>
                        <button onClick={() => handleDelete(transaction.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <Link to="/add-transaction" className={styles.addButton}>Add Transaction</Link>
        </div>
    );
};

export default TransactionManager;