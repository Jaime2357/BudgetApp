import { React, useEffect, useState } from 'react';
import {Link } from 'react-router-dom';
import axios from "axios";


const BalanceManager = () => {

    const user_id = useState(1); // Again, for testing, will be assigned after login and persist through app with cookies
    const [balances, setBalances] = useState([]);
    const [updated, setUpdated] = useState(true);

    const deleteBalance = async (selected) => {
        try{
            await axios.post('api/deleteTable', null, {
                params: {
                    balance_id: selected
                }
            });
            console.log('Table Successfully Deleted');
            setUpdated(true);
        }
        catch(e){
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

    // if (displayIndex != null) {
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
            </div>
        );
    // }
};

export default BalanceManager;
