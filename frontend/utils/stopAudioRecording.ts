
const stopAudioRecording=(
    mediaRecorder:React.MutableRefObject<MediaRecorder|null>,
)=>{
    if(mediaRecorder.current){
        mediaRecorder.current.stop;
    }else{
        console.log("mediaRecorder is null");
    }
}
export default stopAudioRecording;