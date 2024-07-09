import express from 'express';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import authRoutes from './routes/auth.routes';
import connectToDB from './db/connectToDB';
import SignalingServer from './services/signalingServer';
import fs from 'fs';
import multer from 'multer';
import FormData from 'form-data';
import axios from 'axios';
import path from 'path';
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const server=http.createServer(app);
const signalingServer= new SignalingServer(server);

// Middlewares
app.use(
    cors({
        origin: "http://localhost:3000",
        // optionsSuccessStatus: 200,


    })
)
app.use(express.json()) 
app.use(cookieParser()) 
app.use(express.urlencoded({extended:true}));
app.use("/api/auth", authRoutes)

app.get('/',(req,res) => {
    res.send("Hello World")
})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.post('/transcribe',upload.single('file'),async(req,res)=>{
  const file=req.file;
  if(!file){
    return res.status(400).json({ error: 'No file uploaded' });
  }
  console.log(file,file.path);
  const data= fs.readFileSync(file.path);
  console.log(data);
  try{
    const response =await axios.post(
      "https://api-inference.huggingface.co/models/openai/whisper-small",data,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
          "Content-Type":"audio/x-flac",
        },
      }
    );
    res.json(response.data);
  }catch(error:any){
    res.status(500).json({error:error.message});
  }
});

app.post('/summarize', async (req, res) => {
    const { transcript } = req.body;
  
    try {
      const response = await axios.post('https://api-inference.huggingface.co/models/facebook/bart-large-cnn',{
        inputs: transcript,
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
  
      res.json(response.data);
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
  });

server.listen(PORT, () => {
    connectToDB();
    console.log(`server is running on port ${PORT}`)
})