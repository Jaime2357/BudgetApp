import React, { useEffect, useState, useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { MyContext } from '../MyContext';
import axios from "axios";

const NewBalance = () => {
    const [balance_name, setBalanceName] = useState("");
    const [balance_type, setType] = useState('wallet');
    const [amount, setAmount] = useState(0.00);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [redirect, setRedirect] = useState(false);

    const {user_id, validated} = useContext(MyContext);

    const createBalance = async (e) => {
        e.preventDefault();
        setError(null);

        if (!balance_name.trim()) {
            setError('Balance name is required.');
            return;
        }

        try {
            var response = await axios.post('api/insertBalance', null, {
                params: {
                    user_id,
                    balance_name,
                    balance_type,
                    amount
                }
            });
            console.log(response);
            if (response.status === 204) {
                console.log('Balance Successfully Added');
                setRedirect(true);
            }
            if (response.status === 201) {
                setError('This balance name already exists. Please choose a unique name.');
            }
        } catch (e) {
            setError('An error occurred. Please try again.');
            console.log("Error: ", e);
        }
    };

    const toggleList = (e) => {
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    const selectorAction = (e, selection) => {
        e.preventDefault();
        setType(selection);
        setIsOpen(false);
    };

    useEffect(() => {
        console.log(error);
    }, [error]);

    if (redirect) {
        return <Navigate to={'/balancemanager'} />;
    }

    if (!validated) {
        return <Navigate to={'/login'} />
    }

    return (
        <div>
            <form onSubmit={createBalance}>
                <h1>New Balance</h1>

                <h2 className="text-2xl mt-4 mb-2">Balance Name</h2>
                <input
                    type="text"
                    value={balance_name}
                    onChange={(ev) => setBalanceName(ev.target.value)}
                    placeholder="Savings Account"
                    required
                    minLength="1"
                    maxLength="20"
                />

                <h2 className="text-2xl mt-4 mb-2">Initial Balance</h2>
                <input
                    type="number"
                    value={amount}
                    onChange={(ev) => setAmount(parseFloat(ev.target.value))}
                    placeholder="0.00"
                    step="0.01"
                    maxLength="20"
                />

                <div className='dropdown-menu'>
                    <button type="button" className='dropdown-button' onClick={toggleList}>
                        Account Type: {balance_type}
                    </button>
                    {isOpen && (
                        <ul className='menu-list'>
                            <li><button type="button" onClick={(e) => selectorAction(e, 'wallet')}>Wallet</button></li>
                            <li><button type="button" onClick={(e) => selectorAction(e, 'credit')}>Credit</button></li>
                        </ul>
                    )}
                </div>

                {error && <div className="error-message">{error}</div>}

                <button type="submit">Create Balance</button>
            </form>

            <Link to={'/balancemanager'}> Return </Link>
        </div>
    );
};

export default NewBalance;
