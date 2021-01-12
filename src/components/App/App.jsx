import React, { useState, useEffect, useContext } from "react"
import Dashboard from "../Dashboard/Dashboard"
import "./App.css"
import { BrowserRouter, Switch as RouterSwitch, Route, Link as RouterLink, useLocation } from "react-router-dom"
import * as config from './config'
import {log} from './config'
import {AuthContext} from './auth'
import Login from '../../pages/Login'
import Cookies from 'universal-cookie';

export default function App() {

    const [token, setToken] = useState('');
    const [userAuthorised, SetUserAuthorisation] =  useState(false);

    useEffect(() => {
        const cookies = new Cookies();
        const tokenLookup = cookies.get('token')
        if (tokenLookup !== undefined){
            setToken(tokenLookup)
        }
    }, [])

    return (
        <div id="App">
            <AuthContext.Provider value={{ token, setToken }}>
                {token === '' ? 
                <Login />
                :  
                <BrowserRouter>
                    <Dashboard/>
                </BrowserRouter>}
            </AuthContext.Provider>
        </div>
    )
  
}
