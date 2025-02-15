import mongoose from "mongoose";

const saveNoteSchema =new mongoose.Schema({
       videoId:{
          type:String,
          required:true
       },
         notes:{
             type:[String],required:true
         },
          createdAt:{type:Date,default:Date.now}
})

export default mongoose.model("Notes",saveNoteSchema);