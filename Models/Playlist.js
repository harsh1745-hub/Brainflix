import mongoose, { Mongoose } from "mongoose";


const playlistSchema=new mongoose.Schema({
     name:{
        type:String,
        required:true,

     },
     descriptions:{
        type:String,
        required:true,
     },
     video:[{
        videoId:{type:String,required:true},
        title:{type:String,required:true},
        url:{type:String,required:true}

     }],

},{timestamps:true})

export default mongoose.model('playlist',playlistSchema);