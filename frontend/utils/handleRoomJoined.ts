import { Socket } from "socket.io-client";
import startAudioRecording from "./startAudioRecording";
const handleRoomJoined=(
    userStreamRef:React.MutableRefObject<MediaStream|null>,
    userVideoRef:React.RefObject<HTMLVideoElement|null>,
    socket:Socket,
    roomName:string,
    mediaRecorder:React.MutableRefObject<MediaRecorder|null>,
    audioChunks:React.MutableRefObject<Blob[]|null>,
    audioBlob:React.MutableRefObject<Blob|null>
)=>{
    navigator.mediaDevices.getUserMedia({
        audio:true,
        video:{
            width:500,height:500
        },
    }).then((stream)=>{
        startAudioRecording(stream,mediaRecorder,audioChunks,audioBlob);
        userStreamRef.current=stream;
        if(userVideoRef.current!=null){
            userVideoRef.current.srcObject=stream;
            userVideoRef.current.onloadedmetadata=()=>{
                userVideoRef.current?.play();
            };
            socket.emit('ready',roomName);
        }else{
            console.log("Failed to fetch video stream");
        }
    }).catch((error)=>{
        console.log(error);
    })
}
export default handleRoomJoined;
