import mongoose from "mongoose";

const messageSchem = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    receiverId :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    text:{
        type:String,
        
    },
    seen:{
        type:Boolean,
        default:false
    },
},{timestamps:true});

const Message = mongoose.model("Message",messageSchem);
export default Message;