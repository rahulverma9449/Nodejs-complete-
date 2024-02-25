import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import http from "http";
import { Socket } from "dgram";
import {connectToDB} from './config/mogodb.js'
import { chatModel } from "./schema/chatSchema.js";

const app = express();

// 1. creating a server

const server = http.createServer(app);

// 2. create socket server

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// 3. using socket event

io.on("connect", (socket) => {
  console.log("Connection is established");

  socket.on("join", (data)=>{
        socket.username = data;
        socket.broadcast.emit('join_msg' , socket.username );

        // send old messages to the clients.
        chatModel.find()
            .then(messages => {
                socket.emit('load_messages', messages);
            }).catch(err => {
                console.log(err);
            })
  });


  socket.on('new_message', (message) =>{
    let userMessage = {
        username : socket.username,
        message : message
    }

    const newChat = new chatModel({
        username: socket.username,
        message: message,
        timestamp: new Date()
    });
    newChat.save();

    socket.broadcast.emit('broadcast_message' , userMessage);
    
  })


  socket.on("disconnect", () => {
    console.log("Connection is disconnected");
    socket.broadcast.emit('left_msg' , socket.username )
  });
});

server.listen(3400, () => {
  console.log("Server is runing on 3400");
  connectToDB();
});
