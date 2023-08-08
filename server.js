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
const CheesesSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String, 
    image: String,
});

const Cheeses = mongoose.model("Cheeses", CheesesSchema);

///////////////////////////////////////// 
// MIDDLEWARE /////////////////
//////////////////////////////
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies

// ROUTES //////////
// create test route
// app.get("/", (req, res) => {
//     res.send("hello, hello");
// });

// CHEESES INDEX ROUTE
app.get("/cheeses", async (req, res) => {
    try {
        // fetch all cheeses from database
        const cheeses = await Cheeses.find({});
        // send json of all cheeses
        res.json(cheeses);
    } catch (error) {
        // send error s JSON
        res.status(400).json({error});
    }
});

// Cheese CREATE ROUTE
app.post("/cheeses", async (req, res) => {
    try {
        // create a new cheese
        const cheese = await
        Cheeses.create(req.body)
        res.json(cheese);
    } 
    catch (error) {
        // send error
        res.status(400).json({error});
    }
});

// SHOW - GET - /cheeses/:id - get a single cheese
app.get("/cheeses/:id", async (req, res) => {
    try {
        // get a cheese from the database
        const cheese = await Cheeses.findById(req.params.id);
        res.json(cheese);
    } catch (error) {
        res.status(400).json({error});
        }
});

// Cheese UPDATE - PUT  /cheese/:id - update
app.put("/cheeses/:id", async (req, res) => {
    try {
        // update cheese
        const cheese = await
        Cheeses.findByIdAndUpdate(req.params.id, req.body, 
            {
            new: true
        });
        // send the updated cheese as json
            res.json(cheese);
        } catch (error) {
            res.status(400).json({error});
        }
    })

// DESTROY - DELETE ROUTE
app.delete("/cheeses/:id", async (req, res) => {
    try {
        // delete the cheese
        const cheese = await Cheeses.findByIdAndDelete(req.params.id)
        // send deleted ed cheese as json
        res.status(204).json(cheese)
    } catch (error) {
        res.status(400).json({error});
    }
});

// LISTENER ////////////
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));