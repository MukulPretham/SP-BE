import express from "express";
import path from "path";
let router = express.Router();

router.get("/",(req,res)=>{
    res.sendFile(path.resolve("/views/main.html"));
})

router.get("/playlists",(req,res)=>{
    res.sendFile(path.resolve("views/playlist.html"));
})

export default router;