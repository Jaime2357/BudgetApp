import { React, useContext, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { MyContext } from '../MyContext';
import axios from "axios";


const BalanceManager = () => {

    const [balances, setBalances] = useState([]);
    const [updated, setUpdated] = useState(true);

    const {user_id, setUserID, validated, setValidated} = useContext(MyContext);

    const deleteBalance = async (selected) => {
        try {
            await axios.post('api/deleteTable', null, {
                params: {
                    balance_id: selected
                }
            });
            console.log('Table Successfully Deleted');
            setUpdated(true);
        }
        catch (e) {
            console.log("Error: ", e);
        }
    }

    useEffect(() => {
        const getBalances = async () => {
            try {
                const response = await axios.get('/api/getBalances', {
                    params: {
                        user_id: user_id
                    }
                });
                setBalances(response.data);
                setUpdated(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // Call the async function
        getBalances();
    }, [updated]);

    const logout = () => {
        setUserID(null);
        setValidated(false);
    }

    if (!validated) {
        return <Navigate to={'/login'} />
    }
    return (

        <div>
            <h1> List of Balances </h1>
            <ul className='menu-list'>
                {balances.map((balance) => (
                    <li>
                        <h1> ({balance.balance_id}) {balance.balance_name} - {balance.balance_type} </h1>
                        <h2> ${balance.amount} </h2>
                        <button onClick={() => deleteBalance(balance.balance_id)}> Delete </button>
                    </li>
                ))}
            </ul>
            <Link to={'/newbalance'}> New Balance </Link>
            <Link to={'/'}> Return </Link>
            <button onClick={logout}> Logout </button>
        </div>
    );

};

export default BalanceManager;
