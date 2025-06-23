import mongoose, { Schema, Types } from "mongoose";

let userSchema = new Schema({
    name:{
        type: String,
        required:true,
    },
    username:{
        type: String,
       required:true,
       unique:true
    },
    password:{
       type: String,
        required:true,
    },
      token:{
         type: String,
    },
})

const user = mongoose.model("user",userSchema);
export default user;
