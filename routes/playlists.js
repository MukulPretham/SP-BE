import express from "express";
let router = express.Router();

router.get("/",(req,res)=>{
    res.send("PlayLists");
})

export default router;