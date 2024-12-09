import React from "react";
import { BrowserRouter, Routes , Route} from "react-router-dom";
import axios from "axios";

import {MyContextProvider} from "./MyContext";
import Layout from "./pages/Layout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import BalanceManager from "./pages/BalanceManager";
import NewTransaction from "./pages/NewTransaction";
import TransactionManager from "./pages/TransactionManager"
import NewBalance from "./pages/NewBalance";


axios.defaults.baseURL = 'http://127.0.0.1:3001';
//axios.defaults.withCredentials = true;

function App() {

  return (
    <BrowserRouter>
      <MyContextProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/balancemanager" element={<BalanceManager />} />
            <Route path="/newtransaction" element={<NewTransaction />} />
            <Route path="/transactionmanager" element={<TransactionManager />} /> *
            <Route path="/newbalance" element={<NewBalance />} />
          </Route>
        </Routes>
      </MyContextProvider>
    </BrowserRouter>
  );
}

export default App;

