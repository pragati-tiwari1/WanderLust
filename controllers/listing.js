const Listing = require("../models/listing.js")
//for geocoding -- refer github https://github.com/mapbox/mapbox-sdk-js/
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({accessToken : mapToken})




module.exports.index = async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings})
   }


module.exports.newFormRender = async(req,res)=>{
    res.render("listings/new.ejs")
 }


 module.exports.createListing = async(req,res,next)=>{
 //map
  let response =  await geocodingClient
 .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send()
      

    //image
        let url = req.file.path;
        let filename  = req.file.filename
       
          const newListing =  new Listing(req.body.listing);
          newListing.owner = req.user._id
          newListing.image = {url , filename}
        //we have created object "listing" in new.ejs"
        //map 
        newListing.geometry = response.body.features[0].geometry
       let saved =  await newListing.save();
       console.log(saved)
        req.flash("success","New Listing Created !")
        res.redirect("/listings")
        
    }



module.exports.showListing = async(req ,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path : "reviews",
     populate : 
     {path : "author"
 }})
    .populate("owner");

    if(!listing){
     req.flash("error","Listing you requested for does not exist")
     res.redirect("/listings")
    }
    console.log(listing)
    res.render("listings/show.ejs",{listing});
}


module.exports.editForm = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
     req.flash("error","Listing you requested for does not exist")
     res.redirect("/listings")
    }
    let ori = listing.image.url 
   ori = ori.replace("/upload","/upload/h_300,w_250")//for showing blur image for preview

    res.render("listings/edit.ejs",{listing,ori})
}

module.exports.updateListing = async(req,res)=>{
      
    let {id} = req.params;
 let listing =  await  Listing.findByIdAndUpdate(id,{...req.body.listing}) ;//it takes listing object from edit.ejs and convert it into object of title,description,etc...and then it is used to update the values
 if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename  = req.file.filename
   listing.image = {url ,filename}
   await listing.save()
 }

 
  req.flash("success","Listing Updated Successfully !")
    res.redirect(`/listings/${id}`)
}


module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);//this will call a delet middleware in listing.js to delete its respective reviews
    req.flash("success","Listing Deleted Successfully !")
    res.redirect("/listings")
}