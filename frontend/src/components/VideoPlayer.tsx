import React, {useContext} from 'react';
import {Grid, Typography, Paper} from '@material-ui/core';
import {createStyles, withStyles, Theme} from '@material-ui/core/styles';

import {SocketIOContext} from '../context/SocketIOContext';


type Props = {
  stream?: MediaStream;
}

const styles = createStyles((theme: Theme) => ({
  video: {
    width: '550px',
    [theme.breakpoints.down('xs')]: {
      width: '300px',
    },
  },
  gridContainer: {
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  paper: {
    padding: '10px',
    border: '2px solid black',
    margin: '10px',
  },
}));


const VideoPlayer = (props: Props)=> {
  const {currentUserVideo} = useContext(SocketIOContext);
  let stream : MediaStream;
  if (props.stream) stream = props.stream;
  // console.log(stream);

  const RenderVideo = () => {
    if (!stream) {
      return <video
        ref={currentUserVideo}
        playsInline
        muted
        autoPlay
      />;
    } else {
      return <video
        ref={(video) => {
          if (video) video.srcObject = stream;
        }}
        playsInline
        autoPlay
      />;
    }
  };

  return (
    <Grid>
      <Paper className='paper'>
        <Grid item>
          <Typography> User Video </Typography>
          <RenderVideo/>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default withStyles(styles)(VideoPlayer);
