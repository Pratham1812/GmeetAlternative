import axios, { AxiosResponse } from "axios";

const transcribe=async(
    audioBlob:React.MutableRefObject<Blob|null>
):Promise<string|undefined>=>{
    try{
        const formData=new FormData();
        if(audioBlob.current){
            formData.append('file',audioBlob.current,'recording.wav');
            const response= await axios.post("http://localhost:4000/transcribe",{
                body:formData
            },
        {
            headers:{
                "Content-Type":"application/json",
            },
        }
    )
    return response.data;
        }else{
            console.log("failed to fetch audio file");
        }
    }catch(error){
        console.log("Failed to fetch transcript");
    }
}
export default transcribe;