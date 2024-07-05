
import { MutableRefObject } from 'react';

const handlerNewIceCandidateMsg = (
  incoming: RTCIceCandidateInit,
  rtcConnectionRef: MutableRefObject<RTCPeerConnection | null>
) => {
  const candidate = new RTCIceCandidate(incoming);
  rtcConnectionRef.current
    ?.addIceCandidate(candidate)
    .catch((e) => console.error(e));
};

export default handlerNewIceCandidateMsg;
