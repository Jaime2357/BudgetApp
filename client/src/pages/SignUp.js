import { React, useState } from 'react';
import { Navigate, Link } from 'react-router-dom'
import axios from 'axios';
import styles from '../pageStyling/SignUp.module.css';

const SignUp = () => {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [badName, setBadName] = useState(null);
    const [redirect, setRedirect] = useState(false);

    const createUser = async (e) => {
        e.preventDefault();
        setBadName(null);
        
        try {
            const response = await axios.post('/api/setUser', null, {
                params: { username, password }
            });
            
            if (response.status === 204) {
                setRedirect(true);
            }
            if (response.status === 201) {
                setBadName('Username already exists. Please choose a unique name.');
            }
        }
        catch (e) {
            console.log("Error: ", e);
        }
    }

    if (redirect) return <Navigate to='/login' />;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Sign Up for an Account</h1>
            <div className={styles.formBox}>
                <form onSubmit={createUser}>
                    <h2>Username</h2>
                    <input
                        type="text"
                        value={username}
                        onChange={(ev) => setUserName(ev.target.value)}
                        placeholder='John'
                        required
                        minLength='1'
                        maxLength='20'
                        className={styles.input}
                    />
                    {badName && <div className={styles.errorMessage}>{badName}</div>}

                    <h2>Password</h2>
                    <input
                        type="password"
                        value={password}
                        onChange={(ev) => setPassword(ev.target.value)}
                        required
                        minLength='8'
                        maxLength='16'
                        className={styles.input}
                    />
                    <button type="submit" className={styles.submitButton}>
                        Sign Up
                    </button>
                </form>
            </div>
            <Link to='/login' className={styles.loginLink}>
                Have an account? Login Here
            </Link>
        </div>
    );
};

export default SignUp;