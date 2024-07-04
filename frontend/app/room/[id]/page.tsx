"use client"
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import useSocket from '../../../hooks/useSocket';
import { useRouter } from 'next/router';
import handleRoomCreated from '@/utils/handleRoomCreated';
import handleRoomJoined from '@/utils/handleRoomJoined';
import initiateCall from '@/utils/initiateCall';
import onPeerLeave from '@/utils/onPeerLeave';
import handleReceivedOffer from '@/utils/handleReceivedOffer';
import handleAnswer from '@/utils/handleAnswer';
import handlerNewIceCandidateMsg from '@/utils/handlerNewIceCandidateMsg';
import leaveRoom from '@/utils/leaveRoom';

const Room = ({ roomName }: { roomName: string }) => {
  const url: string = process.env.NEXT_PUBLIC_SIGNALING_SERVER_URL as string;
  const socket = useSocket(url);
  const router = useRouter();
  const userVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerVideoRef = useRef<HTMLVideoElement | null>(null);
  const rtcConnectionRef = useRef<RTCPeerConnection | null>(null);
  const userStreamRef = useRef<MediaStream | null>(null);
  const hostRef = useRef(false);

  useEffect(() => {
    if (socket != null) {
      socket.emit('join', roomName);
      socket.on("created", handleRoomCreated);
      socket.on("joined", handleRoomJoined);
      socket.on("ready", initiateCall);
      socket.on("leave", onPeerLeave);
      socket.on("offer", handleReceivedOffer);
      socket.on('answer', handleAnswer);
      socket.on('ice-candidate', handlerNewIceCandidateMsg);

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
      <button onClick={leaveRoom} type="button">Leave</button>
    </div>
  );
}