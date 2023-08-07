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
app.get("/", (req, res) => {
    res.send("hello, hello");
});

// CHEESE INDEX ROUTE
app.get("/cheeses", async (req, res) => {
    try {
        // send all cheese
        res.json(await Cheeses.find({}));
    } catch (error) {
        // send error
        res.status=(400).json(error);
    }
});

// Cheese CREATE ROUTE
app.post("/cheeses", async (req, res) => {
    try {
        // send all cheese
        res.json(await Cheeses.create(req.body));
    } catch (error) {
        // send error
        res.status(400).json(error);
    }
});

// Cheese UPDATE - PUT  /cheese/:id - update
app.put("/cheeses/:id", async (req, res) => {
    try {
        // update cheese
        const cheeses = await
        Cheeses.findByIdAndUpdate(req.params.id, req.body, 
            {
                new: true
        });
        // send the updated cheese as json
                res.json(cheeses);
        } catch (error) {
            res.status(400).json({error});
        }
    })

// DELETE ROUTE
app.delete("/cheeses/:id", async (req, res) => {
    try {
        // delete the cheese
        const cheeses = await Cheeses.findByIdAndDelete(req.params.id)
        // send delayed cheese as json
        res.status(204).json(cheeses)
    } catch (error) {
        res.status(400).json({error});
    }
});



// LISTENER ////////////
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));