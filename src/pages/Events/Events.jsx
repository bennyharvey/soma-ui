import React, { useState, useEffect, useContext, useRef } from "react"
import * as layout from '../../components/Layout'
import { AuthContext } from '../../components/App/auth'

import clsx from "clsx"
import {
    Typography,
    Grid,
    Paper
} from "@material-ui/core"

import { Route, Link as RouterLink } from "react-router-dom"
import Pagination from '@material-ui/lab/Pagination'
import PaginationItem from '@material-ui/lab/PaginationItem'

import * as config from '../../components/App/config'
import { log, getDateForPicker } from '../../components/App/utils'
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

import Autocomplete from '@material-ui/lab/Autocomplete';

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

function useTraceUpdate(props) {
    const prev = useRef(props);
    useEffect(() => {
        const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
            if (prev.current[k] !== v) {
                ps[k] = [prev.current[k], v];
            }
            return ps;
        }, {});
        if (Object.keys(changedProps).length > 0) {
            console.log('Changed props:', changedProps);
        }
        prev.current = props;
    });
}
const Events = (props) => {
    useTraceUpdate(props);
    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [items, setItems] = useState([])
    const [pageCount, setPageCount] = useState(1)
    const [page, setPage] = useState(1)

    const classes = layout.makeCommonClasses()

    const [photos, setPhotos] = useState([])

    const { token } = useContext(AuthContext);

    const [filter, setFilter] = useState('')
    const [filterSelect, setFilterSelect] = useState('')

    const [personFilter, setPersonFilter] = useState('')
    const [personFilterr, setPersonFilterr] = useState(null)
    const [personFilterSelect, setPersonFilterSelect] = useState('')

    const [dateFrom, setDateFrom] = React.useState('');
    const [dateTo, setDateTo] = React.useState('');

    const handleDateChangeFrom = (e) => {
        setDateFrom(e.target.value)
    }

    const handleDateChangeTo = (e) => {
        setDateTo(e.target.value)
    }

    const handleFilterChange = (event) => {
        setFilter(event.target.value)
        setFilterSelect(event.target.value)
    };

    const handlPersonFilterChange = (event) => {
        setPersonFilter(event.target.value)
        setPersonFilterSelect(event.target.value)
    };

    const retrievePersonPhotos = () => {
        log('photo fetch')
        let queryToken = '&token=' + token
        PersonsAPI.get({ page: 1, perPage: 100 })
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
                    Promise.all(promises).then(() => {
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
        EventsAPI.gett({ page: page, perPage: 10, token: token, filterType: filter, filterTypePerson: personFilterr?.value, dateFrom: dateFrom, dateTo: dateTo })
            .then(res => res.json())
            .then(res => {
                setItems(res.items)
                log(res)
                setPageCount(res.page_count)
                log('new fetch with ' + filter)
                setIsLoaded(true)
            })
    }
    
    useEffect(() => {
        setPage(props.page)
        retrievePersonPhotos()
    }, [])

    useEffect(retrieveItems, [page, filter, dateFrom, dateTo, personFilterr])

    const [playButtonIcon, setPlayButtonIcon] = React.useState(<PlayArrow />);
    const [playButtonText, setPlayButtonText] = React.useState('Старт');
    const [playButtonColor, setPlayButtonColor] = React.useState('primary');
    const [intervalID, setIntervalID] = React.useState(0);

    const personList = [
        { name: 'Нурутдинов Айрат Рафкатович', value: 30 },
        { name: 'Богачев Денис Евгеньевич', value: 32 },
        { name: 'Хисамов Рустем Азатович', value: 31 },
        { name: 'Салихов Ильяс', value: 26 },
        { name: 'Суворов Павел', value: 35 },
        { name: 'Все события', value: 0  }
    ];

    // <MenuItem value={'32'}>Богачев Денис Евгеньевич</MenuItem>
    // <MenuItem value={'31'}>Хисамов Рустем Азатович</MenuItem>
    // <MenuItem value={'30'}>Нурутдинов Айрат Рафкатович</MenuItem>
    // <MenuItem value={'26'}>Салихов Ильяс</MenuItem>
    // <MenuItem value={'35'}>Суворов Павел</MenuItem>

    if (error) {
        return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
        return <div>Loading...</div>
    } else {
        return (
            <div>
                <Grid container spacing={3}>
                    <Grid item md={12} lg={3}>
                        <Route>
                            {({ location }) => {
                                const query = new URLSearchParams(location.search)
                                // const filterQ = query.get('filter')
                                // setFilter(filterQ)
                                const page = parseInt(query.get('page') || '1', 10)
                                setPage(page)
                                log('pagination update')
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
                    <Grid item md={12} lg={1}>
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
                                    let id = setInterval(function () {
                                        retrieveItems()
                                    }, 200);
                                    setIntervalID(id)
                                }
                            }}
                            // className='soma-person-data-confirm_button'
                            startIcon={playButtonIcon}
                        >
                            {playButtonText}
                        </Button>
                    </Grid>
                    <Grid item md={12} lg={2}>
                        <FormControl className={classes.formControl}>
                            <InputLabel id="demo-simple-select-label">Тип события</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={filterSelect}
                                onChange={handleFilterChange}
                            >
                                <MenuItem value={'person_recognize'}>Только совпадения</MenuItem>
                                <MenuItem value={''}>Все события</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={12} lg={2}>
                        <Autocomplete
                            id="combo-box-demo"
                            options={personList}
                            getOptionLabel={(option) => option.name}
                            // style={{ width: 300 }}
                            value={personFilterr}
                            onChange={(event, newValue) => {
                                log(newValue)
                                setPersonFilterr(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} label="Досье"  />}
                        />
                    </Grid>
                    {/* <Grid item md={12} lg={2}>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">Тип досье</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        // value={personFilterSelect}
                        // onChange={handlPersonFilterChange}
                        >
                            <MenuItem value={'ТТК'}>ТТК</MenuItem>
                            <MenuItem value={''}>Все события</MenuItem>
                        </Select>
                    </FormControl>
                </Grid> */}
                    <Grid item md={12} lg={2}>
                        <form noValidate>
                            <TextField
                                id="date-from"
                                label="От"
                                type="datetime-local"
                                defaultValue={getDateForPicker()}
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={handleDateChangeFrom}
                            />
                        </form>
                    </Grid>
                    <Grid item md={12} lg={2}>
                        <form noValidate>
                            <TextField
                                id="date-to"
                                label="До"
                                type="datetime-local"
                                defaultValue={getDateForPicker()}
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={handleDateChangeTo}
                            />
                        </form>
                    </Grid>
                </Grid>

                <br />
                {items.map(item => (
                    <PersonBlock key={item.id} data={item} imageSrc={item.avatar} token={token} photos={photos} />
                ))}
            </div>
        )
    }
}



const PersonBlock = (props) => {
    const classes = layout.makeCommonClasses()
    const dynamicPaper = clsx(classes.paper, classes.blurredBackground, classes.animatedBox, classes.zoomIn, classes.paperHover)

    if (props.data.type == 'face_recognize') {
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
            <img src={config.PHOTOS_URL + '/' + props.photoId + '?token=' + props.token} />
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

    if (props.data.type == 'face_recognize') {
        return (
            <div className='soma-person-data'>
                <div className='soma-person-data-time'> {date}  {time} </div>
                <div className='soma-person-data-text'> Нет совпадений </div>
                <div className='soma-person-data-dc'>Уверенность распознавания: {detectConfidence.toFixed(2)}% </div>
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



export default Events


// апи для заливки/редактирования камер через интерфейс. Готовы фильтр по досье, типы досье, комментарии, роли