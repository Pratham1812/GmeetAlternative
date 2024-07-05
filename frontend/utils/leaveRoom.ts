import { MutableRefObject } from 'react';
import { Router } from 'next/router';
import { Socket } from 'socket.io-client';



const leaveRoom = (
  roomName: string,
  userVideoRef: MutableRefObject<HTMLVideoElement | null>,
  peerVideoRef: MutableRefObject<HTMLVideoElement | null>,
  rtcConnectionRef: MutableRefObject<RTCPeerConnection | null>,
  socketRef: Socket| null,
  router: any
) => {
  socketRef?.emit('leave', roomName);

  if (userVideoRef.current?.srcObject) {
    (userVideoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
  }
  if (peerVideoRef.current?.srcObject) {
    (peerVideoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
  }

  if (rtcConnectionRef.current) {
    rtcConnectionRef.current.ontrack = null;
    rtcConnectionRef.current.onicecandidate = null;
    rtcConnectionRef.current.close();
    rtcConnectionRef.current = null;
  }
  router.push('/');
};

export default leaveRoom;
