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
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

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
    const usersCollection = database.collection("users-coll");

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // =============================================
    // ===== coffees api route ===========================
    // =============================================

    //===== read operation all coffees(use in routes loader) =====
    app.get("/readCoffees", async (req, res) => {
      const cursor = coffeesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //======= read operation one coffee(use in routes loader) =========
    app.get("/readCoffees/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const result = await coffeesCollection.findOne(query);
      res.send(result);
    });

    //=================== create operation=============================
    app.post("/createCoffees", async (req, res) => {
      const createCoffee = req.body;
      // console.log(createCoffee);
      const result = await coffeesCollection.insertOne(createCoffee);
      res.send(result);
    });

    //=================== update operation=============================
    app.put("/updateCoffees/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const update = {
        $set: {
          name: req.body.name,
          quantity: req.body.quantity,
          supplier: req.body.supplier,
          taste: req.body.taste,
          category: req.body.category,
          details: req.body.details,
          photo: req.body.photo,
        },
      };
      const options = { upsert: true };
      const result = await coffeesCollection.updateOne(query, update, options);
      res.send(result);
    });

    //=================== delete operation=============================
    app.delete("/deleteCoffees/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const result = await coffeesCollection.deleteOne(query);
      res.send(result);
    });

    // =============================================
    // ===== users api route ===========================
    // =============================================

    // ================read operation for users ===================
    app.get("/readUsers", async (req, res) => {
      const readUser = usersCollection.find();
      const result = await readUser.toArray();
      res.send(result);
    });

    // ================create operation for users ===================
    app.post("/createUsers", async (req, res) => {
      const createUser = req.body;
      const result = await usersCollection.insertOne(createUser);
      res.send(result);
    });

    // ================update operation for users ===================
    app.patch("/updateUsers/:email", async (req, res) => {
      const updateUser = { email: req.params.email };
      const updateDoc = {
        $set: {
          lastSignInTime: req.body?.lastSignInTime,
        },
      };
      const result = await usersCollection.updateOne(updateUser, updateDoc);
      res.send(result);
    });

    // ================delete operation for users ===================
    app.delete("/deleteUsers/:id", async (req, res) => {
      const deleteUser = { _id: new ObjectId(req.params.id) };
      const result = await usersCollection.deleteOne(deleteUser);
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
