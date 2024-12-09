import React, { useState, useContext, useEffect } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { MyContext } from "../MyContext";
import styles from "../pageStyling/NewTransaction.module.css";

const NewTransaction = () => {
    const { user_id, validated } = useContext(MyContext);
    const [transaction_type, setTransactionType] = useState("spending");
    const [amount, setAmount] = useState(0.00);
    const [error, setError] = useState(null);
    const [balance_id, setBalanceID] = useState(0);
    const [transaction_name, setTransactionName] = useState("");
    const [to_balance_id, setToBalanceID] = useState(null); // For transfer transactions
    const [balances, setBalances] = useState([]);
    const [balance_type, setBalanceType] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    // Fetch balances and set transaction type from query params
    useEffect(() => {
        const fetchBalances = async () => {
          try {
            const response = await axios.get('/api/getBalances', { params: { user_id } });
            if (response.data.length > 0) {
              setBalances(response.data);
              setBalanceID(response.data[0].balance_id);
              setBalanceType(response.data[0].balance_type); // Initialize balance_type
            } else {
              setError("No balances available. Please create a balance first.");
            }
          } catch (error) {
            console.error("Error fetching balances:", error);
            setError("Failed to load balances.");
          }
        };
        fetchBalances();
      
        const params = new URLSearchParams(location.search);
        const type = params.get("type");
        if (type) setTransactionType(type);
      }, [user_id, location.search]);

      const createTransaction = async (e) => {
        e.preventDefault();
        setError(null);
      
        if (!transaction_name.trim() || !balance_id || amount <= 0 || !balance_type) {
          setError("All fields are required, and amount must be greater than 0.");
          return;
        }

        if (transaction_type === "transfer" && !to_balance_id) {
            setError("Target balance must be selected for transfer transactions.");
            return;
        }

        // Disallow transfer to/from credit balance types
        if (transaction_type === "transfer" && to_balance_id === balance_id) {
            setError("Cannot transfer to the same balance.");
            return;
        }

        console.log("Spending Balance Type:", balance_type);

        try {
            // Step 1: Create the transaction
            await axios.post("/api/newTransactions", {
                user_id,
                balance_id,
                balance_type,
                transaction_name,
                transaction_type,
                amount,
                to_balance_id: transaction_type === "transfer" ||
                    transaction_type === "pay credit" ? to_balance_id : null,
            });

            navigate("/transactionmanager");
        } catch (e) {
            console.error("Error creating transaction:", e);
            setError("An error occurred. Please try again.");
        }
    };

    if (!validated) return <Navigate to="/login" />;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>New Transaction</h1>
            <form onSubmit={createTransaction} className={styles.newTransactionBox}>
                <h2>Transaction Name</h2>
                <input
                    type="text"
                    value={transaction_name}
                    onChange={(e) => setTransactionName(e.target.value)}
                    placeholder="e.g., Groceries"
                    required
                />
                <h2>Transaction Type</h2>
                <select
                    value={transaction_type}
                    onChange={(e) => setTransactionType(e.target.value)}
                >
                    <option value="spending">Spending</option>
                    <option value="income">Income</option>
                    <option value="transfer">Transfer</option>
                    <option value="pay credit">Pay Credit</option>
                </select>
                <h2>Select Balance</h2>
                <select
                    value={balance_id}
                    onChange={(e) => {
                        const selectedBalanceId = e.target.value;
                        setBalanceID(selectedBalanceId);
                        const selectedBalance = balances.find(b => b.balance_id.toString() === selectedBalanceId);
                        if (selectedBalance) {
                            setBalanceType(selectedBalance.balance_type);
                        } else {
                            setBalanceType(null);
                        }
                    }}
                    required
                >
                    <option value="">Select Balance</option>
                    {balances
                        .filter(
                            (b) => {
                                if (transaction_type === "pay credit" || transaction_type === "transfer" || transaction_type === "income") {
                                    return b.balance_id.toString() !== to_balance_id && // Exclude the selected "Select Balance"
                                        b.balance_type !== "credit" // Exclude balances with the type "credit"
                                }
                                return true;
                            })
                        .map((balance) => (
                            <option key={balance.balance_id} value={balance.balance_id}>
                                {balance.balance_name}
                            </option>
                        ))}
                </select>

                {transaction_type === "transfer" && (
                    <>
                        <h2>To Balance</h2>
                        <select
                            value={to_balance_id}
                            onChange={(e) => setToBalanceID(e.target.value)}
                            required
                        >
                            <option value="">Select Balance</option>
                            {balances
                                .filter(
                                    (b) =>
                                        b.balance_id.toString() !== balance_id && // Exclude the selected "Select Balance"
                                        b.balance_type !== "credit" // Exclude balances with the type "credit"
                                )
                                .map((balance) => (
                                    <option key={balance.balance_id} value={balance.balance_id}>
                                        {balance.balance_name}
                                    </option>
                                ))}
                        </select>
                    </>
                )}
                {transaction_type === "pay credit" && (
                    <>
                        <h2>To Balance</h2>
                        <select
                            value={to_balance_id}
                            onChange={(e) => setToBalanceID(e.target.value)}
                            required
                        >
                            <option value="">Select Balance</option>
                            {balances
                                .filter(
                                    (b) =>
                                        b.balance_id.toString() !== balance_id && // Exclude the selected "Select Balance"
                                        b.balance_type !== "wallet" // Exclude balances with the type "wallet"
                                )
                                .map((balance) => (
                                    <option key={balance.balance_id} value={balance.balance_id}>
                                        {balance.balance_name}
                                    </option>
                                ))}
                        </select>
                    </>
                )}
                <h2>Amount</h2>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                    placeholder="0.00"
                    required
                />
                <button type="submit" className={styles.submitButton}>
                    Submit
                </button>
                <button
                    type="button"
                    className={styles.returnButton}
                    onClick={() => navigate(-1)}
                >
                    Return
                </button>
                {error && <p className={styles.error}>{error}</p>}
            </form>
        </div>
    );
};

export default NewTransaction;