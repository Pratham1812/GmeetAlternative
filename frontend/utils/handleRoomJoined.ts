import { MutableRefObject } from 'react';
import { Socket } from 'socket.io-client';

const handleRoomJoined = (
  userStreamRef: MutableRefObject<MediaStream | null>,
  userVideoRef: MutableRefObject<HTMLVideoElement | null>,
  socketRef: Socket,
  roomName: string
) => {
  navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: { width: 500, height: 500 },
    })
    .then((stream) => {
      userStreamRef.current = stream;
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
        userVideoRef.current.onloadedmetadata = () => {
          userVideoRef.current?.play();
        };
      }
      socketRef.emit('ready', roomName);
    })
    .catch((err) => {
      console.error(err);
    });
};

export default handleRoomJoined;
