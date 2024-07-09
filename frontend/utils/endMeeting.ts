import transcribe from "@/services/api/transcribe";
import stopAudioRecording from "./stopAudioRecording";
import summarize from "@/services/api/summarize";
import leaveRoom from "./leaveRoom";
import { Socket } from "socket.io-client";

const endMeeting = async (
    mediaRecorder:React.MutableRefObject<MediaRecorder|null>,
    audioBlob:React.MutableRefObject<Blob|null>,
    roomName: string,
    userVideoRef: React.MutableRefObject<HTMLVideoElement | null>,
    peerVideoRef: React.MutableRefObject<HTMLVideoElement | null>,
    rtcConnectionRef: React.MutableRefObject<RTCPeerConnection | null>,
    socket: Socket| null,
) => {
    stopAudioRecording(mediaRecorder);
    
    leaveRoom(roomName, userVideoRef, peerVideoRef, rtcConnectionRef, socket);
  };

export default endMeeting;