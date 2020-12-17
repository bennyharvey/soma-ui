import React, { useState, useEffect } from "react";
import Pagination from '@material-ui/lab/Pagination';

import Chip from '@material-ui/core/Chip';
import FaceIcon from '@material-ui/icons/Face';
import DoneIcon from '@material-ui/icons/Done';
import * as config from '../../components/App/config'

import * as layout from '../../components/Layout'
import clsx from "clsx";
import {
    Grid,
    Paper} from "@material-ui/core";

// import Chart from "./Chart";
// import UserCard from "./UserCard";
// import Submissions from "./Submissions";

import { Route, Link as RouterLink } from "react-router-dom";
import PaginationItem from '@material-ui/lab/PaginationItem';

const Persons = (props) => {


    return (
        <div><API page={props.page}/></div>
    );
}

const BASE_URL = 'https://192.168.114.171'
const API_URL = BASE_URL + '/api'

const API = (props) => {
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [items, setItems] = useState([])
    const [pageCount, setPageCount] = useState(1)
    const [page, setPage] = useState(1)
    const [photos, setPhotos] = useState([])
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
                // console.log(result)
                setToken(result.token)
                let queryToken = '&token=' + result.token
                let offset = page  == undefined ? '&limit=10&offset=0' : '&limit=10&offset=' + page * 10

                fetch(config.PERSONS_URL + '?order_by=time&order_direction=desc' + offset + queryToken, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then(res => res.json())
                .then(
                    (personsResponce) => {
                        console.log(personsResponce)
                        setIsLoaded(true)
                        let itemBuffer = []
                        let promises = []
                        personsResponce.forEach(person => (
                            promises.push(fetchPersonPhotos(person, queryToken).then((result) => {
                                // console.log(result)
                                if (result[0] === undefined) {
                                    return {
                                        id: '',
                                        photo_id: '',
                                    }
                                }
                                else {
                                    itemBuffer[person.id] = result[0].photo_id
                                    return {
                                        id: result[0].id ?? '',
                                        photo_id: result[0].photo_id ?? '',
                                    }
                                }

                            }))
                        ))
                        Promise.all(promises).then((photos) => {
                            console.log(itemBuffer)
                            setPhotos(itemBuffer)
                        })
                        setItems(personsResponce)
                        setPageCount(10)
                    },
                    (error) => {
                        console.log(error)
                        setIsLoaded(true)
                        setError(error)
                    }
                )
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
                console.log(error)
                setIsLoaded(true)
                setError(error)
            }
        )

    }

    const [personPhotos, setPersonPhotos] = useState([])

    const fetchPersonPhotos = async (person, queryToken) => {
        let url = config.PERSONS_URL + '/' + person.id + '/faces?' + queryToken
        let requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }
        const response = await fetch(url, requestOptions);
        const jsonData = await response.json();
        // setPersonPhotos(jsonData)
        // console.log(jsonData)
        return jsonData
    }

    useEffect(() => {
        setPage(props.page)
    }, [])

    useEffect(retrieveItems, [page])
    
    const classes = layout.makeCommonClasses()
    const dynamicPaper = clsx(classes.paper, classes.blurredBackground, classes.animatedBox, classes.zoomIn, classes.paperHover)


    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <div>Loading...</div>
    } else {
        return (
        <div>
            <Route>
                {({ location }) => {
                    const query = new URLSearchParams(location.search);
                    const page = parseInt(query.get('page') || '1', 10);
                    setPage(page)
                    console.log('pagination update');
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
                <div key={item.id}>
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
}




const PersonBlock = (props) => {
    let classes = layout.makeCommonClasses();
    return (
        <div className='soma-person-block'  key={props.id}>
            <PersonImage id={props.data.id} src={props.imageSrc} token={props.token} photos={props.photos}/>
            <PersonData data={props.data} />
        </div>
    )
}

const PersonImage = (props) => {
    let photoID = props.photos[props.id]
    console.log(props);
    console.log(photoID);
    return (
        <div className='soma-person-image'> 
            <img src={config.PHOTOS_URL + '/' + photoID + '?token=' +props.token} />
        </div>
    )
}

const PersonData = (props) => {
    return (
        <div className='soma-person-data'> 
            {props.data.id} {props.data.name} {props.data.position}
        </div>
    )
}

export default Persons