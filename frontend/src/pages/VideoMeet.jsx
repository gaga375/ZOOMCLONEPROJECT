import { Modal } from "@material-ui/core";
import {useRef, useEffect, useState } from "react";
import Button from '@mui/material/Button';
import io from 'socket.io-client';
import { useNavigate } from "react-router-dom";
import server from "../environment";
import { color, height, width } from "@mui/system";
import TextField from "@mui/material/TextField";
import { redirect, useParams } from "react-router-dom";
import axios from "axios";
import  Badge from "@mui/material/Badge";
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import CallEndIcon from '@mui/icons-material/CallEnd'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import ChatIcon from '@mui/icons-material/Chat'
import IconButton from '@mui/material/IconButton';
import "../cssfile/VideoMeet.css"

 const server_url = server;
 
const peerConfigConnections = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};
    let connections = {};
 
export default function VideoMeetComponent() {

 let render = useNavigate();
     let socketRef = useRef();
     let socketIdRef = useRef();
     let localVideoRef = useRef()

     
     let [videoAvailable , setvideoAvailable] = useState(true);
     let [AudioAvailable , setAudioAvailable] = useState(true);
     let [video, setVideo] = useState([]);
     let [audio , setaudio] = useState();
     let [screen , setscreen] = useState();
     let [showModal,setModal] = useState(false);
     let [screenAvailable, setscreenAvailable] = useState();
     let [messages , setmessages] = useState([]);
     let [message, setmessage] = useState('');
     let [newMessages,setnewMessages] = useState(7);
     let [askForUsername , setaskForUsername] = useState(true);
     let [username , setUsername] = useState('');
    let [videos, setVideos] = useState([])
     const videoRef = useRef([]);
     let [LocalDescription,setLocalDescription] = useState()


useEffect(()=>{
getPermissions();
});


const { url } = useParams();

  let getPermissions = async ()=>{
    try{
    let videoPermission = await navigator.mediaDevices.getUserMedia({video:true})

    if(videoPermission){
        setvideoAvailable(true)
    } else{
        setvideoAvailable(false)
    };
let audioPermission = await navigator.mediaDevices.getUserMedia({audio:true})

    if(audioPermission){
        setAudioAvailable(true)
    }
    else{
        setAudioAvailable(false)
    };

    if(navigator.mediaDevices.getDisplayMedia){
        setscreenAvailable(true);
    }
      else{
            setscreenAvailable(false);
        }


        if( videoAvailable || AudioAvailable){
 const userMdeiaStream = await navigator.mediaDevices.getUserMedia({video:videoAvailable,audio:AudioAvailable});   
if(userMdeiaStream){
    window.localStream = userMdeiaStream;
    if(localVideoRef.current){
        localVideoRef.current.srcObject = userMdeiaStream;
   }
  }
 }
} catch (e){
console.log(e)
    }
  };

useEffect(()=>{
    if(video !== undefined && audio !== undefined){
        getUserMedia();
    }
},[audio,video])




let getMedia = ()=>{
    setVideo(videoAvailable);
    setaudio(AudioAvailable);
    connectToSocketServer();
}


let getUserMediaSuccess = (stream)=>{
try{
window.localStream.getTracks().forEach(teack=>teack.stop())
}
catch (e){
    console.log(e)
}

window.localStream = stream;
localVideoRef.current.srcObject = stream;


for ( let id in connections){
    if( id === socketIdRef.current) continue;

    connections[id].addStream(window.localStream)

    connections[id].createOffer().then((description)=>{
        connections[id].setLocalDescription(description)
        .then(()=>{
            socketRef.current.emit('signal',id,JSON.stringify({'sdp':connections[id].localDescription}))
        })
        .catch(e=>console.log(e))
        
    })
}
stream.getTracks().forEach(track => track.onended = ()=>{

    setVideo(false)
    setaudio(false);
    
    try{
let track = localVideoRef.current.srcObject.getTracks()
track.forEach(track =>track.stop())
    }
    catch (e){
        console.log(e)
    }

      let blacksilence = (...args) => new MediaStream([black(...args),silence()])
                   window.localStream = blacksilence();
                   localVideoRef.current.srcObject = window.localStream;

                   
    for( let id in connections){
        connections[id].addStream(window.localStream)
        connections[id].createOffer().then((description)=>{
            connections[id].setLocalDescription(description)
            .then(()=>{
                socketRef.current.emit('signal',id,JSON.stringify({"sdp":connections[id].localDescription}))
            })
            .catch(e=>console.log(e))
        })
    }
})

}

let silence = ()=>{
let ctx = new AudioContext()
let oscillator = ctx.createOscillator()

let dst = oscillator.connect(ctx.createMediaStreamDestination());

oscillator.start();
ctx.resume()
return Object.assign(dst.stream.getAudioTracks()[0],{enabled:false})

}

let black = ({width=650, height= 550} = {}) =>{
  let canvas = Object.assign(document.createElement('canvas'),{width,height});

  canvas.getContext('2d').fillRect(0,0,width,height);
  let stream = canvas.captureStream();
  return Object.assign(stream.getVideoTracks()[0],{enabled:false})
};



let getUserMedia = ()=>{
    if(( video && videoAvailable) || (audio && AudioAvailable)){
        navigator.mediaDevices.getUserMedia({video:video,audio:audio})
       .then(getUserMediaSuccess)
       .then((stream)=>{})
       .catch((error)=>{console.log(error)});
    }
    else{
       try{
 let tracks = localVideoRef.current.srcObject.getTracks();
 tracks.forEach(track => track.stop())
       }catch(e){
        console.log(e)
       } 
    }
}


let gotMessageFromServer = (fromId,message) =>{
var signal = JSON.parse(message)

if(fromId !== socketIdRef.current){
    if(signal.sdp){

        connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(()=>{
        if( signal.sdp.type === "offer"){

            connections[fromId].createAnswer().then((description)=>{
                connections[fromId].setLocalDescription(description).then(()=>{
                    socketRef.current.emit('signal',fromId,JSON.stringify({"sdp":connections[fromId].localDescription}))
                }).catch(e=>console.log(e));

            }).catch(e=>console.log(e))
        }
      }).catch(e=>console.log(e))
    }

if(signal.ice){
    connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e=>console.log(e));
}

  }
 }

let addMessage = (data,sender,socketIdSender)=>{

    setmessages((prevMessages)=>[
        ...prevMessages,
       { sender:sender, data:data }
    ]);

    if(socketIdSender !== socketIdRef.current){
setnewMessages ((prevMessages)=> prevMessages + 1)
    }
}

let connectToSocketServer = ()=>{
    socketRef.current = io.connect(server_url , {secure:false})

    socketRef.current.on('signal',gotMessageFromServer)

    socketRef.current.on('connect',()=>{
        socketRef.current.emit('join-call',url) //window.location.href

        socketIdRef.current = socketRef.current.id

        socketRef.current.on('chat-message',addMessage)

        socketRef.current.on ('user-left',(id)=>{
           setVideos((videos)=> videos.filter((video)=>video.socketId !== id))
        })
        socketRef.current.on('user-joined',(id,clients)=>{

            clients.forEach((socketListId)=>{

                connections[socketListId] = new RTCPeerConnection(peerConfigConnections)

                connections[socketListId].onicecandidate = function (event){
                    if(event.candidate != null){
                        socketRef.current.emit('signal',socketListId,JSON.stringify({"ice":event.candidate}))
                    }
                }


                connections[socketListId].onaddstream = (event)=>{

                    let videoExists = videoRef.current.find(video => video.socketId === socketListId);
                    if( videoExists){
                        setVideos(videos =>{
                            const updateVideos = videos.map(video =>
                             video.socketId === socketListId ? {...video,stream:event.stream} :video);
                         videoRef.current = updateVideos;
                    return updateVideos  
                        });
                    } 
                    else{
                        let newVideo = {
                     socketId:socketListId,
                     stream: event.stream,
                     autoPlay:true,
                     playsinline: true
                        }
                     setVideos(videos=>{
                        const updatedVideos = [...videos,newVideo];
                        videoRef.current = updatedVideos;
                        return updatedVideos;
                     });

                    }
                };


                 if(window.localStream !== undefined && window.localStream !== null){

                    connections[socketListId].addStream(window.localStream);
                }
                else{ 

                

                   let blacksilence = (...args) => new MediaStream([black(...args),silence()])
                   window.localStream = blacksilence();
                   connections[socketListId].addStream(window.localStream);
                }
            })

            if(id === socketIdRef.current){
                for (let id2 in connections){
                if( id2 === socketIdRef.current) continue

             try{
                connections[id2].addStream(window.localStream)
             } 
             catch (e) {
           connections[id2].createOffer().then((description)=>{
            connections[id2].setLocalDescription(description)
            .then(()=>{
                socketRef.current.emit("signal",id2, JSON.stringify({'sdp':connections[id2].localDescription}))
            })
            .catch(e => console.log(e))
           })
             }

                }
            }
        })
    })
}


let connect = async ()=>{

try{
 if(! username){
    alert("username is required pleese enter user name")
    return;
 }
}
catch (e){

}


let MainUsername ;
try{
const response = await axios.post('http://localhost:8080/user/gte_all_addactivity',{
token: localStorage.getItem("token")
})
 MainUsername = response.data[0].username

}
catch (e){
  console.log(e)
}
try{
const response = await axios.post('http://localhost:8080/user/gte_all_addactivity/add',{
token:localStorage.getItem("token"),
mettingCode:localStorage.getItem('meetingCODE'),
Username:MainUsername
})

}
catch(e){
console.log(e)
}


    setaskForUsername(false);
    await getPermissions();
    getMedia();
}

let getDisplayMediaSucess = (stream)=>{
    try{
   window.localStream.getTracks().forEach(track => track.stop())
    }
    catch(e){
        console.log(e)
    }

    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    for(let id in connections){
        if(id=== socketIdRef.current) continue ;

        connections[id].addStream(window.localStream)
        connections[id].createOffer().then((description)=>[
            connections[id].setLocalDescription(description)
            .then(()=>{
                socketRef.current.emit('signal',id,JSON.stringify({'sdp':connections[id].localDescription}))
            })
            .catch((e)=>{console.log(e)})
        ])
    }

stream.getTracks().forEach(track => track.onended = () => {
            setscreen(false)

            try {
                let tracks = localVideoRef.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoRef.current.srcObject = window.localStream

            getUserMedia()

        })
}

let getMessage = ()=>{

}


let getDisplayMedia = async () =>{
if(screen){
  if(navigator.mediaDevices.getDisplayMedia){
    navigator.mediaDevices.getDisplayMedia({video:this,audio:true})
    .then(getDisplayMediaSucess)
    .then((stream)=>{ }) 
    .catch((e)=>{console.log(e)})
  }
  }
  }

let hendleCallEnd = ()=>{
    let token = localStorage.getItem('token')
    
 try {
                let tracks = localVideoRef.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }
            try{
          if(! token){
                 render('/gest')
            }
           else{
            render('/home')
            }
           }
           catch(e){
            console.log(e)
           }
}


let openChat = () => {
        setModal(true);
        setnewMessages(0);
    }
    let closeChat = () => {
        setModal(false);
    }

useEffect(()=>{
    if(screen !== undefined){
        getDisplayMedia();
    }
},[screen])


let hendleVideo = ()=>{
 setVideo(!video)
}

let hendleAudio = ()=>{
 setaudio(!audio)
}

let hendleScreen = () => {
    setscreen(!screen)
}

let hendleModel = ()=>{
    setModal(!showModal)
    console.log("working")
}

let sendMessage = ()=>{
    socketRef.current.emit("chat-message",message,username)
    setmessage("")
}


    return(

  <div className="container">
            {askForUsername === true ?
                <div>
                    <h2>Enter into Lobby </h2>

           
                    <div className="form-container"> 
                    <TextField 
                    id="outlined-basic"
                    label="name"
                    value={username}
                    required
                     onChange={e => setUsername(e.target.value)}
                     variant="outlined"
                          /> 
                          
                          <br />
                    <Button variant="contained" onClick={connect}>Connect</Button>
                    </div>
                    <div className="mainvideo">
                        <video  ref={localVideoRef} autoPlay muted></video>
                    </div>
                </div> 
               
                :
            
                <div>
                    {showModal ?
                      <div className="chatcontainer">
                        <div className="chatnavcontainer">
                             <div>  <h2>chat</h2></div>
                            <div onClick={hendleModel} className="chatcuticon" ><i className="fa-solid fa-x"></i></div>
                        </div>
                        <hr />



<div className="chating-area">
{
    messages.map((item,index)=>{
        return(
            <div key={index}>
{ item.sender === username ?
 <p className="leftchat">

    <div className="chattextstyle">
            <p className="chatsenderstyle">{item.sender}</p>
            <p>{item.data}</p>
  </div>
          </p>

 :
          <p className="rightchat">
    <div className="rightchattextstyle">
            <p className="chatsenderstyle">{item.sender}</p>
            <p>{item.data}</p>
     </div>
          </p>
          }
            </div>

        )
    })
}
</div>

                        <div className="chat-sent">
                             <TextField id="outlined-basic" onChange={e => setmessage(e.target.value)} value={message} label="message"  variant="outlined" />
                    <Button variant="contained" onClick={sendMessage}>Send</Button>
                        </div>
                    </div>
                    :<></>}
                  
                    <div className="mainvideo2">
                    <video  ref={localVideoRef} autoPlay muted></video>
                    </div>
                 <div className="StreamVideo">
                   {
                    videos.length  < 2 ?
                    
                
                         <div className="StreamVideoFlex1length" >
                        {videos.map((video) => (
                            <div key={video.socketId}>
                                <video
                                    data-socket={video.socketId}
                                    ref={ref => {
                                        if (ref && video.stream) {
                                            ref.srcObject = video.stream;
                                        }
                                    }}
                                    autoPlay
                                >
                                </video>
                            </div>
                        ))}
                    </div>
                    :
                   
                    <div className="StreamVideoFlex" >
                        {videos.map((video) => (
                            <div key={video.socketId}>

                                
                                <video
                                    data-socket={video.socketId}
                                    ref={ref => {
                                        if (ref && video.stream) {
                                            ref.srcObject = video.stream;
                                        }
                                    }}
                                    autoPlay
                                >
                                </video>
                               

                            </div>

                        ))}
                    </div>
              }
                    </div>

<div className="all-btn">
<div>
<IconButton onClick={hendleVideo} >
    {video == true ?<VideocamIcon style={{color:"white",fontSize:"3.4rem"}}/>:<VideocamOffIcon style={{fontSize:"3.4rem"}}/>}
</IconButton>

<IconButton onClick={hendleCallEnd}>
    <CallEndIcon style={{color:"white",fontSize:"3.4rem"}}/>
</IconButton>

<IconButton onClick={hendleAudio}>
    {audio == true? <MicIcon style={{color:"white",fontSize:"3rem"}}/> :<MicOffIcon style={{fontSize:"3rem"}}/> }
</IconButton>

<IconButton onClick={hendleScreen}>
    {screen == true ? <ScreenShareIcon style={{color:"white",fontSize:"2.7rem"}}/> : <StopScreenShareIcon style={{fontSize:"2.7rem"}}/>}
</IconButton>

<IconButton onClick={hendleModel}>
    <ChatIcon  style={{color:"white",fontSize:"2.7rem"}}/>
</IconButton>

</div>
</div>
    </div>

     }
    

     </div>


)  

}