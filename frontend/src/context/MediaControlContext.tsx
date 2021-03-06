/* eslint-disable no-unused-vars */
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState} from 'react';
import {CallOption} from 'peerjs';
import {ChildrenProps, IExternalMedia} from '../util/types';

import User from '@webrtc/backend/dist/shared/classes/User';
import {RestContext} from './RestContext';

import {useSnackbar} from 'notistack';
import {snackbarWarnOptions} from './NotificationProvider';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';

const audioConstrains: MediaTrackConstraintSet = {
  echoCancellation: true,
};

const videoHeight = 480;
const videoWidth = 640;

const videoConstraints: MediaTrackConstraintSet = {
  width: videoWidth,
  height: videoHeight,
};
const webcamConstraints: MediaStreamConstraints = {
  audio: audioConstrains,
  video: {
    ...videoConstraints,
    facingMode: 'user',
  },
};
const screenConstraints: MediaStreamConstraints = {
  audio: audioConstrains,
  video: videoConstraints,
};

/** The Context that handles media and media controls. */
const MediaControlContext = createContext<IMediaControlContext>(undefined!); ``;
/**
 * A context provider for MediaControlContext
 * @param {React.Children} children
 * @return {JSX.Element}
 */
const MediaControlContextProvider: React.FC<ChildrenProps> = ({children}) => {
  const {currentUser} = useContext(RestContext);
  const {enqueueSnackbar} = useSnackbar();
  const sm = useMediaQuery(useTheme().breakpoints.down('sm'));
  /** Boolean State indicating the current user has disabled their microphone */
  const [micMuted, setMicMuted] = useState<boolean>(false);
  /** Boolean State indicating the current user has disabled their webcam */
  const [videoDisabled, setVideoDisabled] = useState<boolean>(false);
  /** Boolean State indicating that screen sharing has been enabled */
  const [screenSharing, setScreenSharing] = useState<boolean>(false);
  /** An array of MediaStreams and user data each representing a stream received
   * from a peer connection */
  const [externalMedia, setExternalMedia] = useState<IExternalMedia[]>([]);
  /** The media stream from the users webcam */
  const [localMedia, setLocalMedia] = useState<MediaStream>();
  /** Ref representing the video element mirroring the users webcam
   * or shared screen */
  const localVideoRef = useRef<HTMLVideoElement>(null);
  /** A ref of the stream being media stream being transmitted to peers. This is
   * distinguished from localMedia to allow for simple switching between
   * background removal and unaltered webcam streams*/
  const [outgoingMedia, setOutgoingMedia] = useState<MediaStream | null>(null);

  const [videoResolution, setVideoResolution] = useState<VideoResolution>({
    height: videoHeight,
    width: videoWidth,
  });

  useEffect(() => {
    const resetVideoResolution = () => {
      setVideoResolution({height: videoHeight, width: videoWidth});
    };

    if (outgoingMedia) {
      const constraints = outgoingMedia?.getVideoTracks()[0].getSettings();
      const {width, height} = constraints;
      if (width && height) {
        setVideoResolution({width, height});
      } else {
        resetVideoResolution();
      }
    } else {
      resetVideoResolution();
    }
  }, [outgoingMedia]);


  const [streamState, setStreamState] = useState<StreamType>(0);

  /** Updates the outgoing stream tracks to match the state of the media
   * control parameters */
  const updateStreamMutes = () => {
    if (outgoingMedia) {
      const audioTracks = outgoingMedia.getAudioTracks();
      const videoTracks = outgoingMedia.getVideoTracks();
      audioTracks.forEach((track)=> track.enabled = !micMuted);
      videoTracks.forEach((track)=> track.enabled = !videoDisabled);
    }
  };

  /** Calls updateStreamMutes() if the state of the media control parameters
   * changes */
  useEffect(() => {
    updateStreamMutes();
  }, [micMuted, videoDisabled]);

  enum ToggleOverride {
    stop
  }
  /**
   * Toggles the screen sharing feature.
   * If screen sharing currently enabled, it is disabled and
   * the video feed is re-initialized with the webcam as the source.
   * Else the video feed is re-initialized with the screen as the source
   * @param {ToggleOverride} override An optional value to override
   * toggling and set screen sharing to a specific state.
   * @return {Promise<void>}
   */
  const toggleScreenShare = async (override?: ToggleOverride) => {
    if (screenSharing || override === ToggleOverride.stop) {
      stopLocalMediaStream();
      setScreenSharing(false);
      await initializeMediaStream();
    } else {
      const success = await initializeMediaStream(StreamType.SCREEN);
      success && setScreenSharing(true);
    }
  };


  /**
   * Attempts to retrieve the webcam media from the browser.
   * Asks the end user for permission.
   * Adds an event listener to the stream that sets the videoDisabled
   * variable to true if the user stops the stream via the browser API and
   * not the application.
   * @return {Promise<MediaStream>} The webcam stream
   */
  const getWebcamMedia = async () => {
    try {
      const stream = await navigator.mediaDevices
          .getUserMedia(webcamConstraints);
      stream
          .getVideoTracks()[0]
          .addEventListener('ended', () => setVideoDisabled(true));
      return stream;
    } catch (err) {
      /** Allow user to decline permission prompt */
      if (err instanceof DOMException) {
        setVideoDisabled(true);
        return;
      } else {
        throw err;
      }
    }
  };
  /**
   * Attempts to retrieve the screen display media (screen sharing)
   * from the browser. Asks the user for permission.
   * Adds an event listener to the stream that sets the screenSharing
   * variable to false if the user stops the stream via the browser API and
   * not the application.
   * @return {Promise<MediaStream>} The screen display media stream
   */
  const getScreenShareMedia = async () => {
    try {
      const stream = await navigator.mediaDevices
          .getDisplayMedia(screenConstraints);
      stream
          .getVideoTracks()[0]
          .addEventListener('ended',
              () => toggleScreenShare(ToggleOverride.stop),
          );
      return stream;
    } catch (err) {
      /** Allow user to decline permission prompt */
      if (err instanceof DOMException) {
        setScreenSharing(false);
        return;
      } else {
        throw err;
      }
    }
  };

  /**
    Set the webcam preview video element to display the outgoing stream
   */
  useEffect(() => {
    if (localVideoRef.current) {
      const previewStream = outgoingMedia?.clone()?? null;
      previewStream?.getAudioTracks()
          .forEach((track) => previewStream.removeTrack(track));
      localVideoRef.current.srcObject = previewStream;
      localVideoRef.current.defaultMuted = true;
      localVideoRef.current.muted = true;
    }
  }, [outgoingMedia]);

  /**
   * Get audio and video stream from the browser
   * Prompts users for mic and video permissions
   * @param {StreamType} target An optional target of where the stream
   * should be retrieved from.
   * @return {Promise<MediaStream>} The retrieved media stream
   */
  const initializeMediaStream = async (target:StreamType = 1) => {
    try {
      /** Retrieves webcam or screen share stream based
       * on screenSharing variable. */
      const stream = target === StreamType.SCREEN?
          await getScreenShareMedia() :
          await getWebcamMedia();
      if (!stream) {
        enqueueSnackbar(
            'User declined permission',
            snackbarWarnOptions(sm),
        );
        return;
      }
      setLocalMedia(stream);
      setOutgoingMedia(stream);
      setStreamState(target);
      return stream;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
  /** Cleans up the webcam stream. Disables browser media use indicator */
  const stopLocalMediaStream = () => {
    localMedia?.getTracks().forEach((track) => track.stop());
  };


  /**
   * Helper function to remove a media stream from the
   * list of media streams to display
   * @param {string} id the id of the media to remove
   */
  const removeMedia = (id: string) => {
    setExternalMedia((oldState)=> oldState
        .filter((media:IExternalMedia) => media.user.id.toString() !== id));
  };
  /**
   * Adds media stream to list of streams to display
   * @param {User} user  The peer user information
   * @param {MediaStream} stream the media stream to add
   * @param {any} data? any additional data to be associated with the stream
   */
  const addExternalMedia = (
      user: User,
      stream:MediaStream,
      data?: CallOption,
  ) => {
    if (!currentUser) return;
    /** Prevent local user from being added to the list. */
    if (user.id.toHexString() === currentUser?.id.toHexString()) return;
    const newMediaItem = {
      user, stream, data: data?? undefined,
    };
    console.log('adding media stream from: ', user.fullName);
    setExternalMedia((oldState) => {
      /** Guard against duplicates */
      if (oldState.find((media) =>
        media.user.id.toHexString() === user.id.toHexString())) return oldState;
      return [...oldState, newMediaItem];
    });
  };
  /**
   * Clears all external media streams
   * @return {void}
   */
  const clearExternalMedia = () => setExternalMedia([]);

  return (
    <MediaControlContext.Provider
      value={{
        externalMedia,
        localVideoRef,
        initializeMediaStream,
        setMicMuted,
        setVideoDisabled,
        toggleScreenShare,
        micMuted,
        videoDisabled,
        screenSharing,
        outgoingMedia,
        setOutgoingMedia,
        removeMedia,
        addExternalMedia,
        clearExternalMedia,
        localMedia,
        stopLocalMediaStream,
        updateStreamMutes,
        streamState,
        videoResolution,
      }}
    >
      {children}
    </MediaControlContext.Provider>
  );
};

export interface IMediaControlContext {
  externalMedia: IExternalMedia[],
  localVideoRef: React.RefObject<HTMLVideoElement>,
  initializeMediaStream: () => Promise<MediaStream| undefined>,
  setMicMuted: (boolean: boolean) => void,
  setVideoDisabled: (boolean: boolean) => void,
  toggleScreenShare: () => Promise<void>,
  micMuted: boolean,
  videoDisabled: boolean,
  screenSharing: boolean,
  localMedia: MediaStream | undefined,
  outgoingMedia: MediaStream | null,
  setOutgoingMedia: (media: MediaStream) => void,
  removeMedia: (id:string) => void
  addExternalMedia: (user:User, stream:MediaStream, data?:CallOption) => void,
  clearExternalMedia: () => void,
  stopLocalMediaStream: () => void,
  updateStreamMutes: () => void,
  streamState: StreamType,
  videoResolution: VideoResolution,
}

MediaControlContext.displayName = 'Media Control Context';


export {MediaControlContextProvider, MediaControlContext};

type VideoResolution = {
  height : number,
  width : number,
}

export enum StreamType {
  DISABLED,
  WEBCAM,
  SCREEN,
}
