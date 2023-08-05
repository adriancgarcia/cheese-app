///////////////////////////////////
// DEPENDENCIES
/////////////////////////////////// 
// get .env variables
require("dotenv").config();
// pull port from .env, give value of 8000
const DATABASE_URL = process.env.DATABASE_URL
const { PORT = 8000 } = process.env;
// import express
const express = require('express');
// create application object
const app = express();
// import mongoose
const mongoose = require("mongoose");
// IMPORT MIDDLEWARE
const cors = require("cors")
const morgan = require("morgan")

///////////////////////////////////////// 
// DATABASE CONNECTION /////////////////
// Establish a connection
mongoose.connect(DATABASE_URL,  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

// Connection Events
mongoose.connection
.on("open", () => console.log("You are connected to Mongoose"))
.on("close", () => console.log("You are disconnected from mongoose"))
.on("error", (error) => console.log(error));

///////////////////////////////////////// 
// MODELS /////////////////
//////////////////////////////
const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String, 
    image: String,
});

const Cheese = mongoose.model("Cheese", CheeseSchema);

///////////////////////////////////////// 
// MIDDLEWARE /////////////////
//////////////////////////////
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies

// ROUTES //////////
// create test route
app.get("/", (req, res) => {
    res.send("hello, hello");
});

// CHEESE INDEX ROUTE
app.get("/cheese", async (req, res) => {
    try {
        // send all cheese
        res.json(await Cheese.find({}));
    } catch (error) {
        // send error
        res.status=(400).json(error);
    }
});

// Cheese CREATE ROUTE
app.post("/cheese", async (req, res) => {
    try {
        // send all cheese
        res.json(await Cheese.create(req.body));
    } catch (error) {
        // send error
        res.status(400).json(error);
    }
});

// Cheese UPDATE - PUT  /cheese/:id - update
app.put("/cheese/:id", async (req, res) => {
    try {
        // update cheese
        const cheese = await
        Cheese.findByIdAndUpdate(req.params.id, req.body, 
            {
                new: true
        });
        // send the updated cheese as json
                res.json(cheese);
        } catch (error) {
            res.status(400).json({error});
        }
    })

// DELETE ROUTE
app.delete("/cheese/:id", async (req, res) => {
    try {
        // delete the cheese
        const cheese = await Cheese.findByIdAndDelete(req.params.id)
        // send delayed cheese as json
        res.status(204).json(cheese)
    } catch (error) {
        res.status(400).json({error});
    }
});








// LISTENER ////////////
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));