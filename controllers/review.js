const Review = require("../models/review.js")
const Listing = require("../models/listing.js")

module.exports.postReview = async(req,res)=>{
    
    let listing =  await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review)
  
    listing.reviews.push(newReview)
    newReview.author = req.user._id
   
    await newReview.save()
    await listing.save()
    req.flash("success","Review Added Successfully !")

    console.log("saved")
    res.redirect(`/listings/${listing._id}`)
  }


module.exports.deleteReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull : { reviews : reviewId}})
    await  Review.findByIdAndDelete(reviewId)
   
    req.flash("success","Review Deleted Successfully !")
    res.redirect(`/listings/${id}`)
   }