const express = require("express");
const router = express.Router()
const User = require("../models/user.js")
const wrapAsync = require("../utils/wrapAsync")
const passport = require("passport")
const { saveRedirectUrl} = require("../middleware.js")

const userController = require("../controllers/user.js")

//SIGNUP 

router.route("/signup")
.get(userController.renderSignup)
.post(wrapAsync(userController.doSignup))


// router.get("/signup",userController.renderSignup)

// router.post("/signup",wrapAsync(userController.doSignup))


//LOGIN (IF USER IS ALREADY REGISTERED)

router.route("/login")
.get(userController.renderLogin)
.post(saveRedirectUrl,
passport.authenticate("local",{failureRedirect : "/login",failureFlash : true}),
userController.login)
//passport.authenticate->used to authenticate requests and is a middleware



// router.get("/login",userController.renderLogin)
// router.post("/login",saveRedirectUrl,
// passport.authenticate("local",{failureRedirect : "/login",failureFlash : true}),
// userController.login)


//LOGOUT
router.get("/logout",userController.logout)

module.exports = router
