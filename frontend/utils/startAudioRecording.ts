

const startAudioRecording=(
    stream:MediaStream,
    mediaRecorder:React.MutableRefObject<MediaRecorder|null>,
    audioChunks:React.MutableRefObject<Blob[]|null>,
    audioUrl:React.MutableRefObject<String|null>
)=>{
    mediaRecorder.current=new MediaRecorder(stream);
    mediaRecorder.current.ondataavailable=event=>{
        if(event.data.size>0){
            audioChunks.current?.push(event.data);
        }
    };

    mediaRecorder.current.onstop=()=>{
        if(audioChunks.current){
            const audioBlob=new Blob(audioChunks.current,{type:'audio/wav'});
            audioUrl.current=URL.createObjectURL(audioBlob);
        }else{
            console.log("Failed to fetch audioChunks array");
        }
    };
    mediaRecorder.current.start();

}
export default startAudioRecording;