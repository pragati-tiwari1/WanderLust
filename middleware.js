let Listing = require("./models/listing.js")
const ExpressError = require("./utils/ExpressError.js")
const { listingSchema, reviewSchema  } = require("./schema.js")
let Review = require("./models/review.js")

module.exports.isLoggedIn = (req,res,next) =>{
  
    if(!req.isAuthenticated()){
        //redirect url after login save
        req.session.redirectUrl = req.originalUrl
        req.flash("error","You must be logged in to create listing !")
       return res.redirect("/login")
       }
       next()
}

//this is used to redirect to the page we are going to access before logged in as passport reset the value of req.session after login

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next()
}


// //server side validation of listing function passed as middleware
// //this function is also passed with create route
module.exports.validateListing = (req,res,next) =>{
    let {error} =   listingSchema.validate(req.body) ; //acc to req.body parameters we will check in schema.js(joi) ,whether the req.body satify all conditions or not
      
      if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg)
      }else{
        next()
      }
}

module.exports.validateReview = (req,res,next) =>{
    let {error} =   reviewSchema.validate(req.body) ; //acc to req.body parameters we will check in schema.js(joi) ,whether the req.body satify all conditions or not
      
      if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg)
      }else{
        next()
      }
  }

//Authorization

module.exports.isOwner =async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id)
    if( !listing.owner.equals(res.locals.currUser._id)){
      req.flash("error","You are not the owner of this listing")
     return  res.redirect(`/listings/${id}`)
    }
    next()

}

module.exports.isReviewAuthor =async (req,res,next)=>{
  let {id , reviewId} = req.params;
  let review = await Review.findById(reviewId)
  if( !review.author.equals(res.locals.currUser._id)){
    req.flash("error","You are not the owner of this review")
   return  res.redirect(`/listings/${id}`)
  }
  next()

}