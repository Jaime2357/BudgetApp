import React, { useState, useContext, useEffect } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { MyContext } from "../MyContext";
import styles from "../pageStyling/NewTransaction.module.css";

const NewTransaction = () => {
    const { user_id, validated } = useContext(MyContext);
    const [transaction_type, setTransactionType] = useState('spending');
    const [amount, setAmount] = useState(0.00);
    const [error, setError] = useState(null);
    const [redirect, setRedirect] = useState(false);
    const [balance_id, setBalanceID] = useState(0);
    const [transaction_name, setTransactionName] = useState("");
    const [balances, setBalances] = useState([]); // Initialize balances state
    const location = useLocation();
    const navigate = useNavigate();

    // Fetch balances and set transaction type from query params
    useEffect(() => {
        const fetchBalances = async () => {
            try {
                const response = await axios.get('/api/getBalances', {
                    params: { user_id: user_id }
                });
                if (response.data.length > 0) {
                    setBalances(response.data); // Store available balances
                    setBalanceID(response.data[0].balance_id); // Default to the first balance
                } else {
                    setError('No balances available. Please create a balance first.');
                }
            } catch (error) {
                console.error('Error fetching balances:', error);
                setError('Failed to load balances.');
            }
        };

        fetchBalances();

        // Get transaction type from URL params
        const params = new URLSearchParams(location.search);
        const type = params.get('type');
        if (type) {
            setTransactionType(type);
        }
    }, [user_id, location.search]);

    // Function to create a new transaction
    const createTransaction = async (e) => {
        e.preventDefault();
        setError(null);
    
        // Ensure required fields are filled
        if (!transaction_name.trim()) {
            setError('Transaction name is required.');
            return;
        }
        if (!balance_id || balance_id === 0) {
            setError('Balance ID is required.');
            return;
        }
        if (!amount || amount <= 0) {
            setError('Amount must be greater than 0.');
            return;
        }
    
        try {
            // Send the data as JSON in the body
            const response = await axios.post('/api/newTransactions', {
                balance_id,
                user_id,
                transaction_name,
                transaction_type,
                amount,
            });
            if (response.status === 204) {
                setRedirect(true);
            }
        } catch (e) {
            setError(e.response?.data?.message || 'An error occurred. Please try again.');
            console.log("Error: ", e);
        }
    };
    

    if (redirect) return <Navigate to='/balancemanager' />;
    if (!validated) return <Navigate to='/login' />;

    return (
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
                <h2>Select Balance</h2>
                <select
                    value={balance_id}
                    onChange={(ev) => setBalanceID(ev.target.value)}
                >
                    {balances.map((balance) => (
                        <option key={balance.balance_id} value={balance.balance_id}>
                            {balance.balance_name}
                        </option>
                    ))}
                </select>
                <h2>Amount</h2>
                <input
                    type="number"
                    value={amount}
                    onChange={(ev) => setAmount(ev.target.value)}
                    placeholder="0.00"
                    required
                    min="0.00"
                />
                <button type="submit" className={styles.submitButton}>Submit</button>
                {error && <p className={styles.error}>{error}</p>}
            </form>

            <div className={styles.buttonContainer}>
                {/* Button to navigate to Transaction Manager */}
                <button 
                    onClick={() => navigate('/transactionmanager')} 
                    className={styles.manageButton}
                >
                    Manage Transactions
                </button>

                {/* Button to navigate back */}
                <button 
                    onClick={() => navigate(-1)} 
                    className={styles.returnButton}
                >
                    Return
                </button>
            </div>
        </div>
    );
};

export default NewTransaction;
