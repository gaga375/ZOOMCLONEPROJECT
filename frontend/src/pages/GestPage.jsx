import Modal from '@mui/material/Modal';
import WithAuth from '../utils/AuthGard'
import { useNavigate,Link } from "react-router-dom"
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';
import axios from "axios";

export default function GestPage (){

  let navigate = useNavigate();
let [meetingCODE ,setMeetingCODE] = useState('')

 let handleJoin = async ()=>{
  if(meetingCODE.length >= 6 ){
    navigate(`/${meetingCODE}`)
  }
else{
  alert('meeting code min. 6 character')
}

}

    return(
          <div className="HomeComponentContainer">
             <header className="headerMain">
           <div className="flex">
            <Link style={{textDecoration:'none'}} to={'/'}>
            <div className="headerleftcomponent">Apna Video Call</div>
              </Link>
             <div style={{marginRight:"1rem"}}>
        
                <div className="flex2 headerrightcomponent">
                 </div>
             </div>
        </div>
             </header>
        
        <div className="flex2">
        
         <div className="HomeBody">
            
            <p style={{paddingLeft:"3.4rem",fontSize:"1.4rem"}}>Providing Qualint Video Call Just Like Quality Education</p>
            
             <div className="HomeBodyTextFeld">
                                       <TextField id="outlined-basic" onChange={e =>setMeetingCODE(e.target.value)} value={meetingCODE} label="Metting Code"  variant="outlined" />
                            <Button variant="contained" onClick={handleJoin} >join</Button>
                                </div>
             </div>
        
        
           <div className="HomeBody2"> 
            <div className="HomeBodyImg">
        <img src="logo3.png" alt="" />
        </div>
          </div>
        </div>
        
        
        
              </div>
    )
}