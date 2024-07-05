import { MutableRefObject } from 'react';
import { Socket } from 'socket.io-client';

const initiateCall = (
  hostRef: MutableRefObject<boolean>,
  rtcConnectionRef: MutableRefObject<RTCPeerConnection | null>,
  userStreamRef: MutableRefObject<MediaStream | null>,
  socketRef: Socket,
  roomName: string,
  createPeerConnection: () => RTCPeerConnection
) => {
  if (hostRef.current) {
    rtcConnectionRef.current = createPeerConnection();
    userStreamRef.current?.getTracks().forEach((track) => {
      rtcConnectionRef.current?.addTrack(track, userStreamRef.current as MediaStream);
    });

    rtcConnectionRef.current
      ?.createOffer()
      .then((offer) => {
        rtcConnectionRef.current?.setLocalDescription(offer);
        socketRef.emit('offer', offer, roomName);
      })
      .catch((error) => {
        console.error(error);
      });
  }
};

export default initiateCall;
