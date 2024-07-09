import axios, { AxiosResponse } from "axios";

const transcribe=async(
    audioBlob:React.MutableRefObject<Blob|null>
):Promise<string|undefined>=>{
    console.log("inside transcribe api call",audioBlob.current);
    try{
        const formData=new FormData();
        if(audioBlob.current){
            formData.append('file',audioBlob.current,'recording.flac');
            console.log(formData);
            const response= await axios.post("http://localhost:4000/transcribe",formData,
            {
                headers:{
                    "Content-Type":"multipart/form-data",
                },
            });
            console.log(response.data.text);
            return response.data.text;
        }else{
            console.log("failed to fetch audio file");
        }
    }catch(error){
        console.log("Failed to fetch transcript");
    }
}
export default transcribe;