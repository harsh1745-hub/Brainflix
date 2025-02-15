
import saveNotes from "../Models/saveNotes.js";

export const notesave=async(req,res)=>{
    try {
        const { videoId, notes } = req.body;
        if (!videoId || !notes.length) return res.status(400).json({ error: "Invalid data." });
    
        const newNote = new saveNotes({ videoId, notes });
        await newNote.save();
        res.status(201).json({ message: "Notes saved successfully." });
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
      }
    };

    export const getNotes=async(req,res)=>{
          try {
               const{videoId}=req.params;
               const notes=await saveNotes.findOne({videoId});
                 if(!notes){
                     res.status(400).json({message:"no notes found"});
                     res.json(notes);
                 }
            
          } catch (error) {
               res.status(500).json({message:"Internal server error",error});
            
          }
    }
