import { React, useEffect, useState, useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { MyContext } from '../MyContext';
import axios from 'axios';
import styles from '../pageStyling/Login.module.css';

const Login = () => {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [invalid, setInvalid] = useState(false);
    const [badName, setBadName] = useState(null);
    const { user_id, setUserID, validated, setValidated } = useContext(MyContext);

    useEffect(() => {
        if (invalid) console.log(invalid);
        if (badName) console.log(badName);
        if (validated) console.log('Verified');
    }, [invalid, badName, validated]);

    const validate = async (e) => {
        e.preventDefault();
        setInvalid(null);
        setBadName(null);

        try {
            const response = await axios.get('/api/login', {
                params: { username, password }
            });
            const ID = response.data;
            
            if (ID === -1) {
                setInvalid("Incorrect Password");
            } else if (ID === -2) {
                setBadName('Username Not Found');
            } else {
                setUserID(ID);
                setValidated(true);
            }
        } catch (e) {
            console.log("Error: ", e);
        }
    }

    if (validated) return <Navigate to={'/'} />;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Login Page</h1>
            <div className={styles.formBox}>
                <form onSubmit={validate}>
                    <h2>Username</h2>
                    <input
                        type="text"
                        value={username}
                        onChange={(ev) => setUserName(ev.target.value)}
                        placeholder='John'
                        required
                        minLength={1}
                        className={styles.input}
                    />
                    {badName && <div className={styles.errorMessage}>{badName}</div>}

                    <h2>Password</h2>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(ev) => setPassword(ev.target.value)}
                        required
                        minLength={8}
                        className={styles.input}
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className={styles.toggleButton}
                    >
                        {showPassword ? 'Hide Password' : 'Show Password'}
                    </button>
                    {invalid && <div className={styles.errorMessage}>{invalid}</div>}

                    <button type="submit" className={styles.submitButton}>
                        Login
                    </button>
                </form>
            </div>
            <Link to={'/signup'} className={styles.signupLink}>
                Don't have an account? Register Here
            </Link>
        </div>
    );
};

export default Login;