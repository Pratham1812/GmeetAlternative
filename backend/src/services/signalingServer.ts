import http from 'http';
import {Server,Socket} from 'socket.io';

class SignalingServer{
    private io: Server;

    constructor(server: http.Server){
        this.io =require("socket.io")(server,{
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET","POST"]
            },
        });
        this.initializeSocketEvents();
    }

    private initializeSocketEvents(){
        this.io.on('connection',(socket:Socket)=>{
            console.log("A user connected", socket.id);
        
            socket.on('join',(roomName)=>{
                const {rooms}=this.io.sockets.adapter;
                const room=rooms.get(roomName);
                console.log("A user joined", roomName);
                if(room==undefined){
                    socket.join(roomName);
                    console.log("creating a room",roomName);
                    socket.emit('created');
                }else{
                    socket.join(roomName);
                    console.log("joining a room",roomName)
                    socket.emit('joined');
                }
            })
        
            socket.on('ready',(roomName)=>{
                console.log("emiting ready",roomName);
                socket.broadcast.to(roomName).emit("ready");
            })
            
            socket.on("ice-candidate",(candidate:RTCIceCandidate,roomName:string)=>{
                console.log(candidate);
                socket.broadcast.to(roomName).emit("ice-candidate",candidate);
            })

            socket.on('offer',(offer,roomName)=>{
                console.log("emiting offer",offer,roomName);
                socket.broadcast.to(roomName).emit("offer",offer);
            })
        
            socket.on('answer',(answer,roomName)=>{
                console.log("emiting answer",answer,roomName);
                socket.broadcast.to(roomName).emit("answer",answer);
            })
        
            socket.on('leave',(roomName)=>{
                socket.leave(roomName);
                console.log("leaving",roomName);
                socket.broadcast.to(roomName).emit("leave");
            })
        
            socket.on('disconnect',()=>{
                console.log('A user disconnected');
            })
        })
    }
}

export default SignalingServer;
