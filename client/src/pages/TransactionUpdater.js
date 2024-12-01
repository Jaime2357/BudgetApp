//Form for updating transaction
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../pageStyling/TransactionUpdate.module.css";

const TransactionUpdater = ({transactionId, refreshTransactions}) => {
    const [transaction_name, setTransactionName] = useState("");
    const [transaction_type, setTransactionType] = useState('spending');
    const [amount, setAmount] = useState(0.00);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const getTransaction = async () => {
            try {
                const response = await axios.get('api/getTransaction', {
                    params: {
                        transaction_id: transactionId
                    }
                });
                setTransactionName(response.data.transaction_name);
                setTransactionType(response.data.transaction_type);
                setAmount(response.data.amount);
            } catch (e) {
                console.log("Error: ", e);
            }
        };
        getTransaction();
    }, [transactionId]);

    const updateTransaction = async (e) => {
        e.preventDefault();
        setError(null);

        if (!transaction_name.trim()) {
            setError('Transaction name is required.');
            return;
        }

        try {
            const response = await axios.put('api/updateTransaction', null, {
                params: {
                    transaction_id: transactionId,
                    transaction_name,
                    transaction_type,
                    amount
                }
            });
            if (response.status === 204) {
                refreshTransactions();
                setIsOpen(false);
            }
            if (response.status === 201) {
                setError('This transaction name already exists. Please choose a unique name.');
            }
        } catch (e) {
            setError('An error occurred. Please try again.');
            console.log("Error: ", e);
        }
    };

    return (
        <div className={styles.container}>
            <button onClick={() => setIsOpen(!isOpen)} className={styles.updateButton}>Update Transaction</button>
            {isOpen && (
                <form onSubmit={updateTransaction} className={styles.updateBox}>
                    <h2>Transaction Name</h2>
                    <input
                        type="text"
                        value={transaction_name}
                        onChange={(ev) => setTransactionName(ev.target.value)}
                        placeholder="Groceries"
                        required
                    />
                    <h2>Transaction Type</h2>
                    <select
                        value={transaction_type}
                        onChange={(ev) => setTransactionType(ev.target.value)}
                        required
                    >
                        <option value="spending">Spending</option>
                        <option value="income">Income</option>
                    </select>
                    <h2>Amount</h2>
                    <input
                        type="number"
                        value={amount}
                        onChange={(ev) => setAmount(parseFloat(ev.target.value))}
                        required
                    />
                    <button type="submit" className={styles.updateButton}>Update</button>
                    <button onClick={() => setIsOpen(false)} className={styles.cancelButton}>Cancel</button>
                    {error && <p className={styles.error}>{error}</p>}
                </form>
            )}
        </div>
    );
};
export default TransactionUpdater;