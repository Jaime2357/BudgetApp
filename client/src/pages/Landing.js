import {React, useEffect, useState} from 'react';
import axios from "axios";


const Landing = () => {

    const username = useState("Jaime"); //For testing purposes, username will come from login
    const user_id = useState("1"); // Again, for testing, will be assigned after login and persist through app with cookies
    const [balances, setBalances] = useState([]);

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
            console.log("Balance List 1: ", response.data[0].balance_id);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        // Call the async function
        getBalances();
      }, []);

    return(

        <div>
            <h1> User: </h1>
            <h2> {username} </h2>
            <h1> Balances: </h1>
            <div> 
                {balances.length === 0 ? (
                    <h2> No Balances Available </h2>
                ) : (
                    <ul> 
                        {balances.map((balance) => (
                            <li key = {balance.balance_name}> {balance.amount} </li> 
                        ))} 
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Landing;