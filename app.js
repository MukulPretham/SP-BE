import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { User } from "./models/User.js"
import bcrypt from "bcrypt";
import session from "express-session";
import MongoStore from "connect-mongo";

let app = express();
app.use(express.static("public"));
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure session middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET, // Store this securely
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URL, // Store sessions in MongoDB
        }),
        cookie: { maxAge: 1000 * 60 * 60 }, // 1-hour session
    })
);


mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("database connected");
})

//Middleware to check authosization.
let auth = (req, res, next) => {
    if (!req.session.user) {
        return res.send("unauthorised access");
    }
    next();
}


//SignUp route.
app.post("/users", async (req, res) => {
    //check for existing username.
    let exist = await User.findOne({ username: req.body.username });
    if (exist) {
        return res.send("User already exists");
    }
    let hasshedPassword = await bcrypt.hash(req.body.password, 10);
    let user = new User({
        username: req.body.username,
        password: hasshedPassword
    })
    await user.save();
    res.redirect("/login.html");
})

//login route
app.post("/login", async (req, res) => {
    let currUser = await User.findOne({ username: req.body.username });
    if (!currUser) {
        return res.send("username does'nt exist");
    }
    let isMatch = await bcrypt.compare(req.body.password, currUser.password);

    if (!isMatch) {
        return res.send("Invalid password");
    }
    //sessions setup
    req.session.user = { userID: currUser._id, username: currUser.username }

    res.sendFile(path.resolve("views/main.html"));
})

//logOut route
app.get("/logOut", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log("Error destroying session:", err);
            return res.status(500).send("Error logging out");
        }
        res.redirect("/");
    })
})

app.get("/main.html", auth, (req, res) => {
    res.sendFile(path.resolve("/views/main.html"));
});

app.listen(3000, () => {
    console.log("server is active");
})