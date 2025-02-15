import express from 'express'
import { getNotes,notesave } from '../Controllers/saveNotecontroller.js'


const router=express.Router();

router.post('/get',getNotes);
router.post('/savenote',notesave)

export default router;