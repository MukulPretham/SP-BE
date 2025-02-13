import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import {User} from "./models/User.js"

let app = express();
app.use(express.static("public"));
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("database connected");
})

//Home routes.
app.get("/",(req,res)=>{
    res.sendFile(path.resolve("views/index.html"));
})

//SignUp route.
app.post("/users",async(req,res)=>{
    let user = new User({
        username: req.body.username,
        password: req.body.password
    })
    await user.save();
    res.redirect("/");
})

//login route
app.post("/login",async(req,res)=>{
    let currUser = await User.findOne({username: req.body.username});
    console.log(currUser.password)
    if(!(req.body.password == currUser.password)){
        return res.send("invalid");
    }else{
        res.redirect("/main.html");
    }
    
})

app.listen(3000,()=>{
    console.log("server is active");
})