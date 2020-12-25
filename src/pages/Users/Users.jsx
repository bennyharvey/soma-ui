import React, { useState, useEffect } from "react";

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
import { log , reindexArray} from '../../components/App/config'
import * as layout from '../../components/Layout'



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
    const [token, setToken] = useState('')

    let apiUrl = 'https://reqres.in/api/users?page=' + props.page
    
    const retrieveItems = () => {
        fetch(config.LOGIN_URL, {
            method: 'POST',
            body: JSON.stringify(config.credentials),
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
                // log(result)
                setToken(result.token)
                let queryToken = '&token=' + result.token
                let offset = page  == undefined ? '&per-page=10&page=1' : '&per-page=10&page=' + page

                fetch(config.NEW_USERS_URL + '?fields=login,role' + offset, {
                    method: 'GET',
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
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
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

const PersonImage = (props) => {
    let photoID = props.photos[props.id]
    // log(props);
    // log(photoID);
    return (
        <div className='soma-person-image'> 
            <img src={config.PHOTOS_URL + '/' + photoID + '?token=' +props.token} />
        </div>
    )
    
}

const PersonData = (props) => {
    return (
        <div className='soma-person-data'> 
            <div className='soma-person-data-text'> Логин: {props.data.login} </div>
            <div className='soma-person-data-dc'> Роль: {props.data.role} </div>
            <div className='soma-person-data-id'> #{props.data.id} </div>

        </div>
    )
}

export default Users