import React, { useState, useEffect, useContext } from "react";
import {AuthContext} from '../../components/App/auth'

import clsx from "clsx";
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import DoneIcon from '@material-ui/icons/Done';
import {
    Grid,
    Paper,
    Button
} from "@material-ui/core";

import * as config from '../../components/App/config'
import { log , reindexArray} from '../../components/App/utils'
import * as layout from '../../components/Layout'
import * as UsersAPI from '../../components/api/UsersAPI.js'

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

// import Chart from "./Chart";
// import UserCard from "./UserCard";
// import Submissions from "./Submissions";

import { Switch, Route, Link as RouterLink, useParams, useRouteMatch, useHistory } from "react-router-dom";

const Users = (props) => {
    let { path, url } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={path}>
                <div><API page={props.page} personPage={false}/></div>
            </Route>
            <Route path={`${path}/:id`}>
                <div><API page={props.page} personPage={true}/></div>
            </Route>
        </Switch>
    );
}

const BASE_URL = 'https://192.168.114.171'
const API_URL = BASE_URL + '/api'

const API = (props) => {
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [items, setItems] = useState([])
    const [itemsArray, setItemsArray] = useState([])
    const [pageCount, setPageCount] = useState(1)
    const [page, setPage] = useState(1)
    const [photos, setPhotos] = useState([])
    const [personFaces, setPersonFaces] = useState([])

    let apiUrl = 'https://reqres.in/api/users?page=' + props.page

    const { token } = useContext(AuthContext);
    
    const retrieveItems = () => {
        // log(result)
        let queryToken = '&token=' + token
        let offset = page  == undefined ? '&per-page=10&page=1' : '&per-page=10&page=' + page

        fetch(config.NEW_USERS_URL + '?fields=login,role' + offset, {
            method: 'GET',
            // mode:'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(res => {
            setPageCount(parseInt(res.headers.get('X-Pagination-Page-Count')))
            // res.headers.forEach((e) => {
            //     log(e)
            // })
            // log(res.headers.keys().next())
            return res.json()
        })
        .then(
            (personsResponce) => {
                log(personsResponce)
                setIsLoaded(true)
                let itemBuffer = []
                let personFacesBuffer = []
                let promises = []
                personsResponce.forEach(person => (
                    promises.push(fetchPersonPhotos(person, queryToken).then((result) => {
                        // log(result)
                        if (result[0] === undefined) {
                            return {
                                id: '',
                                photo_id: '',
                            }
                        }
                        else {
                            itemBuffer[person.id] = result[0].photo_id
                            personFacesBuffer[person.id] = result
                            return {
                                id: result[0].id ?? '',
                                photo_id: result[0].photo_id ?? '',
                            }
                        }

                    }))
                ))
                Promise.all(promises).then((photos) => {
                    setPersonFaces(personFacesBuffer)
                    log(personFacesBuffer)
                    setPhotos(itemBuffer)
                })
                setItems(personsResponce)
                setItemsArray(reindexArray(personsResponce, 'login'))
            },
            (error) => {
                log(error)
                setIsLoaded(true)
                setError(error)
            }
        )

    }

    const [personPhotos, setPersonPhotos] = useState([])

    const fetchPersonPhotos = async (person, queryToken) => {
        // log(person)
        let url = config.PERSONS_URL + '/' + person.id + '/faces?' + queryToken
        let requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }
        const response = await fetch(url, requestOptions);
        const jsonData = await response.json();
        // log('photo request' + person.id)
        // setPersonPhotos(jsonData)
        // log(jsonData)
        return jsonData
    }

    useEffect(() => {
        setPage(props.page)
    }, [])

    useEffect(retrieveItems, [page])
    
    const classes = layout.makeCommonClasses()
    const dynamicPaper = clsx(classes.paper, classes.blurredBackground, classes.animatedBox, classes.zoomIn, classes.paperHover)

    let { id } = useParams();

    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <div>Loading...</div>
    } else if (!props.personPage) {
        return (
        <div>
            <Route>
                {({ location }) => {
                    const query = new URLSearchParams(location.search);
                    const page = parseInt(query.get('page') || '1', 10);
                    setPage(page)
                    log('pagination update');
                    return (
                        <Pagination 
                        count={10} 
                        page={page}
                        count={pageCount}
                        variant="outlined" 
                        shape="rounded" 
                        showFirstButton 
                        showLastButton
                        renderItem={(item) => (
                            <PaginationItem
                            component={RouterLink}
                            to={`/persons${item.page === 1 ? '' : `?page=${item.page}`}`}
                            {...item}
                            />
                        )} />
                    );
                }}
            </Route>
            <br />
            <NewUserDialog updateCallback={retrieveItems} token={token}/>
            <br />
            <br />
            {items.map(item => (
                <div key={item.login}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Paper elevation={5} className={dynamicPaper}>
                                <PersonBlock data={item} imageSrc={item.avatar} photos={photos} token={token}/>
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            ))}
                
            
        </div>
        
        );
    }
    else {
        return (<PersonDescription data={itemsArray[id]} personFaces={personFaces} token={token}/>)
    }
}


const PersonDescription = (props) => {
    let { id } = useParams();
    // log(props)
    let history = useHistory();
    return (
        <div className='soma-person-desc'>
            <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => {history.goBack()}}
            >
                {'< Назад'}
            </Button>
            <Button
                variant="contained"
                color="primary"
                size="large"
                disabled={true}
                onClick={() => {history.goBack()}}
            >
                {'Изменить'}
            </Button>
            <br />
            <Grid container spacing={3}>
                
                <Grid item xs={6}>
                    <div className='soma-person-data-desc-text'> Логин: {props.data.login} </div>
                    <div className='soma-person-data-dc'> Роль: {props.data.role} </div>
                </Grid>
            </Grid>
           
            
        </div>
    );
}

const PersonBlock = (props) => {
    let classes = layout.makeCommonClasses();
    return (
        <RouterLink className='soma-person-block'  key={props.id} to={'/users/' + props.data.login}>
            <PersonData data={props.data} />
        </RouterLink>
    )
}

// const PersonImage = (props) => {
//     let photoID = props.photos[props.id]
//     // log(props);
//     // log(photoID);
//     return (
//         <div className='soma-person-image'> 
//             <img src={config.PHOTOS_URL + '/' + photoID + '?token=' +props.token} />
//         </div>
//     )
    
// }

const PersonData = (props) => {
    return (
        <div className='soma-person-data'> 
            <div className='soma-person-data-text'> Логин: {props.data.login} </div>
            <div className='soma-person-data-dc'> Роль: {props.data.role} </div>
            <div className='soma-person-data-id'> #{props.data.id} </div>

        </div>
    )
}


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});



function NewUserDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [login, setLogin] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [passwordRepeat, setPasswordRepeat] = React.useState('');
    const [passwordRepeatText, setPasswordRepeatText] = React.useState('Повторите пароль');

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    const handleSave = () => {
        if (passwordRepeat !== password) {
            alert('Пароли не совпадают')
            return
        }

        if (password.length < 16) {
            alert('Длина пароля должна быть не менее 16 символов')
            return
        }

        UsersAPI.addUser({
            login: login,
            password: password,
            role: "admin"
        }, props.token).then(res => {
            props.updateCallback()
            setOpen(false);
        })
    }

    return (
      <div>
        <Button 
            onClick={handleClickOpen}
            variant="contained"
            color="primary"
            size="large"
            disabled={false}>
          Добавить пользователя
        </Button>
        <Dialog 
            open={open} 
            onClose={handleClose} 
            aria-labelledby="form-dialog-title"
            TransitionComponent={Transition}
            keepMounted
            fullWidth={true}
            maxWidth={'sm'}>
          <DialogTitle id="form-dialog-title">Новый пользователь</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              id="name"
              label="Логин"
              fullWidth
              onChange={e => setLogin(e.target.value)}
            />
            <TextField
              autoFocus
              id="password"
              type="password"
              label="Пароль"
            //   color="warning"
              fullWidth
              onChange={e => setPassword(e.target.value)}
            />
            <TextField
              autoFocus
              id="passwordRepeat"
              type="password"
              label={passwordRepeatText}
              fullWidth
              onChange={e => setPasswordRepeat(e.target.value)}
            />
            <br />
            <br />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Отменить
            </Button>
            <Button onClick={handleSave} color="primary">
              Сохранить
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
}


export default Users