const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hmtao.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const craftCollection = client.db('craftDB').collection('crafts');
    const usersCollection = client.db('craftDB').collection('users');


    app.get('/crafts', async (req, res) => {
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/crafts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.findOne(query);
      console.log(result);
      res.send(result);
    })

    app.post('/crafts', async (req, res) => {
      const newItem = req.body;
      const result = await craftCollection.insertOne(newItem);
      res.send(result);
    })

   
    //apis for user
    app.get('/users', async (req, res) => {
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/users/:email', async (req, res) => {
      console.log(req.params.email);
      const cursor = craftCollection.find({ email: req.params.email});
      const result = await cursor.toArray();
      res.send(result);
      console.log(result);
    })
    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await craftCollection.insertOne(user);
      res.send(result);
    })

    app.put('/crafts/:id', async(req, res) => {
       const id = req.params.id;
       const filter = { _id: new ObjectId(id) };
       const options = { upsert: true };
       const updatedCraft = req.body;
       const craft = {
           $set: {
            itemName: updatedCraft.itemName, 
            image: updatedCraft.image, 
            subcategory: updatedCraft.subcategory, 
            customization: updatedCraft.customization, 
            price: updatedCraft.price, 
            rating: updatedCraft.rating, 
            processTime: updatedCraft.processTime, 
            stockStatus: updatedCraft.stockStatus, 
            description: updatedCraft.description
           }
       }

       const result = await craftCollection.updateOne(filter, craft, options);
       res.send(result);
    })
     app.delete('/crafts/:id', async(req, res) => {
       const id = req.params.id;
       const query = { _id: new ObjectId(id) };
       const result = await craftCollection.deleteOne(query);
       res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}

run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Focus Art & Craft is running')
})

app.listen(port, () => {
  console.log(`Focus Art & Craft is running on port: ${port}`);
})