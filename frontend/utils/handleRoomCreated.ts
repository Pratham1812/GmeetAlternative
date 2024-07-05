
const handleRoomCreated=(
    hostRef:React.MutableRefObject<boolean>,
    userStreamRef:React.MutableRefObject<MediaStream|null>,
    userVideoRef:React.RefObject<HTMLVideoElement|null>
)=>{
    hostRef.current=true;
    navigator.mediaDevices.getUserMedia({
        audio: true,
        video:{
            width:500,height:500
        },
    }).then((stream)=>{
        userStreamRef.current=stream;
        if(userVideoRef.current!=null){
            userVideoRef.current.srcObject=stream;
            userVideoRef.current.onloadedmetadata=()=>{
                userVideoRef.current?.play();
            }
        }else{
            console.log("Failed to fetch video stream");
        }
    }).catch((error)=>{
        console.log(error);
    })
}
export default handleRoomCreated;