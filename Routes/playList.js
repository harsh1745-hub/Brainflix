import express from 'express'
import { createPlaylist,getAllPlaylist,getPlayListById,deletePlaylist } from '../Controllers/playlistController.js'

const router=express.Router();

router.post('/',createPlaylist)
router.post('/getplaylist',getAllPlaylist)
router.post('/playlisy/:id',getPlayListById)
router.post('/:id',deletePlaylist)

export default router;