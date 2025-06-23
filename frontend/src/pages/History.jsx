import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import WithAuth from "../utils/AuthGard";
import axios from "axios";

 function History(){
let [meetingData,setMeetingData] = useState([])


useEffect(()=>{
    let fetchHistory = async ()=>{

let MainUsername;
try{
    const response = await axios.post('https://zoomcloneproject.onrender.com/user/gte_all_addactivity',{
   token: localStorage.getItem("token")
})
 MainUsername = response.data[0].username
}
catch(e){
    console.log(e)
}
let res2 = await axios.post('https://zoomcloneproject.onrender.com/user/history',{
    username:MainUsername
})

const formattedData = res2.data.map(item => ({
        username: item.username,
        mettingCode: item.mettingCode,
        date: new Date(item.date).toLocaleDateString()
      }));
      setMeetingData(formattedData);
    }

    fetchHistory()

},[])



    return(

      <div className="History-container">

  <header className="headerMain">
   <div className="flex">
    <Link  style={{textDecoration:'none'}} to={'/'} >
    <div className="headerleftcomponent">Apna Video Call</div>
    </Link>
     <div style={{marginRight:"1rem"}}>

        <div className="flex2 headerrightcomponent">
         <Link style={{textDecoration:'none'}} to={'/home'} >
        <div className="hedaerRightComponentHover"> connect</div>
       </Link>
        
         </div>
     </div>
</div>
     </header>

{
   ! meetingData.length  == 0 ? 
   <div>
   
   {
    meetingData.map((item,idx)=>{
        return(
            <div className="history-Card" key={idx}>
                <p><i style={{fontSize:"1.3rem",fontWeight:"550"}}> username : </i> {item.username}  </p>
                <p> <i style={{fontSize:"1.2rem"}}>meeting code :</i> { item.mettingCode}</p>
                <p> <i style={{fontSize:"1.2rem"}}>Date :</i> { item.date}</p>
                </div>
        )
    })
   }

    </div>
   
   : <><h1>no data found</h1></>
}

      </div>

    )
}

export default WithAuth(History);