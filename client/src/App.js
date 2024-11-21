import React from "react";
import { BrowserRouter, Routes , Route} from "react-router-dom";
import './App.css';

import MyContext from "./MyContext";
import Layout from "./pages/Layout";
import Landing from "./pages/Landing";
import axios from "axios";

axios.defaults.baseURL = 'http://127.0.0.1:3001';
//axios.defaults.withCredentials = true;

function App() {

  return (
    <BrowserRouter>
      <MyContext.Provider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
          </Route>
        </Routes>
      </MyContext.Provider>
    </BrowserRouter>
  );
}

export default App;
