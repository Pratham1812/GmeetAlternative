import { useRouter } from "next/navigation";
import { useEffect,useRef, useState } from "react";
import {io,Socket} from 'socket.io-client';

const useSocket=(url:string):Socket|null=>{
    const socketCreated=useRef(false);
    const [socket,setSocket]=useState<Socket|null>(null);
    const user=localStorage.getItem("user");
    const router=useRouter();
    if(!user){
        router.push('/auth/signin');
    }
    const token=JSON.parse(user?user:'').token;
    useEffect(()=>{
        if(!socketCreated.current){
            const socketInitializer =async()=>{
                const socketInstance=  io("http://localhost:4000",{
                    auth:{
                        token:token
                    }
                });
                socketInstance.connect();
                console.log(socketInstance);
                socketInstance.on('connect',()=>{
                    setSocket(socketInstance);
                    console.log(socketInstance);
                    console.log("socket connected");
                });

                socketInstance.on("connect_error",(error)=>{
                    console.log("connection error",error);
                })
                
                socketInstance.on("disconnect",(error)=>{
                    console.log("socket disconnected");
                    setSocket(null);
                })
            }
            try{
                socketInitializer();
                socketCreated.current=true;
            }catch(error){
                console.log(error,"failed");
            }
        }
    },[url])

    return socket;
}

export default useSocket;
