///////////////////////////////////
// Import our Dependencies
///////////////////////////////////
require("dotenv").config() // brings in .env vars
const express = require("express") // web framework
const morgan = require("morgan") // logger
const methodOverride = require("method-override") // to swap request methods
const mongoose = require("mongoose") // our database library
const path = require("path") // helper functions for file paths




////////////////////////////////
// ESTABLISH DB CONNECTION 
////////////////////////////////

//setup the inputs for mongoose connect 
const DATABASE_URL = process.env.DATABASE_URL// url from env
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

// Connect to Mongo
mongoose.connect(DATABASE_URL, CONFIG)

// connection to Mongo messages
mongoose.connection
.on("open", ()=> console.log("Connected to Mongo"))
.on("close", () => console.log("disconnected from mongo"))
.on("error", (error) => console.log(error))

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

///////////////////////////////////////////////
// Create our app with object, configure liquid
////////////////////////////////////////////////

//import liquid
const liquid = require("liquid-express-views")
// construct an absolute path to our views folder
const viewsFolder = path.resolve(__dirname, "views/")
// console.log(viewsFolder)

//create an app object with liquid, passing the path to the views folder

const app = liquid(express(), {root: viewsFolder})

// console.log app to confirm it exists
console.log(app)

/////////////////////////////////
// Register Our Middleware
/////////////////////////////////

app.use(morgan("tiny")); //logging
app.use(methodOverride("_method")); // override for put and delete requests from forms
app.use(express.urlencoded({ extended: true })); // parse urlencoded request bodies
app.use(express.static("public")); // serve files from public statically

/////////////////////////////////
// Routes
/////////////////////////////////


app.get("/", (req, res) => {
    res.send("your server is running.. better catch it")
})

////////////////////////
// Fruits Routes
////////////////////////

//seed route - seed our starter data
app.get("/fruits/seed", (req, res) => {
    // array of starter fruits
    const startFruits = [
        { name: "Orange", color: "orange", readyToEat: false },
        { name: "Grape", color: "purple", readyToEat: false },
        { name: "Banana", color: "orange", readyToEat: false },
        { name: "Strawberry", color: "red", readyToEat: false },
        { name: "Coconut", color: "brown", readyToEat: false },
      ];

    // delete all fruits
    Fruit.deleteMany({})
    .then((data) => {
        // seed the starter fruits
        Fruit.create(startFruits)
        .then((data) => {
            // send created fruits back as JSON
            res.json(data)
        })
    })
})

//index route  get /fruits

app.get("/fruits", (req, res) => {
    // find all the fruits
    Fruit.find({})
      // render a template after they are found
      .then((fruits) => {
        res.render("fruits/index.liquid", { fruits });
      })

      //error handling 

      .catch((error) => {
          res.json({error});
      });

    });

    // new route
app.get("/fruits/new", (req, res) => {
    res.render("fruits/new.liquid");
  });

  // create - post request - /fruits
app.post("/fruits", (req, res) => {

    // convert the checkbox property to true or false
    req.body.readyToEat = req.body.readyToEat === "on" ? true : false

    // create the new fruit
    Fruit.create(req.body)
    .then((fruit) => {
        // redirect the user back to the index route
        res.redirect("/fruits")
    })
    // error handling
    .catch((error) => {
        res.json({error})
    })

})

// edit route - get request - /fruits/:id/edit
app.get("/fruits/:id/edit", (req, res) => {
    // get the id from params
    const id = req.params.id

    // get the fruit with the matching id
    Fruit.findById(id)
    .then((fruit) => {
        // render the edit page template with the fruit data
        res.render("fruits/edit.liquid", { fruit })
    })
    // error handling
    .catch((error) => {
        res.json({error})
    })
})

// update route - put request - "/fruits/:id"
app.put("/fruits/:id", (req, res) => {
    // get the id from params
    const id = req.params.id
    
    // convert the checkbox property to true or false
    req.body.readyToEat = req.body.readyToEat === "on" ? true : false

    // update the item with the matching id
    Fruit.findByIdAndUpdate(id, req.body, {new: true})
    .then((fruit) => {
        // redirect user back to index
        res.redirect("/fruits")
    })
     // error handling
     .catch((error) => {
        res.json({error})
    })
})

//destroy route - delete request -/ fruits/:id

app.delete("/fruits/:id", (req, res)=> {
    // grab the id from params
    const id = req.params.id
    // delete the fruit
    Fruit.findByIdAndRemove(id)
    .then((fruit) => {
        // redirect user back to index
        res.redirect("/fruits")
    })
     // error handling
     .catch((error) => {
        res.json({error})
    })
})
    
    // show route - get - /fruits/:id

    app.get("/fruits/:id", (req, res)=> {
        //get the id from params
        const id = req.params.id

        // get that particular fruit from the database
        Fruit.findById(id)
        .then((fruit) => {
            // render the show template with the fruit
            res.render("fruits/show.liquid", {fruit})
        })
        // error handling
        .catch((error) => {
            res.json({error})
        })
    })
 

//////////////////////////////////
// Setup server listener
//////////////////////////////////

const PORT = process.env.PORT; // grabs port # from env
app.listen(PORT, () => console.log(`Now Listening on port ${PORT}`));