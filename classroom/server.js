const express = require("express");
const app = express();
//const cookieParser = require("cookie-parser")
const session = require("express-session")
const flash = require("connect-flash")
const path = require("path")


app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))

app.use(session({secret:"mysupersecretstring",
    resave:false,
    saveUninitialized : true }))

app.use(flash())

app.use((req,res,next)=>{
    res.locals.success = req.flash("success")
    res.locals.vrindavan = req.flash("vrindavan")
    next()
})

app.get("/register",(req,res)=>{
    let {name = "radhe"} = req.query
    req.session.name = name
    
    if(name === "radhe"){
        req.flash("vrindavan","radhe radhe")
    }
    else{
        req.flash("success","user registered")
    }
    res.redirect("/hello")
})

app.get("/hello",(req,res)=>{
    
    res.render("page.ejs",{ name : req.session.name
          })
})

// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++
//     }else{
//         req.session.count = 1
//     }
//     res.send(`you sent req ${req.session.count} times`)
// })

// app.get("/test",(req,res)=>{
//     res.send("test successful")
// })

//app.use(cookieParser("secretcode"))

// app.get("/getsigned",(req,res)=>{
//     res.cookie("made-in","India",{signed:true})
//     res.send("signed")
// })

// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies)
//     res.send("verified")
// })

// app.get("/greet",(req,res)=>{
//     let {name = "an"} = req.cookies
//     res.send(`hi,${name}`)
// })

// //cookie
// app.get("/get",(req,res)=>{
//     res.cookie("greet","namaste")
//     res.send("cookie")
// })

// app.get("/",(req,res)=>{
//     console.dir(req.cookies)
//     res.send("listening")
// })


app.listen(3000, () =>{
    console.log("listening");
});
