import { MutableRefObject } from 'react';

const onPeerLeave = (
  hostRef: MutableRefObject<boolean>,
  peerVideoRef: MutableRefObject<HTMLVideoElement | null>,
  rtcConnectionRef: MutableRefObject<RTCPeerConnection | null>
) => {
  hostRef.current = true;
  if (peerVideoRef.current?.srcObject) {
    (peerVideoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
  }

  if (rtcConnectionRef.current) {
    rtcConnectionRef.current.ontrack = null;
    rtcConnectionRef.current.onicecandidate = null;
    rtcConnectionRef.current.close();
    rtcConnectionRef.current = null;
  }
};

export default onPeerLeave;
