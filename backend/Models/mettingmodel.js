import mongoose, { Schema, Types } from "mongoose";

let mettingSchema = new Schema({
    user_id:{
        type:String,
    },
     mettingCode:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default: Date.now,
        required:true
    },
     username:{
        type: String,
       required:true,
    }
})

let mettingModel = mongoose.model("metting",mettingSchema);
export default mettingModel;