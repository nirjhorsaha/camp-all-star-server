const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.txtczm4.mongodb.net/?retryWrites=true&w=majority`;

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
    // db collection
    const usersCollection = client.db("campUserDB").collection("campUsers");
    const classCollection = client.db("campUserDB").collection("classes");
    const courseCollection = client.db("campUserDB").collection("studentsCourse");

    // Save user email and role in DB
    app.put("/users/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const query = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await usersCollection.updateOne(query, updateDoc, options);
      // console.log(result);
      res.send(result);
    });

    // update class status
    app.put("/classes/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await classCollection.updateOne(query, updateDoc, options);
      // console.log(result);
      res.send(result);
    });

    // get all users
    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    // Get single user
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await usersCollection.findOne(query);
      // console.log(result);
      res.send(result);
    });

    // Save uploaded class in database
    app.post("/class", async (req, res) => {
      const classes = req.body;
      // console.log(classes);
      const result = await classCollection.insertOne(classes);
      res.send(result);
    });

    // Save a single user selected class 
    app.post("/selectedClass", async (req, res) => {
      const selectedClasses = req.body;
      // console.log(classes);
      const result = await courseCollection.insertOne(selectedClasses);
      res.send(result);
    });
    
    // get a single user selected class 
    app.get("/selectedClass", async (req, res) => {
      const result = await courseCollection.find().toArray();
      res.send(result);
    });

    // Get all classes
    app.get("/classes", async (req, res) => {
      const result = await classCollection.find().toArray();
      res.send(result);
    });

    // Get single instructor class information
    app.get("/classes/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await classCollection.findOne(query);
      // console.log(result);
      res.send(result);
    });

    // Get a user info
    app.get("/class/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await usersCollection.findOne(query);
      // console.log(result);
      res.send(result);
    });

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/", (req, res) => {
  res.send("Hello Students...!");
});

app.listen(port, () => {
  console.log(`Summer is running on port ${port}`);
});
