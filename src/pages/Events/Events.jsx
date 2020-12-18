import React, { useState, useEffect }  from "react"
import * as layout from '../../components/Layout'
import clsx from "clsx"
import {
    Typography,
    Grid,
    Paper  } from "@material-ui/core"

import { Route, Link as RouterLink } from "react-router-dom"
import Pagination from '@material-ui/lab/Pagination'
import PaginationItem from '@material-ui/lab/PaginationItem'

import * as config from '../../components/App/config'

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import SaveIcon from '@material-ui/icons/Save';
import PlayArrow from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';

// const Events = () => {
//     const classes = layout.makeCommonClasses()
//     const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight, classes.blurredBackground, classes.animatedBox, classes.zoomIn)
//     const dynamicPaper = clsx(classes.paper, classes.blurredBackground, classes.animatedBox, classes.zoomIn)
//     // let client = new WebSocket('ws://localhost:19001')
//     return (
//         <div>
//             <Grid container spacing={3}>
//                 <Grid item xs={12} md={8} lg={9}>
//                     <Paper elevation={5} className={fixedHeightPaper}>
//                         <Chart />
//                     </Paper>
//                 </Grid>
//                 <Grid item xs={12} md={4} lg={3}>
//                     <Paper elevation={5} className={fixedHeightPaper}>
//                         <UserCard />
//                     </Paper>
//                 </Grid>
//                 <Grid item xs={12}>
//                     <Paper elevation={5} className={dynamicPaper}>
//                         <Submissions />
//                     </Paper>
//                 </Grid>
//                 <Grid item xs={12}>
//                     <Paper elevation={5} className={dynamicPaper}>
//                         <Submissions />
//                     </Paper>
//                 </Grid>
//             </Grid>
//             <Box pt={4}>
//                 <Copyright />
//             </Box>
//         </div>
//     )
// }






const Events = (props) => {


    return (
        <div><API page={props.page}/></div>
    )
}

// const BASE_URL = 'http://192.168.114.171'
// const API_URL = BASE_URL + '/api'
// const LOGIN_URL = API_URL + '/login'
// const EVENTS_URL = API_URL + '/events'
// const PHOTOS_URL = API_URL + '/photos'
const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
}));


const API = (props) => {
    const [token, setToken] = useState('')
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [items, setItems] = useState([])
    const [pageCount, setPageCount] = useState(1)
    const [page, setPage] = useState(1)

    const classes = layout.makeCommonClasses()

    const [photos, setPhotos] = useState([])

    // let apiUrl = API_URL
    

    let credentials = {
        'login': 'admin', 
        'password': 'Cuzee2motof6aiJe'
    }

        
    // Getting person photos
    // =================================
    const retrievePersonPhotos = () => {
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
                console.log('photo fetch')
                console.log(result)
                let queryToken = '&token=' + result.token
                // let offset = page  == undefined ? '&limit=10&offset=0' : '&limit=10&offset=' + page * 10
                let offset = '&limit=10&offset=0'

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
                        // setIsLoaded(true)
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
                        // setItems(personsResponce)
                        // setPageCount(10)
                    },
                    (error) => {
                        console.log(error)
                        // setIsLoaded(true)
                        // setError(error)
                    }
                )
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
                console.log(error)
            }
        )

    }
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
                setToken(result.token)
                let queryToken = '&token=' + result.token
                
                // let offset = page  == undefined ? '&limit=10&offset=0' : '&limit=10&offset=' + page * 10
                // let offset = '&limit=10&offset=0'
                fetchEvents(queryToken)  
               
                setIsLoaded(true)
                setPageCount(10)

                // fetch(config.EVENTS_URL + '?order_by=time&order_direction=desc' + offset + queryToken, {
                //     method: 'GET',
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                // })
                // .then(res => res.json())
                // .then(
                //     (eventsResponce) => {
                //         setIsLoaded(true)
                //         setItems(eventsResponce)
                //         setPageCount(10)
                //     },
                //     (error) => {
                //         console.log(error)
                //     }
                // )
            },
            (error) => {
                console.log(error)
            }
        )

    }

    

    // const [events, setEvents] = useState([])

    const fetchEvents = async (queryToken) => {
        let offset = page  == undefined ? '&limit=10&offset=0' : '&limit=10&offset=' + page * 10
        // let offset = '&limit=10&offset=0'

        // let page = 1
        // let offset = page  == undefined ? '&limit=10&offset=0' : '&limit=10&offset=' + page * 10
        let url = config.EVENTS_URL + '?order_by=time&order_direction=desc' + offset + queryToken

        let requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }
        const response = await fetch(url, requestOptions);
        const jsonData = await response.json();
        setItems(jsonData)
        console.log('new fetch');
        console.log(jsonData);
        console.log(offset);
        console.log(queryToken);
        // setPersonPhotos(jsonData)
        // console.log(jsonData)
        // return jsonData
    }
    

    useEffect(() => {
        setPage(props.page)
        retrievePersonPhotos()

    }, [])

    // setTimeout(() => {
    //     retrieveItems()
    //     console.log('call init')
    // }, 1000)

    useEffect(retrieveItems, [page])
    

    const [age, setAge] = React.useState('');
    const handleChange = (event) => {
      setAge(event.target.value);
    };
    const BootstrapInput = withStyles((theme) => ({
        // root: {
        //   'label + &': {
        //     marginTop: theme.spacing(3),
        //   },
        // },
        input: {
          borderRadius: 4,
          position: 'relative',
          
        //   backgroundColor: theme.palette.background.paper,
          fontSize: 16,
          width: '200px',
          border: '1px solid rgba(255, 255, 255, 0.23)',
          padding: '10px 26px 10px 12px',
          color: 'white',
          transition: theme.transitions.create(['border-color', 'box-shadow']),
          // Use the system font instead of the default Roboto font.
        //   fontFamily: [
        //     '-apple-system',
        //     'BlinkMacSystemFont',
        //     '"Segoe UI"',
        //     'Roboto',
        //     '"Helvetica Neue"',
        //     'Arial',
        //     'sans-serif',
        //     '"Apple Color Emoji"',
        //     '"Segoe UI Emoji"',
        //     '"Segoe UI Symbol"',
        //   ].join(','),
          '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
          },
        },
      }))(InputBase);

    const [playButtonIcon, setPlayButtonIcon] = React.useState(<PlayArrow />);
    const [playButtonText, setPlayButtonText] = React.useState('Старт');
    const [playButtonColor, setPlayButtonColor] = React.useState('primary');
    const [intervalID, setIntervalID] = React.useState(0);

    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <div>Loading...</div>
    } else {
        return (
        <div>
            <Grid container spacing={3}>
                <Grid item xs={4}>
                    <Route>
                        {({ location }) => {
                            const query = new URLSearchParams(location.search)
                            const page = parseInt(query.get('page') || '1', 10)
                            setPage(page)
                            // console.log('pagination update')
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
                                    to={`/events${item.page === 1 ? '' : `?page=${item.page}`}`}
                                    {...item}
                                    />
                                )} />
                            )
                        }}
                    </Route>
                    
                </Grid>
                <Grid item xs={2}>
                    <Button
                        variant="contained"
                        color={playButtonColor}
                        size="large"
                        onClick={() => { 
                            if (playButtonText == 'Стоп') {
                                setPlayButtonIcon(<PlayArrow />)
                                setPlayButtonColor('primary')
                                setPlayButtonText('Старт')
                                clearInterval(intervalID)
                                
                            } else if (playButtonText == 'Старт') {
                                setPlayButtonIcon(<StopIcon />)
                                setPlayButtonColor('default')
                                setPlayButtonText('Стоп')
                                let id = setInterval(function() {
                                    fetchEvents('&token=' + token)  
                                }, 500);
                                setIntervalID(id)
                            }
                        }}
                        // className='soma-person-data-confirm_button'
                        startIcon={playButtonIcon}
                    >
                        {playButtonText}
                    </Button>
                </Grid>
                <Grid item xs={2}>
                    <FormControl className={classes.margin}>
                        <InputLabel id="customized-select-label">Тип события</InputLabel>
                        <Select
                        labelId="customized-select-label"
                        id="customized-select"
                        value={age}
                        onChange={handleChange}
                        variant='outlined'
                        input={<BootstrapInput />}
                        >

                        <MenuItem value={10}>face_recognize</MenuItem>
                        <MenuItem value={20}>person_recognize</MenuItem>
                        <MenuItem value={30}>passage_open</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={2}>
                    <DateAndTimePickers text="От"/>
                </Grid>
                <Grid item xs={2}>
                    <DateAndTimePickers text="До"/>
                </Grid>
            </Grid>
           
            <br />
            {items.map(item => (
                <PersonBlock key={item.id} data={item} imageSrc={item.avatar} token={token}/>
            ))}
        </div>
        )
    }
}



const PersonBlock = (props) => {
    const classes = layout.makeCommonClasses()
    const dynamicPaper = clsx(classes.paper, classes.blurredBackground, classes.animatedBox, classes.zoomIn, classes.paperHover)

    if (props.data.type == 'face_recognize') {
        // console.log(props)
        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper elevation={5} className={dynamicPaper}>
                        <div className='soma-person-block' key={props.id}>
                            <PersonImage src={props.imageSrc} photoId={props.data.data.photo_id} token={props.token} />
                            <PersonData data={props.data} />
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        )
    }
    else if (props.data.type == 'person_recognize') {
        // console.log(props)
        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper elevation={5} className={dynamicPaper}>
                        <div className='soma-person-block' key={props.id}>
                            <PersonImage src={props.imageSrc} photoId={props.data.data.photo_id} token={props.token} />
                            {/* <RecognizedPersonImage src={props.imageSrc} photoId={props.data.data.photo_id} token={props.token} /> */}
                            <PersonData data={props.data} />
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        )
    }
    else {
        return null
    }
   
}

const PersonImage = (props) => {
    return (
        <div className='soma-person-image'> 
            <img src={config.PHOTOS_URL + '/' + props.photoId + '?token=' +props.token} />
        </div>
    )
}

const PersonData = (props) => {
    let t1 = (props.data.time).split('T')
    let t2 = t1[1].split('.')
    let date = t2[0]
    let time = t1[0]

    let detectConfidence = (props.data.data.detect_confidence).toFixed(2) * 100
    if (detectConfidence > 100) detectConfidence = detectConfidence - (detectConfidence - 100) //lol


    if (props.data.type == 'face_recognize') {
        return (
            <div className='soma-person-data'> 
                <div className='soma-person-data-time'> {date}  {time} </div>
                <div className='soma-person-data-text'> Нет совпадений </div>
                <div className='soma-person-data-dc'>Уверенность распознавания: {detectConfidence}% </div>
                <div className='soma-person-data-id'> #{props.data.id} </div>
            </div>
        )
    } else if (props.data.type == 'person_recognize') {
        let descriptorsDistance = 100 - (props.data.data.descriptors_distance).toFixed(2) * 100
        if (descriptorsDistance > 100) descriptorsDistance = descriptorsDistance - (descriptorsDistance - 100)
        let name = props.data.data.person_name
        let dossier = props.data.data.person_position

        return (
            <div className='soma-person-data'> 
            <div className='soma-person-data-time'> {date}  {time} </div>
            <div className='soma-person-data-text'> {name}</div>
            <div className='soma-person-data-text'> Тип досье: {dossier} </div>
            <div className='soma-person-data-dc'>Уверенность распознавания: {detectConfidence}% </div>
            <div className='soma-person-data-dc'>Точность совпадения: {descriptorsDistance}% </div>
            <div className='soma-person-data-dc'>Статус: <span className='soma-person-data-not_confirmed_text'> не подтверждено </span> </div>
            <Button
                variant="contained"
                color="primary"
                size="large"
                className='soma-person-data-confirm_button'
                startIcon={<SaveIcon />}
            >
                Подтвердить
            </Button>
            <div className='soma-person-data-id'> #{props.data.id} </div>
        </div>
        )
    }
   
}

const RecognizedPersonImage = (props) => {
    let photoID = props.photos[props.id]
    console.log(props);
    console.log(photoID);
    return (
        <div className='soma-person-image'> 
            <img src={config.PHOTOS_URL + '/' + photoID + '?token=' +props.token} />
        </div>
    )
}

function DateAndTimePickers(props) {
    const classes = useStyles();
  
    return (
      <form className={classes.container} noValidate>
        <TextField
          id="datetime-local"
          label={props.text}
          type="datetime-local"
          defaultValue="2017-05-24T10:30"
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </form>
    );
}

export default Events


