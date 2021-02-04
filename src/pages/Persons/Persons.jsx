import React, { useState, useEffect, useContext } from "react";
import { Switch, Route, Link as RouterLink, useParams, useRouteMatch, useHistory } from "react-router-dom";

import clsx from "clsx";
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import {
    Grid,
    Paper,
    Button,
    ButtonGroup
} from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';


import {AuthContext} from '../../components/App/auth'
import * as PersonsAPI from '../../components/api/PersonsAPI.js'

import * as config from '../../components/App/config'
import { log, reindexArray } from '../../components/App/utils'
import * as layout from '../../components/Layout'
// import { logger } from '../../components/Utils/Logger'
import { unboundLogger } from '../../components/Utils/Logger'

import EditDossierDialog from './EditDialog'


const ulog = unboundLogger





const Persons = (props) => {
    let { path, url } = useRouteMatch();
    // logger.info('fancy')
    // logger.bind('fuck')
    return (
        <Switch>
            <Route exact path={path}>
                <div><API page={props.page} personPage={false}/></div>
            </Route>
            <Route path={`${path}/:idQueryParam`}>
                <div><API page={props.page} personPage={true}/></div>
            </Route>
        </Switch>
    );
}

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

        PersonsAPI.get({page: page, perPage: 10})
        .then(res => {
            setPageCount(parseInt(res.headers.get('X-Pagination-Page-Count')))
            return res.json()
        })
        .then(personsResponce => {
                log(personsResponce)
                setIsLoaded(true)
                let itemBuffer = []
                let personFacesBuffer = []
                let promises = []
                personsResponce.forEach(person => (
                    promises.push(PersonsAPI.getPhotoIDs(person.id, token).then((result) => {
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
                    log('faces')
                    log(personFacesBuffer)
                    setPhotos(itemBuffer)
                })
                setItems(personsResponce)
                setItemsArray(reindexArray(personsResponce, 'id'))
            },
            (error) => {
                log(error)
                setIsLoaded(true)
                setError(error)
            }
        )
    }

    useEffect(() => {
        setPage(props.page)
    }, [])

    useEffect(retrieveItems, [page])
    
    const classes = layout.makeCommonClasses()
    const dynamicPaper = clsx(classes.paper, classes.blurredBackground, classes.animatedBox, classes.zoomIn, classes.paperHover)

    let { idQueryParam } = useParams();
    
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
            <NewDossierDialog token={token} updateCallback={retrieveItems}/>
            <br />
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
    else {
        return (<PersonDescription data={itemsArray[idQueryParam]} personFaces={personFaces} token={token} updateCallback={retrieveItems}/>)
    }
}


const TAlert = (props) => {
    // if (props.visible) {
        return (
            <Collapse in={props.visible} className="p13-alert">
                <Alert 
                variant="outlined" 
                severity="success"
                // onClose={() => {setVisibility(false)}}
                >
                    {props.text}
                    {/* Изменения сохранены успешно */}
                </Alert>
            </Collapse>
        )
    // }
    // return null
}

const PersonDescription = (props) => {
    const [alertVisible, setAlertVisibility] = useState(false) 
    const [alertText, setAlertText] = useState('')
    let history = useHistory();
    const classes = layout.makeCommonClasses()
    const [image, setImage] = useState(null)
    const { token } = useContext(AuthContext);
    const handlePhotoDelete = (id) => {
        PersonsAPI.deletePhoto(id, token).then(res => {
            if (res.status == 200) {
                props.updateCallback()
                setAlertText("Фото удалено")
                setAlertVisibility(true)
                setTimeout(() => {setAlertVisibility(false)}, 5000);
                // history.push("/persons")
            }
        })
    }
    
    log('desc')
    log(props)
    const onImageChange = e => {
        if (e.target.files && e.target.files[0]) {
            let img = e.target.files[0];
            setImage(URL.createObjectURL(img))
            PersonsAPI.addPersonPhoto(props.data.id, e.target.files[0], token).then(res => {
                if (res.status == 200) {
                    props.updateCallback()
                    setAlertText("Фото добавлено")
                    setAlertVisibility(true)
                    setTimeout(() => {setAlertVisibility(false)}, 5000);
                }
            })
            
        }
    }

    const hiddenFileInput = React.useRef(null);

    const handlePhotoUploadButton = event => {
        hiddenFileInput.current.click();
    };
    const handlePersonEdit = () => {
        setAlertText("Изменения сохранены")
        setAlertVisibility(true)
        setTimeout(() => {setAlertVisibility(false)}, 5000);
        props.updateCallback()
    }

    let faces = props.personFaces[props.data?.id] !== undefined ? props.personFaces[props.data?.id] : [];
    
    return (
        <div className='soma-person-desc'>
            <h1>Досье №{props.data?.id}</h1>
            <ButtonGroup color="primary" aria-label="outlined primary button group">

                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => { 
                        props.updateCallback()
                        history.goBack()
                    }}
                >
                    {'< Назад'}
                </Button>
                <TAlert visible={alertVisible} text={alertText} />
                <Button 
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handlePhotoUploadButton}>
                    Добавить фото
                </Button>
            </ButtonGroup>
            <input 
                type="file" 
                name="personPhoto" 
                onChange={onImageChange}
                ref={hiddenFileInput}
                style={{display:'none'}} 
            />
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <div className='soma-person-desc-image_block'> 
                        <div className='soma-person-data-dc'> Фотографии: </div> <br />
                        {faces.map(perconFace => (
                            <div className='soma-person-desc-image' key={perconFace.id}> 
                                <img src={config.PHOTOS_URL + '/' + perconFace.photo_id + '?token=' +props.token} />
                                <IconButton aria-label="delete" className={classes.personPhotoDeleteButton}
                                    onClick={() => {handlePhotoDelete(perconFace.id)}}
                                >
                                    <DeleteIcon fontSize="large" />
                                </IconButton>
                               
                            </div>
                        ))}
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <EditDossierDialog data={props.data} token={token} updateCallback={handlePersonEdit}/> <br />
                    <div className='soma-person-data-desc-text'>ФИО: {props.data?.name} </div>
                    <div className='soma-person-data-dc'>Тип досье: {props.data?.position} </div>
                    <br />
                    <div className='soma-person-data-dc'>Комментарий: {props.data?.description} </div>
                </Grid>
            </Grid>
           
            
        </div>
    );
}

const PersonBlock = (props) => {
    let classes = layout.makeCommonClasses();
    return (
        <RouterLink className='soma-person-block'  key={props.id} to={'/persons/' + props.data.id}>
            <PersonImage id={props.data.id} src={props.imageSrc} token={props.token} photos={props.photos}/>
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
            <div className='soma-person-data-text'> {props.data.name} </div>
            <div className='soma-person-data-dc'> Тип досье: {props.data.position} </div>
            <div className='soma-person-data-id'> #{props.data.id} </div>

        </div>
    )
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const NewDossierDialog = (props) => {
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState('');
    const [dossier, setDossier] = React.useState('');

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    const handleSave = () => {
        PersonsAPI.addPersonNew({
            name: name,
            position: dossier,
            unit: '-'
        }, props.token).then(res => {
            props.updateCallback()
        })
        setOpen(false);
    }

    const handlePhotoUploadButton = () => {
        // hiddenFileInput.current.click();
    }

    return (
      <div>
        <ButtonGroup color="primary" aria-label="outlined primary button group">
            <Button 
                onClick={handleClickOpen}
                variant="contained"
                color="primary"
                size="large"
                disabled={false}>
            Добавить досье
            </Button>
            <Button 
                // onClick={handleClickOpen}
                variant="contained"
                color="primary"
                size="large"
                disabled={false}>
            Импортировать из директории
            </Button>
        </ButtonGroup>
        <Dialog 
            open={open} 
            onClose={handleClose} 
            aria-labelledby="form-dialog-title"
            TransitionComponent={Transition}
            keepMounted
            fullWidth={true}
            maxWidth={'sm'}>
          <DialogTitle id="form-dialog-title">Новое досье</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              id="name"
              label="ФИО"
              fullWidth
              onChange={e => setName(e.target.value)}
            />
             <TextField
              autoFocus
              id="dossier"
              label="Тип досье"
              fullWidth
              onChange={e => setDossier(e.target.value)}
            />
            <br />
            <br />
            {/* <Button 
                variant="contained"
                color="primary"
                size="large"
                onClick={handlePhotoUploadButton}>
                Добавить фото
            </Button> */}
            {/* <input 
                type="file" 
                name="personPhoto" 
                onChange={onImageChange}
                ref={hiddenFileInput}
                style={{display:'none'}} 
            /> */}
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


export default Persons