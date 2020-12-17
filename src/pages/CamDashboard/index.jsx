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
            <div className="cam-dashboard-box" key={1}>
                <Paper elevation={5} className={dynamicPaper}>
                    <ReactPlayer 
                        url='https://strm-kzn10.tattelecom.ru/hls/3ae4bb62-073b-40f4-9c00-6a0f36e4ade9/playout.m3u8'
                        playing={true}
                        
                    />
                </Paper>
            </div>,
            <div className="cam-dashboard-box" key={2}>
                <Paper elevation={5} className={dynamicPaper}>
                    <ReactPlayer 
                        url='http://ovr:ttkdomofonpp4@11.kzn.bd.tattelecom.ru/live/media/AXXON--11/DeviceIpint.465/SourceEndpoint.video:0:0?w=1920&h=0&format=mp4'
                        playing={true}
                        
                    />
                </Paper>
            </div>,
            <div className="cam-dashboard-box" key={2}>
                <Paper elevation={5} className={dynamicPaper}>
                    <ReactPlayer 
                        url='https://strm-kzn10.tattelecom.ru/hls/143edcc3-ec64-4cca-997e-0559356f7c56/playout.m3u8'
                        playing={true}
                    />
                </Paper>
            </div>,
            <div className="cam-dashboard-box" key={4}>
                <Paper elevation={5} className={dynamicPaper}>
                    <ReactPlayer 
                        url='https://strm-kzn10.tattelecom.ru/hls/084e09bf-f894-4ae1-9902-f520eb0d1c55/playout.m3u8'
                        playing={true}
                        
                    />
                </Paper>
            </div>,
            <div className="cam-dashboard-box" key={5}>
                <Paper elevation={5} className={dynamicPaper}>
                    <ReactPlayer 
                        url='https://strm-kzn10.tattelecom.ru/hls/006a0ed1-f246-4402-b480-1676d6a67f77/playout.m3u8'
                        playing={true}
                        
                    />
                </Paper>
            </div>,
            <div className="cam-dashboard-box" key={6}>
                <Paper elevation={5} className={dynamicPaper}>
                    <ReactPlayer 
                        url='https://strm-kzn10.tattelecom.ru/hls/8d5c2068-9303-4e35-a792-e04082d5f18c/playout.m3u8'
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
            <Box pt={4}>
                <ReactPlayer 
                    url='http://vlc:vlcrtsp2016@sstrm-mslm1.tattelecom.ru/live/media/AXXON-MSLM120/DeviceIpint.188/SourceEndpoint.video:0:1?format=mp4'
                    playing={true} 
                />
            </Box>
        </div>
    );
};



export default CamDashboard;