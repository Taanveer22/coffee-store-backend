// ==================Recommended Order=================
// 1. Required by common js (express, cors, etc.)
// 2 .Instance Initialization (const app = express())
// 3. Middleware Setup (cors, json, logging)
// 4. Database Configuration & Connection (MongoDB client setup and runMongoDB() function)
// 5. Routes
// 6. Server Startup (app.listen)
// ===========================================================
// 01
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

// 02
const app = express();
const PORT = process.env.PORT || 5000;

// 03
app.use(cors());
app.use(express.json());

// 04

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.89rnkti.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const database = client.db("sample_coffees_db");
    const coffeesCollection = database.collection("coffees-coll");

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // create coffees
    app.post("/createcoffees", async (req, res) => {
      const createCoffee = req.body;
      // console.log(createCoffee);
      const result = await coffeesCollection.insertOne(createCoffee);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } catch (error) {
    console.log(error);
  }
}
run();

// 05
app.get("/", (req, res) => {
  res.send("server is running");
});

// 06
app.listen(PORT, () => {
  console.log(`the server is running on PORT:  ${PORT}`);
});
