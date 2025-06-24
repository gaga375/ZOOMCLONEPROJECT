// import 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import path from 'path';

import {connectoSockit} from './Controler/SocktManager.js';
import express  from 'express';
import {createServer} from "node:http"
import mongoos from"mongoose";
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname ,join } from 'node:path';
import cors from 'cors';
import userControle from './Routs/Allrouts.js'

// use and connect
const app = express();
dotenv.config();
const server = createServer(app)
const io = connectoSockit(server, {
  cors: {
    origin: "*", 
    methods: ['GET', 'POST'],
    allowedHeaders: ['*'],
    credentials: true
  }
});

const mongoos_url = process.env.MONGOOS_URL;
mongoos.connect(mongoos_url);

// app.set
app.set('port',process.env.PORT || 8080)

// app.use
app.use(cors());
app.use(express.json({ limit: '40kb', extended: true }));
app.use(express.urlencoded({limit:"40kb", extended:true}));
app.use('/user',userControle)
app.use(express.static(path.join(__dirname, 'client/build')));


// routs
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});


app.get('/home', async (req ,res)=>{
    res.send("i love tamanna")
})

server.listen(app.get("port"),()=>{
    console.log('server is start')
})
