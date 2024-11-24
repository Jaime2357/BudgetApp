import { React, useEffect, useState, useContext } from 'react';
import {Navigate, Link} from 'react-router-dom';
import {MyContext} from '../MyContext';
import axios from 'axios';

const Login = () => {

    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [invalid, setInvalid] = useState(false);
    const [badName, setBadName] = useState(null);

    const {user_id, setUserID, validated, setValidated} = useContext(MyContext);

    useEffect(() => {
        if(invalid){
            console.log(invalid);
        }
        if(badName){
            console.log(badName);
        }
        if(validated){
            console.log('Verified');
        }
    }, [invalid, badName, validated]);

    const validate = async (e) => {

        e.preventDefault();
        setInvalid(null);
        setBadName(null);

        try{
            const response = await axios.get('/api/login', {
                params: {
                    username,
                    password
                }
            });
            const ID = response.data;
            console.log("ID Returned: ", ID);
            if(ID === -1){
                console.log("Incorrect Password");
                setInvalid("Incorrect Password");
            }
            else if(ID === -2){
                console.log("Username Not Found");
                setBadName('Username Not Found');
            }
            else{
                console.log("Login Verified with ID: ", ID)
                setUserID(ID);
                setValidated(true);
                console.log("Login Successful: User ", user_id);
            }
        }
        catch(e){
            console.log("Error: ", e);
        }

    }

    if(validated){
        return  <Navigate to={'/'} />;
    }
    
        return (
            <div>
                <h1> Login Page</h1>

                <form onSubmit={validate}>
                    <h2> Username </h2>
                    <input 
                        type = "text"
                        value = {username}
                        onChange={(ev) => setUserName(ev.target.value)}
                        placeholder='John'
                        required
                        minLength={1}
                    />
                    {badName && <div className="error-message">{badName}</div>}

                    <h2> Password </h2>
                    <input 
                        type = "text"
                        value = {password}
                        onChange={(ev) => setPassword(ev.target.value)}
                        required
                        minLength={8}
                    />
                    {invalid && <div className="error-message">{invalid}</div>}

                    <button type="submit">Login</button>

                </form>
                <Link to={'/signup'}> "Don't have an account? Register Here" </Link>
            </div>
        );
    

};

export default Login;