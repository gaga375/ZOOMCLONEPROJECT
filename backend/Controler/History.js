import User from '../Models/mettingmodel.js'
import { json } from 'express';
let  fetchHistory = async (req,res)=>{
     let {username} = req.body
    let responce = await User.find({username:username})
 return res.json(responce)
}


export {fetchHistory};