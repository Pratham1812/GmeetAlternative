import http from 'http';
import {Server,Socket} from 'socket.io';
import jwt,{JwtPayload,VerifyErrors, VerifyOptions} from 'jsonwebtoken';

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
        interface DecodedToken extends JwtPayload {
            username: string;
          }
        const verifyOptions:VerifyOptions={};
        this.io.use((socket:Socket,next:(error?:Error)=>void)=>{
            const token=socket.handshake.auth.token;
            if(token){
                jwt.verify(token,process.env.JWT_SECRET,verifyOptions,(error,decoded)=>{
                    if(error){
                        return next(new Error('Authentication Error'));
                    }
                    socket.data.user=decoded;
                    next();
                });
            }else{
                next(new Error('Authentication Error'));
            }
        });

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
