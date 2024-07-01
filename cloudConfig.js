//cloudinay is a 3rd party service whivh will sabe the file(photo) and will generate a linnk that is going to be saved in MongoDB
//npm i cloudinary(its credentials from its site after login)
//npm i multer-storage-cloudinary
//do this

const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require("multer-storage-cloudinary")


cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET

});


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "wanderlust_DEV",
      allowed_formats: ["png","jpg","jpeg"], // supports promises as well
     
    },
  });

  module.exports = {
    cloudinary,
    storage,
  }