import React, { useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import {
  CssBaseline,
  Switch,
  Drawer,
  Box,
  AppBar,
  Toolbar,
  List,
  Avatar,
  Typography,
  Divider,
  IconButton,
  Badge,
  Container,
  Grid,
  Paper,
  Link
} from "@material-ui/core";
import { typography } from '@material-ui/system';
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { mainListItems } from "./listItems";


// For Switch Theming
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import { BrowserRouter, Switch as RouterSwitch, Route, Link as RouterLink, useLocation } from "react-router-dom";

import avatarImg from "../../static/images/1.jpg";

import Events from '../../pages/Events'
import Persons from '../../pages/Persons'
import Main from '../../pages/Main'
import Users from '../../pages/Users'

import {
    ListItemIcon,
    ListItem,
    ListItemText,
    ListSubheader
  } from "@material-ui/core";

import DashboardIcon from "@material-ui/icons/Dashboard";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import PeopleIcon from "@material-ui/icons/People";
import BarChartIcon from "@material-ui/icons/BarChart";
import LayersIcon from "@material-ui/icons/Layers";
import AssignmentIcon from "@material-ui/icons/Assignment";
import StarIcon from "@material-ui/icons/Star";
import PublishIcon from "@material-ui/icons/Publish";
import BookIcon from "@material-ui/icons/Book";
import ListIcon from "@material-ui/icons/List";
import SettingsIcon from "@material-ui/icons/Settings";

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';

import * as layout from '../Layout'
import CamDashboard from "../../pages/CamDashboard";

const drawerWidth = 240;


const useStyles = makeStyles(theme => ({
    root: {
        display: "flex"
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    blurredBackground: {
        background: 'url(https://www.akveo.com/blur-admin/assets/img/blur-bg-blurred.jpg) fixed'
    },
    avatar:{
        marginRight: '15px'
    },
    toolbarIcon: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 8px",
        ...theme.mixins.toolbar
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
        })
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
        })
    },
    menuButton: {
        marginRight: 36
    },
    menuButtonHidden: {
        display: "none"
    },
    title: {
        flexGrow: 1
    },
    appBarIcon: {
        marginRight: '10px',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: 'rgb(0 0 0 / 32%);',
        color: 'white',
    },
    drawerPaper: {
        backgroundColor: 'rgba(0,0,0,.5)',
        position: "relative",
        whiteSpace: "nowrap",
        width: drawerWidth,
        transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
        })
    },
    drawerContainer: {
        overflow: 'auto',
    },
    drawerPaperClose: {
        overflowX: "hidden",
        transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9)
        }
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: "100vh",
        overflow: "auto"
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4)
    },
    paper: {
        padding: theme.spacing(2),
        display: "flex",
        overflow: "auto",
        flexDirection: "column"
    },
    fixedHeight: {
        height: 240
    },
    nested: {
        paddingLeft: theme.spacing(4),
      },
    nestedWrapper:{
        backgroundColor: 'rgb(0 0 0 / 30%);'
    }
}));



const draweFixedScrollable = makeStyles(theme => ({
    root: {
        display: 'flex',
      },
      appBar: {
        zIndex: theme.zIndex.drawer + 1,
      },
      drawer: {
        width: drawerWidth,
        flexShrink: 0,
      },
      drawerPaper: {
        width: drawerWidth,
      },
      drawerContainer: {
        overflow: 'auto',
      },
      content: {
        flexGrow: 1,
        padding: theme.spacing(3),
      },
}));




export default function Dashboard(props) {
    const [open, setOpen] = useState(true);
    const [darkState, setDarkState] = useState(true);


    const classes = useStyles();
    const handleThemeChange = () => {
        setDarkState(!darkState);
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    const [openCollapse, setOpenCollapse] = React.useState(false);    

    function handleOpenSettings(){
        setOpenCollapse(!openCollapse);
    }

    let location = useLocation()
    let query = new URLSearchParams(location.search)
    let pageParam = parseInt(query.get('page') || '1', 10)

    return (
        <ThemeProvider theme={layout.darkTheme}>

        <div className={classes.root}>
            <CssBaseline />
            <AppBar
            position="absolute"
            className={clsx(classes.appBar, open && classes.appBarShift)}
            >
                <Toolbar className={classes.toolbar} fontFamily="Nerko One">
                    <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    onClick={open ? handleDrawerClose : handleDrawerOpen}
                    className={clsx(
                        classes.menuButton,
                        // open && classes.menuButtonHidden
                    )}
                    >
                    <MenuIcon />
                    </IconButton>
                    <Typography
                    component="h1"
                    variant="h6"
                    color="inherit"
                    noWrap
                    className={classes.title}
                    >
                    TTK SOMA UI
                    </Typography>
                    {/* <Switch checked={darkState} onChange={handleThemeChange} /> */}
                    {/* <IconButton color="inherit" className={classes.appBarIcon}>
                    <Badge badgeContent={4} color="secondary">
                        <NotificationsIcon />
                    </Badge>
                    </IconButton> */}
                    <Avatar
                    className={classes.avatar}
                    src={avatarImg}
                    />
                </Toolbar>  
            </AppBar>

            <Drawer
            variant="permanent"
            classes={{
                paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose)
            }}
            open={open}
            >
                <div className={classes.toolbarIcon}>
                    <IconButton >
                    {/* <ChevronLeftIcon /> */}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <ListItem 
                    component={RouterLink}
                    to='/users'
                    button
                    >
                        <ListItemIcon>
                            <ListIcon />
                        </ListItemIcon>
                        <ListItemText primary="Пользователи" />
                    </ListItem>

                    <ListItem 
                    component={RouterLink}
                    to='/events'
                    button
                    >
                        <ListItemIcon>
                            <ListIcon />
                        </ListItemIcon>
                        <ListItemText primary="События" />
                    </ListItem>

                    <ListItem 
                    component={RouterLink}
                    to='/persons'
                    button
                    >
                        <ListItemIcon>
                            <PeopleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Досье" />
                    </ListItem>

                    <ListItem 
                    component={RouterLink}
                    to='/cam-dashboard'
                    button
                    >
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Видеостена" />
                    </ListItem>

                    {/* 
                    <ListItem button onClick={handleOpenSettings} disableRipple={false}>
                        <ListItemIcon>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Settings" />
                        {openCollapse ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>

                    <Collapse 
                    timeout={150} in={openCollapse} unmountOnExit className={classes.nestedWrapper}>
                        <List component="div" disablePadding>
                            <ListItem 
                            component={RouterLink}
                            to='/persons?page=1'
                            button 
                            className={classes.nested}>
                                <ListItemIcon>
                                    <SettingsIcon />
                                </ListItemIcon>
                                <ListItemText inset primary="page 1" />
                            </ListItem>
                            <ListItem 
                            component={RouterLink}
                            to='/persons?page=2'
                            button 
                            className={classes.nested}>
                                <ListItemIcon>
                                    <SettingsIcon />
                                </ListItemIcon>
                                <ListItemText inset primary="page 2" />
                            </ListItem>
                        </List>
                    </Collapse> */}
                </List>
                <Divider />
            </Drawer>

            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth={false} className={classes.container}>
                    <RouterSwitch>
                        <Route exact path="/">
                            asd
                        </Route>
                        <Route path="/main">
                            {/* asd */}
                            <Main />
                        </Route>
                        <Route path="/events">
                            <Events />
                        </Route>
                        <Route path="/users">
                            <Users />
                        </Route>
                        <Route path="/cam-dashboard">
                            <CamDashboard />
                        </Route>
                        <Route path="/persons">
                            <Persons page={pageParam}/>
                        </Route>
                    </RouterSwitch>
                </Container>
            </main>
        </div>
        </ThemeProvider>
    )
}

