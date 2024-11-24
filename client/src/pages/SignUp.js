import { React, useState, useEffect } from 'react';
import {Navigate, Link} from 'react-router-dom'
import axios from 'axios';

const SignUp = () => {

    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [badName, setBadName] = useState(null);
    const [redirect, setRedirect] = useState(false);

    const createUser = async (e) => {

        e.preventDefault();
        setBadName(null);
        console.log("Start");
        try{
            var response = await axios.post('/api/setUser', null, {
                params: {
                    username,
                    password
                }
            });
            console.log(response);
            if (response.status === 204) {
                console.log('User Added Successfully');
                setRedirect(true);
            }
            if (response.status === 201) {
                setBadName('Username already exists. Please choose a unique name.');
            }
        }
        catch(e){
            console.log("Error: ", e);
        }
    }

    useEffect(() => {
        if(badName){
            console.log(badName);
        }
        if(redirect){
            console.log('Verified');
        }
    }, [badName, redirect]);

    if(redirect){
        return  <Navigate to={'/login'} />;
    }
    else{
        return (
            <div>
                <h1> Singup Page</h1>

                <form onSubmit={createUser}>
                    <h2> Username </h2>
                    <input 
                        type = "text"
                        value = {username}
                        onChange={(ev) => setUserName(ev.target.value)}
                        placeholder='John'
                        required
                        minLength='1'
                        maxLength='20'
                    />
                    {badName && <div className="error-message">{badName}</div>}

                    <h2> Password </h2>
                    <input 
                        type = "text"
                        value = {password}
                        onChange={(ev) => setPassword(ev.target.value)}
                        required
                        minLength='8'
                        maxLength='16'
                    />
                    <button type="submit">Sign Up</button>

                </form>
                <Link to={'/login'}> "Have an account? Login Here" </Link>
            </div>
        );
    }

};

export default SignUp;