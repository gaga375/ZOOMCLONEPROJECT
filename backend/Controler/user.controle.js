import user from '../Models/usermodel.js';
import httpStatus from 'http-status';
import bcrypt, {hash} from 'bcrypt';
import e, { json } from 'express';
import crypto from 'crypto';
import metting from '../Models/mettingmodel.js';
import { deflateRaw } from 'zlib';


const signup = async (req, res)=>{
    let {name,username,password} = req.body; 
    try{
        const existUser = await user.findOne({username});
  if( existUser){
return res.status(httpStatus.FOUND).json({ success: false, message:"username allredy exist try outher username"})
  }

  const hashPassword = await bcrypt.hash(password,10)
  let newuser = user({
    name:name,
    username:username,
    password:hashPassword
  })
  await newuser.save()
   return res.status(httpStatus.CREATED).json({ success:true , message: " user registered sucessfully"})}
    catch(e){
   return res.json({ success: false,message:`something went rong ${e}`})
    }
}



const login = async (req,res)=>{
    let {username,password} = req.body;


    try{
 if(!username || !password){
    return  res.json({ success: false,message:"please fill currect data"})
 }

 let existUser = await user.findOne({username});
 if(!existUser){
    return  res.status(httpStatus.NOT_FOUND).json({ success: false,message:'user not found'})
 }
 let isauth = await bcrypt.compare(password,existUser.password)
if(! isauth){
    return  res.status(httpStatus.NOT_FOUND).json({  success: false,message:"wrong passwoed please enter currect password"})
}

let token = crypto.randomBytes(20).toString('hex')
existUser.token = token;
existUser.save();
return res.status(httpStatus.OK).json({ success:true ,token:token, message:'sucesssully login'})}
    catch (e){
return res.json({ success: false,message:`something went rong ${e}`})
    }
}

let getUserHistory = async(req,res)=>{
    const {token} = req.body;
    try{
   const User = await user.find({token:token});
   
   res.json(User)
    }
    catch(e){
 res.json({message:`something went wrong ${e}}`})
    }
}

const addToHistory = async(req,res)=>{
const {token ,mettingCode,Username} = req.body;

try{
const User = await user.find({token:token});

const newMeeting = new metting({
    user_id:User.username,
    mettingCode: mettingCode,
    username:Username
})
await newMeeting.save()

res.status(httpStatus.CREATED).json({message:'Added code to history'})
}
catch(e){
      res.json({ message: `Something went wrong ${e}` })
}
}
export {signup,login,getUserHistory,addToHistory}
