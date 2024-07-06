import { MutableRefObject } from 'react';
import { Socket } from 'socket.io-client';

const handleReceivedOffer = (
  offer: RTCSessionDescriptionInit,
  hostRef: MutableRefObject<boolean>,
  rtcConnectionRef: MutableRefObject<RTCPeerConnection | null>,
  userStreamRef: MutableRefObject<MediaStream | null>,
  socketRef: Socket,
  roomName: string,
  createPeerConnection: () => RTCPeerConnection
) => {
  if (!hostRef.current) {
    rtcConnectionRef.current = createPeerConnection();
    console.log(rtcConnectionRef.current);
    userStreamRef.current?.getTracks().forEach((track) => {
      rtcConnectionRef.current?.addTrack(track, userStreamRef.current as MediaStream);
    });

    rtcConnectionRef.current?.setRemoteDescription(offer);

    rtcConnectionRef.current
      ?.createAnswer()
      .then((answer) => {
        rtcConnectionRef.current?.setLocalDescription(answer);
        console.log(rtcConnectionRef.current);
        console.log("emitting answer",answer,roomName);
        socketRef.emit('answer', answer, roomName);
      })
      .catch((error) => {
        console.error(error);
      });
  }
};

export default handleReceivedOffer;
