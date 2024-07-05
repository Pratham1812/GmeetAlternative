import { MutableRefObject } from 'react';

const handleAnswer = (
  answer: RTCSessionDescriptionInit,
  rtcConnectionRef: MutableRefObject<RTCPeerConnection | null>
) => {
  rtcConnectionRef.current
    ?.setRemoteDescription(answer)
    .catch((err) => console.error(err));
};

export default handleAnswer;
