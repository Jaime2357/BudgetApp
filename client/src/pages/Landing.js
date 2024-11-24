import { React, useEffect, useState, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { MyContext } from '../MyContext';
import axios from "axios";


const Landing = () => {

    const [username, setName] = useState(null); //For testing purposes, username will come from login
    const [balances, setBalances] = useState([]);
    const [displayIndex, setDisplay] = useState(14);

    const [balancesOpen, setBalancesOpen] = useState(false);
    const [transactionsOpen, setTransactionsOpen] = useState(false);

    const {user_id, setUserID, validated, setValidated} = useContext(MyContext);

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

    useEffect(() => {
        const getName = async () => {
            try {
                const nameresp = await axios.get('/api/getNames', {
                    params: {
                        user_id: user_id
                    }
                });
                console.log("Names - 1: ", nameresp.data);
                setName(nameresp.data[0].username);
            }
            catch (e) {
                console.log("Error: ", e);
            }
        }
        const getBalances = async () => {
            try {
                await axios.post('/api/createTables');
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
        getName();
        getBalances();
    }, []);

    const logout = () => {
        setUserID(null);
        setValidated(false);
    }

    if (!validated) {
        return <Navigate to={'/login'} />
    }

    if (displayIndex === null) {
        return <div> Loading... </div>
    }

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
            <Link to={'/balancemanager'}>
                            Manage Balances
                        </Link>
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
                    </ul>
                )}
            </div>
            <button onClick={logout}> Logout </button>

        </div>
    );

};

export default Landing;
