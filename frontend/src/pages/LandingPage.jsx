import { Outlet, Link } from "react-router-dom";

export default function LandingPage(){
    return(
        <div className="LandingPageContainer">
<navbar>
    <div className="LandingPageNavbar">

<div className="LandingPageLeftComponent"> 
    <h2 style={{padding:"o"}} >Apna Video Call</h2> 
</div>

<div> 
    <div className="LandingPageRightComponent">
        <Link style={{textDecoration:'none'}} to={'/gest'}>
         <p>join as Guest</p>
        </Link>
     <Link style={{textDecoration:'none'}} to={'/signup'} >
     <p>
       Register
      </p>
      </Link>

      
      <Link style={{textDecoration:'none'}} to={"/login"}>
     <div role="button" className="LandingPageNavbarLogin"> Login</div>
     </Link>
    </div>
    
</div>
    </div>
</navbar>
 
<div className="LandingPageMain">
 <div className="LandingPageLeftContent">
  <div> <span>Connect</span> With your </div>
  <div> Loved Ones</div>
    <p> Cover a distance by apna video call </p>
    <Link style={{textDecoration:'none'}} to={"/home"}>
     <h3 className="LandingPageGetStart"> Get Started</h3>
     </Link>
 </div>
<div> 
    <img src="mobile.png" alt="" />
</div>

 <div>
 </div>
</div>
        </div>
    )
}