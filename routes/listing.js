const express = require("express");
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync.js")
const { listingSchema  } = require("../schema.js")
const ExpressError = require("../utils/ExpressError.js")
const Listing = require("../models/listing.js")
const {isLoggedIn ,isOwner , validateListing}= require("../middleware.js")
const listingController = require("../controllers/listing.js")


//MULTER -> Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files. It is written on top of busboy for maximum efficiency.

const multer  = require("multer")
const {storage} = require("../cloudConfig.js")

//so multer will store data in cloudinary storage
const upload = multer({ storage })




// router.route(path)
// Returns an instance of a single route which you can then use to handle HTTP verbs with optional middleware.
// Use router.route() to avoid duplicate route naming and thus typing errors.

 //INDEX ROUTE and //CREATE ROUTE
router.route("/")
.get(wrapAsync(listingController.index)) // if get request comes on "/" then this is triggered
.post(isLoggedIn,
   upload.single("listing[image]"),
   validateListing,
wrapAsync(listingController.createListing));

 // if post request comes on "/" thne post route will be triggered

//NEW ROUTE
router.get("/new",isLoggedIn,wrapAsync(listingController.newFormRender))


//SHOW ROUTE AND UPDATE ROUTE and DELETE ROUTE
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,
   isOwner,
   upload.single("listing[image]"),
   validateListing , 
   wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing ))


   
   
   // //CREATE ROUTE
   // router.post("/",isLoggedIn,validateListing,wrapAsync(listingController.createListing))
   
   //SHOW ROUTE
   // router.get("/:id",wrapAsync(listingController.showListing))
   
   
   //EDIT ROUTE
   router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editForm))
   
   //UPDATE ROUTE
  // router.put("/:id",isLoggedIn,isOwner,validateListing , wrapAsync(listingController.updateListing))
   
   //DELETE ROUTE
   //router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.deleteListing ))

   module.exports  = router;