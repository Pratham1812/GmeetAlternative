// utils/handleScreenShare.ts

import { MutableRefObject } from 'react';
import { Socket } from 'socket.io-client';

const handleScreenShare = async (
  rtcConnectionRef: MutableRefObject<RTCPeerConnection | null>,
  userStreamRef: MutableRefObject<MediaStream | null>,
  socketRef: Socket | null,
  roomName: string,
  screenShareRef: MutableRefObject<HTMLVideoElement | null>
) => {
  try {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video:{
            width:1280,height:720
        },
    });

    const videoTrack = screenStream.getVideoTracks()[0];

    // Replace the video track in the user's stream
    const sender = rtcConnectionRef.current
      ?.getSenders()
      .find((s) => s.track?.kind === 'video');

    sender?.replaceTrack(videoTrack);

    // Display the screen share stream in the video element
    if (screenShareRef.current) {
      screenShareRef.current.srcObject = screenStream;
      screenShareRef.current.style.display = 'block'; // Show the screen share video
    }

    videoTrack.onended = () => {
      // Revert back to original camera stream when screen sharing ends
      const cameraTrack = userStreamRef.current?.getVideoTracks()[0];
      sender?.replaceTrack(cameraTrack!);
      
      if (screenShareRef.current) {
        screenShareRef.current.style.display = 'none'; // Hide the screen share video
        screenShareRef.current.srcObject = null; // Clear the video element
      }
    };
  } catch (err) {
    console.error('Error sharing screen:', err);
  }
};

export default handleScreenShare;
