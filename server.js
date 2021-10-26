///////////////////////////////////
// Import our Dependencies
///////////////////////////////////
require("dotenv").config() // brings in .env vars
const express = require("express") // web framework
const morgan = require("morgan") // logger
const methodOverride = require("method-override") // to swap request methods
const path = require("path") // helper functions for file paths
const FruitsRouter = require("./controllers/fruit")
const UserRouter = require("./controllers/user")
const session = require("express-session") // session middleware
const MongoStore = require("connect-mongo") // save sessions in mongo




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
// middlware to create sessions (req.session)
app.use(session({
    secret: process.env.SECRET,
    store: MongoStore.create({mongoUrl: process.env.DATABASE_URL}),
    resave: false
}))

/////////////////////////////////
// Routes
/////////////////////////////////


app.get("/", (req, res) => {
    res.render("index.liquid")
})

// Register Fruits Router
app.use("/fruits", FruitsRouter)

// Register User Router
app.use("/user", UserRouter)

//////////////////////////////////
// Setup server listener
//////////////////////////////////

const PORT = process.env.PORT; // grabs port # from env
app.listen(PORT, () => console.log(`Now Listening on port ${PORT}`));