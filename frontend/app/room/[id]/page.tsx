"use client"
import { useEffect, useRef, useState } from 'react';
import useSocket from '../../../hooks/useSocket';
import {useSearchParams } from 'next/navigation';
import handleRoomCreated from '@/utils/handleRoomCreated';
import handleRoomJoined from '@/utils/handleRoomJoined';
import initiateCall from '@/utils/initiateCall';
import onPeerLeave from '@/utils/onPeerLeave';
import handleReceivedOffer from '@/utils/handleReceivedOffer';
import handleAnswer from '@/utils/handleAnswer';
import handlerNewIceCandidateMsg from '@/utils/handlerNewIceCandidateMsg';
import leaveRoom from '@/utils/leaveRoom';
import createPeerConnection from '@/utils/createPeerConnection';
import handleICECandidateEvent from '@/utils/handleIceCandidateEvent';
import handleTrackEvent from '@/utils/handleTrackEvent';
import toggleMic from '@/utils/toggleMic';
import toggleCamera from '@/utils/toggleCamera';


const Room = () => {
  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const url: string = process.env.NEXT_PUBLIC_SIGNALING_SERVER_URL as string
  const socket = useSocket(url);
  const param = useSearchParams();
  const userVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerVideoRef = useRef<HTMLVideoElement | null>(null);
  const rtcConnectionRef = useRef<RTCPeerConnection | null>(null);
  const userStreamRef = useRef<MediaStream | null>(null);
  const hostRef = useRef<boolean>(false);
  const roomNameParam:string|null=param.get('roomName');
  const roomName:string=roomNameParam?roomNameParam:"";

  useEffect(() => {
    if (socket != null) {
      socket.emit('join', roomName);
      socket.on("created", () => handleRoomCreated(hostRef,userStreamRef, userVideoRef));
      socket.on("joined", () => handleRoomJoined(userStreamRef, userVideoRef, socket, roomName));
      socket.on("ready", () => initiateCall(hostRef, rtcConnectionRef, userStreamRef, socket, roomName, () =>
        createPeerConnection(
          (event) => handleICECandidateEvent(event, socket, roomName),
          (event) => handleTrackEvent(event, peerVideoRef)
        )
      ));
      socket.on("leave", () => onPeerLeave(hostRef, peerVideoRef, rtcConnectionRef));
      socket.on("offer", (offer) => handleReceivedOffer(offer, hostRef, rtcConnectionRef, userStreamRef, socket, roomName, () =>
        createPeerConnection(
          (event) => handleICECandidateEvent(event, socket, roomName),
          (event) => handleTrackEvent(event, peerVideoRef)
        )
      ));
      socket.on('answer', handleAnswer);
      socket.on('ice-candidate', (incoming) => handlerNewIceCandidateMsg(incoming, rtcConnectionRef));

      return () => {
        socket.disconnect();
      };
    } else {
      console.log("Failed to fetch Socket");
    }
  }, [roomName, socket]);

  

  return (
    <div>
      <video autoPlay ref={userVideoRef} />
      <video autoPlay ref={peerVideoRef} />
      <button className='mx-4  bg-red-400 text-black rounded-lg p-3' onClick={() => toggleMic(micActive, setMicActive, userStreamRef)} type="button">
        {micActive ? 'Mute Mic' : 'UnMute Mic'}
      </button>
      <button className='mx-4  bg-red-400 text-black rounded-lg p-3' onClick={() => leaveRoom(roomName, userVideoRef, peerVideoRef, rtcConnectionRef, socket, router)} type="button">
        Leave
      </button>
      <button className='mx-4 bg-red-400 text-black rounded-lg p-3' onClick={() => toggleCamera(cameraActive, setCameraActive, userStreamRef)} type="button">
        {cameraActive ? 'Stop Camera' : 'Start Camera'}
      </button>
      <button className='mx-4  bg-red-400 text-black rounded-lg p-3' onClick={() => {}} type="button">
        Share Screen
      </button>
    </div>
  );
}
export default Room;