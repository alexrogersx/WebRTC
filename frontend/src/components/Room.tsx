import React, {useContext, useEffect} from 'react';
import VideoPlayer from './VideoPlayer';
import VideoArray from './VideoArray';
import {RouteComponentProps, useHistory} from 'react-router-dom';

import {SocketIOContext} from '../context/SocketIOContext';
import MeetingForm from '../components/MeetingForm';
interface Props {
  history: RouteComponentProps['history'];
  location: RouteComponentProps['location'];
  match: RouteComponentProps['match'];
}


const Room = (props: Props) => {
  const {
    initializeConnection,
    endConnection,
    meeting,
    externalMedia,
  } = useContext(SocketIOContext);
  const history = useHistory();
  useEffect(() => {
    initializeConnection && initializeConnection();
    return () => {
      endConnection && endConnection();
    };
  }, []);
  useEffect(() => {
    history.push('/join/'+meeting?.id);
  }, [meeting]);
  useEffect(() => {
    console.log('external media', externalMedia);
  }, [, externalMedia]);


  return (
    <div>
      <VideoPlayer local/>
      <MeetingForm/>
      <VideoArray />

    </div>
  );
};

export default Room;
