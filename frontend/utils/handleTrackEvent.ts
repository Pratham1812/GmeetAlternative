import { MutableRefObject } from 'react';

const handleTrackEvent = (event: RTCTrackEvent, peerVideoRef: MutableRefObject<HTMLVideoElement | null>) => {
  if (peerVideoRef.current) {
    peerVideoRef.current.srcObject = event.streams[0];
  }else{
    console.log("failed to fetch peer video")
  }
};

export default handleTrackEvent;
