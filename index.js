const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()


const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// connet uri

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4mu7n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
      await client.connect();
      const database = client.db("touristagency");
      const tourordersCollection = database.collection("tourorders");

      const bookingusersCollection = database.collection("bookingusers");
    
    // get API
    app.get('/tourorders', async(req, res) =>{
        const cursor = tourordersCollection.find({});
        const tourorders = await cursor.toArray();
        res.json(tourorders);
    });

    // get single API
    app.get('/tourorders/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const tourorder = await tourordersCollection.findOne(query);
        res.json(tourorder);
    })


    // post API
    app.post('/tourorders', async(req, res) =>{
        const tourorders = req.body;
        console.log('hit the post api', tourorders)
        
    const result = await tourordersCollection.insertOne(tourorders);
    res.send(result);
    // res.send('post hited')
    })


    // get booking API
    app.get('/bookingusers', async(req, res) =>{
        const cursor = bookingusersCollection.find({});
        const bookingusers = await cursor.toArray();
        res.json(bookingusers);
    });

    // get my tour api
    app.get('/bookingusers/:email', async (req, res) => {
        const cursor = bookingusersCollection.find({email: req.params.email});
        const bookingusers = await cursor.toArray();
        res.json(bookingusers);
    })

    // bookingusers post api
    app.post('/bookingusers', async(req, res) =>{
        const bookingusers = req.body;
        console.log('hit the booking api', bookingusers)
        const result = await bookingusersCollection.insertOne(bookingusers);
        res.send(result);
    })


    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);



app.get('/', (req, res) =>{
    res.send('Running My ABS Tourist Agency server');
});


app.listen(port, ()=>{
   console.log('Running Server on Port', port);
})
