const express = require("express");
const router = express.Router({mergeParams:true})
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")

//server side validation of listing
const Review = require("../models/review.js")
const Listing = require("../models/listing.js")
const {isLoggedIn, validateReview , isReviewAuthor }= require("../middleware.js")

const reviewController = require("../controllers/review.js")

//REVIEWS

//POST REVIEW ROUTE
router.post("/",isLoggedIn,validateReview , wrapAsync(reviewController.postReview))
  
  //DELETE REVIEW ROUTE
  router.delete("/:reviewId",isLoggedIn ,isReviewAuthor ,wrapAsync(reviewController.deleteReview))

  module.exports = router