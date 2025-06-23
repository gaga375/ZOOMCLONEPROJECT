import Modal from '@mui/material/Modal';
import WithAuth from '../utils/AuthGard'
import { useNavigate,Link } from "react-router-dom"
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';
import axios from "axios";

 function Home (){
      let navigate = useNavigate();
let [meetingCODE ,setMeetingCODE] = useState('')

 let handleJoin = async ()=>{
  if(meetingCODE.length >= 6 ){
    navigate(`/${meetingCODE}`)
    localStorage.setItem('meetingCODE',meetingCODE)
  }
else{
  alert('meeting code min. 6 character')
}

}

let handlelogout = async ()=>{
  await localStorage.removeItem('token')
  console.log("logout sucess")
}

    return (
      <div className="HomeComponentContainer">
     <header className="headerMain">
   <div className="flex">
    <div className="headerleftcomponent">Apna Video Call</div>
     <div style={{marginRight:"1rem"}}>

        <div className="flex2 headerrightcomponent">
         <Link style={{textDecoration:'none'}} to={'/history'} >
        <div className="hedaerRightComponentHover"><i className="fa-solid fa-clock-rotate-left"></i> History</div>
       </Link>
        <div onClick={handlelogout} className="hedaerRightComponentHover"> Logout</div>
         </div>
     </div>
</div>
     </header>

<div className="flex2">

 <div className="HomeBody">
    
    <p className="HomeBody-p">Providing Qualint Video Call Just Like Quality Education</p>
    
     <div className="HomeBodyTextFeld">
                            <TextField id="outlined-basic" onChange={e =>setMeetingCODE(e.target.value)} value={meetingCODE} label="Metting Code"  variant="outlined" />
                    <Button onClick={handleJoin} variant="contained" >join</Button>
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

export default WithAuth(Home)