import express from 'express';
import http from 'http';
import {Server,Socket} from 'socket.io';

const app=express();
const server=http.createServer(app);
const io=new Server(server);

io.on('connection',(socket:Socket)=>{
    console.log("A user connected");

    socket.on('join',(roomName)=>{
        const {rooms}=io.sockets.adapter;
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

server.listen(3001,()=>{
    console.log('socket.io server running on port 3001');
})

