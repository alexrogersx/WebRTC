/* eslint-disable no-unused-vars */
import React from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import {Box, InputBase, IconButton} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import AddCircle from '@material-ui/icons/AddCircle';
import Gif from '@material-ui/icons/Gif';
import Image from '@material-ui/icons/Image';
import Note from '@material-ui/icons/Note';
import ThumbUp from '@material-ui/icons/ThumbUp';
import TagFaces from '@material-ui/icons/TagFaces';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import SendIcon from '@material-ui/icons/Send';


interface Props {
   concise?: boolean;
}

const useStyles = makeStyles(({palette, spacing}) =>
  createStyles({
    input: {
      flex: 'auto',
      borderRadius: 40,
      paddingLeft: 16,
      backgroundColor: 'rgba(0,0,0,0.04)',
      margin: '0 8px',
      height: 36,
      fontSize: 13,
    },
    icon: {
    },
  }),
);

const ChatInput = (props: Props) => {
  const classes = useStyles();

  return (
    <Box display="flex" minHeight={70} alignItems="center" px={2}>
      <IconButton edge="start" color="inherit">
        <AttachFileIcon className={classes.icon} />
      </IconButton>

      <InputBase
        className={classes.input}
        placeholder={'Type a message...'}
        startAdornment={
          <InputAdornment position={'start'}>
            <IconButton edge="start" color="inherit">
              <TagFaces />
            </IconButton>
          </InputAdornment>
        }
      />

      <IconButton edge="end" color="inherit">
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default ChatInput;
