import React from "react";
import * as layout from '../../components/Layout'
import clsx from "clsx";
import ReactPlayer from 'react-player'
import {
    GridContextProvider,
    GridDropZone,
    GridItem,
    swap
  } from "react-grid-dnd";
import {
    Box,
    Grid,
    Paper  } from "@material-ui/core";

const CamDashboard = () => {
    const classes = layout.makeCommonClasses();
    const dynamicPaper = clsx(classes.paper, classes.blurredBackground, classes.animatedBox, classes.zoomIn, classes.overflowHidden);

    const [items, setItems] = React.useState([
            <div className="cam-dashboard-box" key={12}>
                <Paper elevation={5} className={dynamicPaper}>
                    <ReactPlayer 
                        url='http://domofon-stream.tattelecom.ru/EC0pqZxsfDF5DfHdSXfm2z0PthuAVU/hls/admin/intercom_11/s.m3u8'
                        playing={true}
                    />
                </Paper>
            </div>,
            <div className="cam-dashboard-box" key={12}>
                <Paper elevation={5} className={dynamicPaper}>
                    <ReactPlayer 
                        url='http://domofon-stream.tattelecom.ru/EC0pqZxsfDF5DfHdSXfm2z0PthuAVU/hls/admin/intercom_23/s.m3u8'
                        playing={true}
                    />
                </Paper>
            </div>,
            <div className="cam-dashboard-box" key={14}>
                <Paper elevation={5} className={dynamicPaper}>
                    <ReactPlayer 
                        url='http://domofon-stream.tattelecom.ru/EC0pqZxsfDF5DfHdSXfm2z0PthuAVU/hls/admin/intercom_24/s.m3u8'
                        playing={true}
                        
                    />
                </Paper>
            </div>,
            <div className="cam-dashboard-box" key={15}>
                <Paper elevation={5} className={dynamicPaper}>
                    <ReactPlayer 
                        url='http://domofon-stream.tattelecom.ru/EC0pqZxsfDF5DfHdSXfm2z0PthuAVU/hls/admin/intercom_25/s.m3u8'
                        playing={true}
                        
                    />
                </Paper>
            </div>,
            <div className="cam-dashboard-box" key={16}>
                <Paper elevation={5} className={dynamicPaper}>
                    <ReactPlayer 
                        url='http://domofon-stream.tattelecom.ru/EC0pqZxsfDF5DfHdSXfm2z0PthuAVU/hls/admin/intercom_26/s.m3u8'
                        playing={true}
                    />
                </Paper>
            </div>,
            <div className="cam-dashboard-box" key={16}>
                <Paper elevation={5} className={dynamicPaper}>
                    <ReactPlayer 
                        url='http://domofon-stream.tattelecom.ru/EC0pqZxsfDF5DfHdSXfm2z0PthuAVU/hls/admin/intercom_22/s.m3u8'
                        playing={true}
                    />
                </Paper>
            </div>,
         
        
    ]); // supply your own state

    // target id will only be set if dragging from one dropzone to another.
    function onChange(sourceIndex, targetIndex) {
      const nextState = swap(items, sourceIndex, targetIndex);
      setItems(nextState);
    }
    let i = 1;
    // let client = new WebSocket('ws://localhost:19001')
    return (
        <div>
                <GridContextProvider onChange={onChange}>
                    <GridDropZone
                        id="items"
                        boxesPerRow={3}
                        rowHeight={400}
                        style={{ height: "385px" }}
                    >   
                        
                        {items.map(item => (
                            <GridItem key={i++}>
                                <div
                                style={{
                                    width: "100%",
                                    height: "100%"
                                }}
                                >
                                {item}
                                </div>
                            </GridItem>
                        ))}
                    </GridDropZone>
                   
                </GridContextProvider>
            {/* <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Paper elevation={5} className={dynamicPaper}>
                        <ReactPlayer 
                            url='http://ovr:ttkdomofonpp4@11.kzn.bd.tattelecom.ru/live/media/AXXON--11/DeviceIpint.465/SourceEndpoint.video:0:0?w=1920&h=0&format=mp4'
                            playing={true} 
                        />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper elevation={5} className={dynamicPaper}>
                        <ReactPlayer 
                            url='http://vlc:vlcrtsp2016@strm-mslm1.tattelecom.ru/live/media/AXXON-MSLM120/DeviceIpint.187/SourceEndpoint.video:0:0?format=mp4'
                            playing={true} 
                        />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper elevation={5} className={dynamicPaper}>
                        <ReactPlayer 
                            url='http://vlc:vlcrtsp2016@strm-mslm1.tattelecom.ru/live/media/AXXON-MSLM120/DeviceIpint.187/SourceEndpoint.video:0:0?format=mp4'
                            playing={true} 
                        />
                    </Paper>
                </Grid>
            </Grid> */}
         
        </div>
    );
};



export default CamDashboard;