import mongoose from "mongoose";

let userScheme = new mongoose.Schema({
    username: String,
    password: String
})

export let User = mongoose.model("users",userScheme);