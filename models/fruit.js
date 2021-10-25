////////////////////////
// import dependencies
////////////////////////
//import the existing connected mongoose object from connection.js
const mongoose = require("./connection")


////////////////////////////
// Create our fruits model
///////////////////////////

// destructuring Schema and model from mongoose

const {Schema, model} = mongoose 

// make a fruits schema
const fruitSchema = new Schema ({
    name: String,
    color: String,
    readyToEat: Boolean
})


// Make a fruit model 

const Fruit = model("Fruit", fruitSchema)

// log the model to make sure it exists 
// console.log(Fruit)

////////////////////////////////
// export the fruit model
///////////////////////////////

module.exports = Fruit