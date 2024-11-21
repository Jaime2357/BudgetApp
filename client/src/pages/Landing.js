import { React, useEffect, useState } from 'react';
import axios from "axios";


const Landing = () => {

    const username = useState("Jaime"); //For testing purposes, username will come from login
    const user_id = useState("1"); // Again, for testing, will be assigned after login and persist through app with cookies
    const [balances, setBalances] = useState([]);
    const [displayIndex, setDisplay] = useState(14);

    const [balancesOpen, setBalancesOpen] = useState(false);
    const [transactionsOpen, setTransactionsOpen] = useState(false);

    const toggleBalanceList = () => {
        setBalancesOpen(!balancesOpen);
    };

    const toggleTransactionList = () => {
        setTransactionsOpen(!transactionsOpen);
    };

    const selectorAction = (selection) => {
        setBalancesOpen(!balancesOpen);
        setDisplay(selection);
    };

    const pageNav = (selection) => {
        setTransactionsOpen(!transactionsOpen);
    };

    useEffect(() => {
        console.log("reached");
        const getBalances = async () => {
            try {
                const response = await axios.get('/api/getBalances', {
                    params: {
                        user_id: user_id
                    }
                });
                setBalances(response.data);
                setDisplay(0);
                console.log("Data: ", response.data);
                console.log("Display Index: ", displayIndex)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // Call the async function
        getBalances();
    }, []);

    if (displayIndex != null) {
        return (

            <div>
                <h1> Welcome {username} </h1>
                <div>
                    {balances.length !== 0 && (
                        <div className='dropdown-menu'>
                            <button className='dropdown-button' onClick={toggleBalanceList}>
                                Select Balance
                            </button>
                            {balancesOpen && (
                                <ul className='menu-list'>
                                    {balances.map((balance, index) => (
                                        <button onClick={() => selectorAction(index)}>
                                            {/* <button> */}
                                            {balance.balance_name}
                                        </button>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
                <div>
                    {balances.length === 0 ? (
                        <h2> No Balances Available </h2>
                    ) : (
                        <div>
                            <h1> {balances[displayIndex].balance_name}:</h1>
                            <h2>${balances[displayIndex].amount}</h2>
                        </div>
                    )}
                </div>
                <div className='dropdown-menu'>
                    <button className='dropdown-button' onClick={toggleTransactionList}>
                        New Transaction
                    </button>
                    {transactionsOpen && (
                        <ul className='menu-list'>
                            {/* <button onClick={() => pageNav()}> */}
                            <button> Income </button>
                            {/* <button onClick={() => pageNav()}> */}
                            <button> Spending </button>
                            {/* <button onClick={() => pageNav()}> */}
                            <button> Credit Payment </button>
                            {/* <button onClick={() => pageNav()}> */}
                            <button> Transfer </button>
                            =                        </ul>
                    )}
                </div>
            </div>
        );
    }
};

export default Landing;