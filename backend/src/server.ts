import express from 'express';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import authRoutes from './routes/auth.routes';
import connectToDB from './db/connectToDB';
import SignalingServer from './services/signalingServer';

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const server=http.createServer(app);
const signalingServer= new SignalingServer(server);

app.use(
    cors({
        origin: "http://localhost:3000",
        optionsSuccessStatus: 200, 
        // Some legacy browsers choke on 204
    })
);
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res) => {
    res.send("Hello World!!")
})


// Middlewares
app.use(express.json()) // to extract the fields from req.body
app.use(cookieParser()) // to extract the cookie from req.cookies

app.use("/api/auth", authRoutes)



server.listen(PORT, () => {
    connectToDB();
    console.log(`server is running on port ${PORT}`)
})