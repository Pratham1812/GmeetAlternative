import { useEffect,useRef } from "react";
import {io,Socket} from 'socket.io-client';

const useSocket=(url:string)=>{
    const socketCreated=useRef(false);
    const socket=useRef<Socket|null>(null);

    useEffect(()=>{
        if(!socketCreated.current){
            const socketInitializer =async()=>{
                socket.current=io(url);
            }
            try{
                socketInitializer();
                socketCreated.current=true;
            }catch(error){
                console.log(error);
            }
        }
    },[])

    return socket.current;
}

export default useSocket;