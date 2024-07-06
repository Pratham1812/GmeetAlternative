import { MutableRefObject } from 'react';

const handleAnswer = (
  answer: RTCSessionDescriptionInit,
  rtcConnectionRef: MutableRefObject<RTCPeerConnection | null>
) => {
  console.log(rtcConnectionRef.current);
  rtcConnectionRef.current
    ?.setRemoteDescription(answer)
    .catch((err) => console.error(err));
};

export default handleAnswer;
