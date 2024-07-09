import summarize from "@/services/api/summarize";
import transcribe from "@/services/api/transcribe";


const startAudioRecording=(
    stream:MediaStream,
    mediaRecorder:React.MutableRefObject<MediaRecorder|null>,
    audioChunks:React.MutableRefObject<Blob[]|null>,
    audioBlob:React.MutableRefObject<Blob|null>,
    summary:React.MutableRefObject<string|null>

)=>{
    mediaRecorder.current=new MediaRecorder(stream);
    console.log(mediaRecorder.current);
    mediaRecorder.current.ondataavailable=event=>{
        console.log("fetching data from mediaRecorder");
        if(event.data.size>0){
            console.log("adding data to audiochunks array");
            if(audioChunks.current){
                audioChunks.current.push(event.data);
                console.log(audioChunks.current);
            }else{
                audioChunks.current=[];
                audioChunks.current.push(event.data);
                console.log(audioChunks.current);
            }    
        }
    };
    mediaRecorder.current.onstop=async ()=>{
        if(audioChunks.current){
            audioBlob.current=new Blob(audioChunks.current,{type:'audio/flac'});
            console.log(audioBlob.current);
            const transcript = await transcribe(audioBlob);
            console.log(transcript);
            const result= await summarize(transcript?transcript:'');
            if(result!=undefined){
            summary.current=result;
    }
        }else{
            console.log("Failed to fetch audioChunks array");
        }
    };
    mediaRecorder.current.start();
    console.log(mediaRecorder.current);

}
export default startAudioRecording;