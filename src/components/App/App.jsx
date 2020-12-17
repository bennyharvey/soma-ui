import React, { useState, useEffect } from "react"
import Dashboard from "../Dashboard/Dashboard"
import "./App.css"
import { BrowserRouter, Switch as RouterSwitch, Route, Link as RouterLink, useLocation } from "react-router-dom"
import * as config from './config'


export default function App() {
    return (
        <div id="App">
            <BrowserRouter>
                <Dashboard/>
            </BrowserRouter>
        </div>
    )
}
