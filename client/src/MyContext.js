import { useState, createContext } from 'react';

export const MyContext = createContext({});

export function MyContextProvider({children}){
    const[user_id, setUserID] = useState(null);
    const[validated, setValidated] = useState(false);

    return (
        <MyContext.Provider value={{user_id,setUserID, validated, setValidated}}>
            {children}
        </MyContext.Provider>
    );

}