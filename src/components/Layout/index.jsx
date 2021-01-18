import React, { useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import './animations.css'
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import {
    lightGreen,
    green,
    orange,
    lightBlue,
    deepPurple,
    deepOrange
  } from "@material-ui/core/colors";

export const drawerWidth = 240;

export const makeCommonClasses = makeStyles(theme => ({
    root: {
        display: "flex"
    },
    loginForm: {
        '& > *': {
        //   margin: theme.spacing(1),
        //   width: '25ch',
        },
    },
    overflowHidden:{
        overflow:'hidden !important'
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    blurredBackground: {
        background: 'url(https://www.akveo.com/blur-admin/assets/img/blur-bg-blurred.jpg) fixed',
        // filter: 'drop-shadow(6px 2px 6px #020202)',
    },
    paperHover: {
        '&:hover': { 
            filter: 'drop-shadow(6px 2px 6px #020202)',
            filter: 'brightness(120%)',
            // transition: '0.6s',
            // opacity: '0.6',
            cursor: 'pointer',
        },
    },
    avatar:{
        marginRight: '15px'
    },
    animatedBox: {
        animationDuration: '.5s',
        animationFillMode: 'both'
    },
    zoomIn: {
        animationName: 'zoomIn'
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
    themeRed: {
        backgroundColor: 'red'
    },
    loginCard: {
        minWidth: 275,
        width: "300px",
        margin: "auto",
        marginTop: "10%",
        // backgroundColor: "#00000030",
    },
    personPhotoDeleteButton : {
        marginLeft: "-78px",
        marginTop: "-59px"
    },
    formControl: {
        // margin: theme.spacing(1),
        minWidth: 120,
      },
}))

let darkState = true
const palletType = darkState ? "dark" : "light";
const mainPrimaryColor = darkState ? lightBlue[500] : lightBlue[500];
const mainSecondaryColor = darkState ? lightBlue[500] : lightBlue[500];

export const darkTheme = createMuiTheme({
    palette: {
    type: palletType,
    primary: {
        main: mainPrimaryColor
    },
    secondary: {
        main: mainSecondaryColor
    },
    themeRed: {
        main: 'red'
    }
    },
    typography: {
    fontFamily: [
        'Oswald',
        'Roboto Condensed',
        'Arimo',
        'Fira Sans',
        'Yanone Kaffeesatz',
        // 'Nunito',
        // 'Roboto',
        // '"Helvetica Neue"',
        'Arial',
        'sans-serif'
    ].join(','),
    }
})