import React, { useState, useEffect, useContext }  from "react"
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
// import { Switch, Route, Link, useParams, useRouteMatch } from "react-router-dom";
import {makeCommonClasses} from '../../components/Layout'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import * as config from '../../components/App/config'
import {log} from '../../components/App/config'
import {AuthContext} from '../../components/App/auth'
import Cookies from 'universal-cookie';


const Login = () => {
    const classes = makeCommonClasses();
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const { setToken } = useContext(AuthContext);
    const cookies = new Cookies();

    const handleLogin = () => {
        fetch(config.LOGIN_URL, {
            method: 'POST',
            body: JSON.stringify({
                login: login,
                password: password
            }),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            mode: 'cors',
            cache: 'default',
        })
        .then(res => res.json())
        .then(
            (result) => {
                // log('login attempt')
                log(result)
                setToken(result.token)
                let date = new Date()
                date = date.setDate(date.getDate() + 1);
                cookies.set('token', result.token, { path: '/', Expires: date });
                
                // SetUserAuthorisation(true)
            },
            (error) => {
                log(error)
            }
        )
    }
    return (
        <div>
        <Card className={classes.loginCard}>
            <CardContent>
                <form className={classes.loginForm} noValidate autoComplete="off">
                    {/* <TextField id="standard-basic" label="Standard" /> */}
                    {/* <TextField id="filled-basic" label="Filled" variant="filled" /> */}
                    <TextField id="login" 
                        fullWidth 
                        label="Имя пользователя" 
                        variant="filled" 
                        value={login} 
                        onChange={e => setLogin(e.target.value)}/>
                    <br />
                    <TextField id="password" 
                        fullWidth 
                        label="Пароль" 
                        variant="filled" 
                        value={password} 
                        type="password"
                        onChange={e => setPassword(e.target.value)}/>
                </form>
                <br />
                <Button onClick={handleLogin} variant="contained" fullWidth color="primary" type="submit">Войти</Button>
            </CardContent>
        </Card>
        
        
        </div>
        );
    }
    
    
    export default Login;