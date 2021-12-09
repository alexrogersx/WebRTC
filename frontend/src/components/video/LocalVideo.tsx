/* eslint-disable no-unused-vars */
import React, {useContext, useEffect} from 'react';
import {CircularProgress, Paper} from '@material-ui/core';
import WebcamControls from './WebcamControls';
import {MediaControlContext, StreamType,
} from '../../context/MediaControlContext';
import {VideoClasses, VideoProps} from './VideoPlayer';
import clsx from 'clsx';
import {AppStateContext} from 'src/context/AppStateContext';
import {LOCAL_VIDEO_WIDTH} from '../../util/constants';

interface LocalVideoClasses extends VideoClasses {
  localContainer?: string;
}
export interface LocalVideoProps extends VideoProps {
  propClasses: LocalVideoClasses
}

/**
 * Renders a local video element which acts as webcam preview displaying
 * the users outgoing webcam feed.
 * @param {boolean} videoLoading A boolean indicating whether the video is
 * loading or ready to displayed. When loading is true, the webcam preview
 * is hidden and a loading animation is shown.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setVideoLoading
 * A function to set the video loading state.
 * @param {LocalVideoClasses} propClasses An object representing Css classes
 * to pass to the internal components.
 * @return {JSX.Element}
 * @constructor
 */
export function LocalVideo({
  videoLoading,
  setVideoLoading,
  propClasses,
}: LocalVideoProps) {
  const {
    localVideoRef,
    outgoingMedia,
    streamState,
  } = useContext(MediaControlContext);
  const {videoDrawerOpen} = useContext(AppStateContext);

  /** Set video loading to true on first render */
  useEffect(() => {
    setVideoLoading(true);
  }, []);
  /** When the video drawer open stage changes check if the
   * video element readyState is 0 (meaning it has no media set).
   * If so, set the srcObject to the outgoing stream */
  useEffect(() => {
    if (localVideoRef.current?.readyState === 0) {
      if (localVideoRef.current && outgoingMedia) {
        localVideoRef.current.srcObject = outgoingMedia;
      }
    }
  }, [videoDrawerOpen]);

  /**
   * A function that returns CSS properties for
   * the video element.
   * @return {React.CSSProperties} The css properties to apply to the style
   * prop of the element
   */
  const videoStyle = () : React.CSSProperties => {
    const transform = streamState === StreamType.WEBCAM?
      'rotateY(180deg)': undefined;
    return {transform};
  };

  return (
    <div className={clsx(propClasses.localContainer, propClasses.container)}>
      {videoLoading &&(
        <CircularProgress
          className={propClasses.progress}
          size={80}
          thickness={4}
          disableShrink
          classes={{
            circle: propClasses.circle,
          }}
        />
      )}
      <Paper className={propClasses.paper} elevation={3} variant="outlined" >
        <video
          className={ propClasses.video}
          style={videoStyle()}
          ref={localVideoRef}
          playsInline
          muted
          height='auto'
          width={LOCAL_VIDEO_WIDTH}
          autoPlay
          onCanPlay={() => setVideoLoading(false)}
          // onLoadStart={() => setVideoLoading(true)}
        />
        <WebcamControls className={propClasses.controls}/>
      </Paper>
    </div>
  );
}
/**
 * A memoized version of the LocalVideo component.
 * @type {React.NamedExoticComponent<LocalVideo>}
 */
export const MemoizedLocalVideo = React.memo(LocalVideo);
