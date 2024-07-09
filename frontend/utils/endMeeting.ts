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
    summary:React.MutableRefObject<string|null>
) => {
    stopAudioRecording(mediaRecorder);
    const transcript = await transcribe(audioBlob);
    const result= await summarize(transcript?transcript:'');
    if(result!=undefined){
        summary.current=result;
    }
    leaveRoom(roomName, userVideoRef, peerVideoRef, rtcConnectionRef, socket);
  };

export default endMeeting;