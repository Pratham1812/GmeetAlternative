import http from 'http';
import {Server,Socket} from 'socket.io';

class SignalingServer{
    private io: Server;

    constructor(server: http.Server){
        this.io =new Server(server);
        this.initializeSocketEvents();
    }

    private initializeSocketEvents(){
        this.io.on('connection',(socket:Socket)=>{
            console.log("A user connected");
        
            socket.on('join',(roomName)=>{
                const {rooms}=this.io.sockets.adapter;
                const room=rooms.get(roomName);
        
                if(room==undefined){
                    socket.join(roomName);
                    socket.emit('created');
                }else{
                    socket.join(roomName);
                    socket.emit('joined');
                }
            })
        
            socket.on('ready',(roomName)=>{
                socket.broadcast.to(roomName).emit("ready");
            })
        
            socket.on('offer',(offer,roomName)=>{
                socket.broadcast.to(roomName).emit("offer",offer);
            })
        
            socket.on('answer',(answer,roomName)=>{
                socket.broadcast.to(roomName).emit("answer",answer);
            })
        
            socket.on('leave',(roomName)=>{
                socket.leave(roomName);
                socket.broadcast.to(roomName).emit("leave");
            })
        
            socket.on('disconnect',()=>{
                console.log('A user disconnected');
            })
        })
    }
}

export default SignalingServer;
