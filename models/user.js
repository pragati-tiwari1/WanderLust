const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose")
//You're free to define your User how you like.
// Passport-Local Mongoose will add a username, hash and salt field to store the username, the hashed password and the salt value.
//Passport-Local Mongoose adds some methods to your Schema.


const userSchema = new Schema({
    email :{
        type : String,
        required : true
    }
    //useranme,password will be set automatically

})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);