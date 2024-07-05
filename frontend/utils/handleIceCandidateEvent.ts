import { MutableRefObject } from 'react';
import { Socket } from 'socket.io-client';

const handleICECandidateEvent = (
  event: RTCPeerConnectionIceEvent,
  socketRef: Socket,
  roomName: string
) => {
  if (event.candidate) {
    socketRef.emit('ice-candidate', event.candidate, roomName);
  }
};

export default handleICECandidateEvent;
