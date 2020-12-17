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

    // let apiUrl = API_URL
    

    let credentials = {
        'login': 'admin', 
        'password': 'Cuzee2motof6aiJe'
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
                let offset = '&limit=10&offset=0'
                fetchEvents(offset, queryToken)  
                setInterval(function(){ 
                    fetchEvents(offset, queryToken)  
                }, 500);
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
                setIsLoaded(true)
                setError(error)
            }
        )

    }

    // const [events, setEvents] = useState([])

    const fetchEvents = async (offset, queryToken) => {

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
    }, [])

    // setTimeout(() => {
    //     retrieveItems()
    //     console.log('call init')
    // }, 1000)

    useEffect(retrieveItems, [page])
    
    const classes = layout.makeCommonClasses()
    const dynamicPaper = clsx(classes.paper, classes.blurredBackground, classes.animatedBox, classes.zoomIn, classes.paperHover)

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

    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <div>Loading...</div>
    } else {
        return (
        <div>
            <Grid container spacing={3}>
                <Grid item xs={6}>
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
                <div key={item.id}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Paper elevation={5} className={dynamicPaper}>
                                <PersonBlock data={item} imageSrc={item.avatar} token={token}/>
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            ))}
        </div>
        )
    }
}



const PersonBlock = (props) => {


    // console.log(props)
    return (
        <div className='soma-person-block' key={props.id}>
            <PersonImage src={props.imageSrc} photoId={props.data.data.photo_id} token={props.token}/>
            <PersonData data={props.data} />
        </div>
    )
}

const PersonImage = (props) => {
    return (
        <div className='soma-person-image'> 
            <img src={config.PHOTOS_URL + '/' + props.photoId + '?token=' +props.token} />
        </div>
    )
}

const PersonData = (props) => {
    return (
        <div className='soma-person-data'> 
            {props.data.id} {props.data.time} {props.data.type} {props.data.data.detect_confidence}
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


