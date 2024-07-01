if(process.env.NODE_ENV != "production"){
    require("dotenv").config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError.js")
const session = require("express-session")
const MongoStore = require('connect-mongo');  //for storing sessions permanently using mongoDB sessions ,use npm i connect-mongo
const flash  = require("connect-flash")
const listingsRouter = require("./routes/listing.js")
const reviewsRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")

const dbUrl = process.env.ATLASDB_URL


app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname,"/public")))


app.engine("ejs",ejsMate);




main().then(() =>{
    console.log("connected to db")
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);

}

const store = MongoStore.create({//sessiom
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
})

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err)
})

const sessionOptions = {
    store,
    secret :  process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7*24*60*60*1000 ,//these are milisecound,means after how many days the cookie will,expire
        //get expired after 7 days(7*24*60*60*1000) from current milisecond(Date.now())
        maxAge : 7*24*60*60*1000,
        httpOnly : true
    }
}
// app.get("/",(req,res)=>{
//     res.send("listening")
// })



//inko routes likhne se pehle use krna hoga
app.use(session(sessionOptions))
app.use(flash())


//INITIALIZE PASSPORT AS A MIIDLEWARE
//pbkdf2 hashing algo is used in passport

app.use(passport.initialize())
app.use(passport.session())
// use static authenticate method of model(User) in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()))
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//https://www.npmjs.com/package/passport-local-mongoose


//middleware for using flash
app.use((req,res,next)=>{
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user
    next()
})


app.get("/demouser",async(req,res)=>{
 let fakeUser = new User({
    email : "gjdaj@",
    username : "student"
 })
 //register(user, password, cb) Convenience method to register
 // a new user instance with a 
 //given password. Checks if username is unique
 let reg =  await User.register(fakeUser,"helloworld")
 res.send(reg)
})


app.use("/listings",listingsRouter)
app.use("/listings/:id/reviews",reviewsRouter)
app.use("/",userRouter)



//remaining all routes
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"))
})

//ERROR HANDLING MIDDLEWARE
app.use((err,req,res,next)=>{
    let {statusCode = 500,message} = err;
    res.status(statusCode).render("error.ejs",{err})
   
})

app.listen(8080, () =>{
    console.log("listening");
});
