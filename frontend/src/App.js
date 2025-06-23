
import {Route,BrowserRouter as Router, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import CreateAccount from './pages/CreateAccount';
import VideoMeetComponent from './pages/VideoMeet';
import Home from './pages/Home';
import GestPage from './pages/GestPage';
 import History from './pages/History';
export default function App(){
    return(
      <div className='App'>

<Router>

<Routes>
   <Route path='/' element={<LandingPage/>} />
         <Route path='/home' element={<Home/>}/>
     <Route path='/login' element={<LoginPage/>} />
    <Route path='/signup' element={<CreateAccount/>}/>
    <Route path='/:url' element={<VideoMeetComponent/>}/>
                 <Route path='/gest' element={<GestPage/>}/>
                 <Route path='/history' element={<History/>} />
</Routes>

</Router>
      </div>
      
    )
}