////////////////////////
// import dependencies
////////////////////////
//import the existing connected mongoose object from connection.js
const mongoose = require("./connection")


////////////////////////////
// Create our User model
///////////////////////////

// destructuring Schema and model from mongoose

const {Schema, model} = mongoose 

// make a User schema
const userSchema = new Schema ({
   username: {type: String, required: true, unique: true},
   password: {type: String, required: true}
})


// Make a User model 

const User = model("User", userSchema)

// log the model to make sure it exists 
// console.log(User)

////////////////////////////////
// export the User model
///////////////////////////////

module.exports = User