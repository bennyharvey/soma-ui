import React, { useState, useEffect, useContext }  from "react"
import * as layout from '../../components/Layout'
import {AuthContext} from '../../components/App/auth'

import clsx from "clsx"
import {
    Typography,
    Grid,
    Paper  } from "@material-ui/core"

import { Route, Link as RouterLink } from "react-router-dom"
import Pagination from '@material-ui/lab/Pagination'
import PaginationItem from '@material-ui/lab/PaginationItem'

import * as config from '../../components/App/config'
import {log, getDateForPicker} from '../../components/App/utils'
import * as EventsAPI from '../../components/api/EventsAPI.js'
import * as PersonsAPI from '../../components/api/PersonsAPI.js'


import BeenhereIcon from '@material-ui/icons/Beenhere';
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





const Events = (props) => {
    return (
        <div><API page={props.page}/></div>
    )
}

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
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [items, setItems] = useState([])
    const [pageCount, setPageCount] = useState(1)
    const [page, setPage] = useState(1)
    const [filter, setFilter] = useState('')

    const classes = layout.makeCommonClasses()

    const [photos, setPhotos] = useState([])

    const { token } = useContext(AuthContext);

    // const [age, setAge] = React.useState('');

    const retrievePersonPhotos = () => {
        log('photo fetch')
        let queryToken = '&token=' + token
        PersonsAPI.get({page: 1, perPage: 100})
        .then(res => res.json())
        .then(
            (personsResponce) => {
                log(personsResponce)
                let itemBuffer = []
                let promises = []
                personsResponce.forEach(person => (
                    promises.push(fetchPersonPhotos(person, queryToken).then((result) => {
                        if (result[0] !== undefined) itemBuffer[person.id] = result[0].photo_id
                    }))
                ))
                Promise.all(promises).then((photos) => {
                    setPhotos(itemBuffer)
                })
            },
            (error) => {
                log(error)
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
        // log(jsonData)
        return jsonData
    }

 

    

    const retrieveItems = () => {
        EventsAPI.gett({page: page, perPage: 10, token: token})
        .then(res => res.json())
        .then(res => {
            setItems(res)
            log('new fetch')
            setIsLoaded(true)
        })
    }

    useEffect(() => {
        setPageCount(10)
        setPage(props.page)
        retrievePersonPhotos()
    }, [])

    useEffect(retrieveItems, [page])
    

    const [age, setAge] = React.useState('');
    const handleChange = (event) => {
        log(event.target.value)
        setFilter(event.target.value);
    };
    const BootstrapInput = withStyles((theme) => ({
        input: {
          borderRadius: 4,
          position: 'relative',
          fontSize: 16,
          width: '200px',
          border: '1px solid rgba(255, 255, 255, 0.23)',
          padding: '10px 26px 10px 12px',
          color: 'white',
          transition: theme.transitions.create(['border-color', 'box-shadow']),
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
                <Grid item xs={12} sm={4}>
                    <Route>
                        {({ location }) => {
                            const query = new URLSearchParams(location.search)
                            const filterQ = query.get('filter')
                            setFilter(filterQ)
                            const page = parseInt(query.get('page') || '1', 10)
                            setPage(page)
                            // log('pagination update')
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
                <Grid item xs={12} sm={2}>
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
                                    retrieveItems()  
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
                <Grid item xs={12} sm={2}>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">Тип события</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={age}
                        // onChange={handleChange}
                        >
                            <MenuItem value={'person_recognize'}>Совпадения из списка досье</MenuItem>
                            <MenuItem value={'face_recognize'}>Распознования лиц</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={2}>
                    <DateAndTimePickers text="От"/>
                </Grid>
                <Grid item xs={12} sm={2}>
                    <DateAndTimePickers text="До"/>
                </Grid>
            </Grid>
           
            <br />
            {items.map(item => (
                <PersonBlock key={item.id} data={item} imageSrc={item.avatar} token={token} photos={photos}/>
            ))}
        </div>
        )
    }
}



const PersonBlock = (props) => {
    const classes = layout.makeCommonClasses()
    const dynamicPaper = clsx(classes.paper, classes.blurredBackground, classes.animatedBox, classes.zoomIn, classes.paperHover)

    if (props.data.type == 'face_recognize') {
        // log(props)
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
        log(props)
        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper elevation={5} className={dynamicPaper}>
                        <div className='soma-person-block' key={props.id}>
                            <PersonImage src={props.imageSrc} photoId={props.data.data.photo_id} token={props.token} />
                            <PersonImage src={props.imageSrc} photoId={props.photos[props.data.data.person_id]} token={props.token} />
                            
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
    let t1 = (props.data.time).split(' ')
    let t2 = t1[1].split('.')
    let date = t2[0]
    let time = t1[0]

    let detectConfidence = (props.data.data.detect_confidence).toFixed(2) * 100
    if (detectConfidence > 100) detectConfidence = detectConfidence - (detectConfidence - 100) //lol

    const [confirmed, setConfirmed] = useState(false)
    const [cbColor, setcbColor] = useState("primary")
    const [cbIcon, setcbIcon] = useState(<SaveIcon />)
    const [cbText, setcbText] = useState("Подтвердить")


    // const [playButtonIcon, setPlayButtonIcon] = React.useState(<PlayArrow />);
    // const [playButtonText, setPlayButtonText] = React.useState('Старт');
    // const [playButtonColor, setPlayButtonColor] = React.useState('primary');
    // const [intervalID, setIntervalID] = React.useState(0);

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
            <div className='soma-person-data-dc'>Точность совпадения: {descriptorsDistance}% </div>
            <div className='soma-person-data-dc'>Уверенность распознавания: {detectConfidence}% </div>
            {/* <div className='soma-person-data-dc'>Статус: <span className='soma-person-data-not_confirmed_text'> не подтверждено </span> </div> */}
            <Button
                variant="contained"
                color={cbColor}
                size="large"
                className='soma-person-data-confirm_button'
                startIcon={cbIcon}
                onClick={() => { 
                    if (!confirmed) {
                        setcbIcon(<BeenhereIcon />)
                        setcbColor('default')
                        setcbText('Подтверждено')
                    } 
                }}
            >
                {cbText}
            </Button>
            <div className='soma-person-data-id'> #{props.data.id} </div>
        </div>
        )
    }
   
}

const RecognizedPersonImage = (props) => {
    let photoID = props.photos[props.id]
    log(props);
    log(photoID);
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
          defaultValue={getDateForPicker()}
          className={classes.textField}
          InputLabelProps={{
                shrink: true,
          }}
        />
      </form>
    );
}


export default Events


