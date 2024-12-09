import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "../MyContext";
import styles from "../pageStyling/TransactionManager.module.css";

const TransactionManager = () => {
    const { user_id } = useContext(MyContext);
    const [transactions, setTransactions] = useState([]);
    const [balances, setBalances] = useState({});
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch transactions and balances
    useEffect(() => {
        if (!user_id) {
            setError("User ID is not defined.");
            return;
        }

        // Fetch transactions
        axios
            .get("/api/getTransactions", { params: { user_id } })
            .then((response) => {
                setTransactions(response.data);
            })
            .catch((error) => {
                setError(`Error fetching transactions: ${error.message}`);
            });

        // Fetch balances
        axios
            .get("/api/getBalances", { params: { user_id } })
            .then((response) => {
                // Convert balances to an object keyed by balance_id for easy access
                const balanceMap = response.data.reduce((acc, balance) => {
                    acc[balance.balance_id] = balance.balance_name;
                    return acc;
                }, {});
                setBalances(balanceMap);
            })
            .catch((error) => {
                setError(`Error fetching balances: ${error.message}`);
            });
    }, [user_id]);

    const handleDelete = (Tid) => {
        axios
            .delete("/api/getTransactions", {
                params: { 
                    transaction_id: Tid,
                }

            })
            .then(() => {
                setTransactions(
                    transactions.filter(
                        (transaction) => transaction.transaction_id !== Tid
                    )
                );
            })
            .catch((error) => {
                setError(`Error deleting transaction: ${error.message}`);
            });
    };

    // Group transactions by balance_id
    const groupedTransactions = transactions.reduce((acc, transaction) => {
        const { balance_id } = transaction;
        if (!balance_id) {
            console.error("Transaction missing balance_id:", transaction); // Debug: Log any issues
        }
        if (!acc[balance_id]) acc[balance_id] = [];
        acc[balance_id].push(transaction);
        return acc;
    }, {});

    return (
        <div className={styles.transactionManager}>
            <h1 className={styles.title}>Transaction Manager</h1>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.transactionBox}>
                {Object.keys(groupedTransactions).length > 0 ? (
                    Object.entries(groupedTransactions).map(
                        ([balanceId, transactions]) => (
                            <div
                                key={balanceId}
                                className={styles.balanceSection}
                            >
                                <h2 className={styles.balanceTitle}>
                                    Balance: {balances[balanceId] || "Unknown"} {/* Map balance_id to balance_name */}
                                </h2>
                                {transactions.map((transaction) => (
                                    <div
                                        key={transaction.transaction_id}
                                        className={styles.transactionItem}
                                    >
                                        <div className={styles.transactionInfo}>
                                            <span>
                                                <strong>
                                                    {transaction.transaction_name}
                                                </strong>
                                            </span>
                                            <span>
                                                {transaction.transaction_type}
                                            </span>
                                            <span>
                                                ${transaction.amount}
                                            </span>
                                        </div>
                                        <div
                                            className={
                                                styles.transactionButtons
                                            }
                                        >
                                            <button
                                                className={styles.deleteButton}
                                                onClick={() =>
                                                    handleDelete(
                                                        transaction.transaction_id,
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    )
                ) : (
                    <p className={styles.noTransactions}>
                        No transactions made yet.
                    </p>
                )}
            </div>
            <Link to="/newtransaction" className={styles.addButton}>
                Add Transaction
            </Link>

            <button
                onClick={() => navigate("/")}
                className={styles.returnButton}
            >
                Return
            </button>
        </div>
    );
};

export default TransactionManager;