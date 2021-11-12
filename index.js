const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rf3gx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        console.log('Database Connected Successfully')
        const database = client.db('angelBaby');
        const productCollection = database.collection('products');
        const userCollection = database.collection('users')
        const reviewCollection=database.collection('reviews')
        // Get Api
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products)
        })
        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews)
        })
        // app.get('/users', async (req,res)=>{
        //     const cursor=userCollection.find({});
        //     const users=await cursor.toArray();
        //     res.send(users)
        // })
        app.get('/users', async (req, res) => {
            let query = {}
            const email = req.query.email;
            if (email) {
                query = { email: email }
                const cursor = userCollection.find(query);
                const users = await cursor.toArray();
                res.send(users)
            }
            const cursor = userCollection.find({});
            const users = await cursor.toArray();
            res.send(users)

        })
        app.get('/products/:productId', async (req, res) => {
            const id = req.params.productId;
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.json(product)


        })
        //  post API
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.json(result);
        })
        app.post('/products', async (req, res) => {
            const product = req.body;
               const result = await productCollection.insertOne(product);
               res.json(result);})
        app.post('/reviews', async (req, res) => {
            const review = req.body;
               const result = await reviewCollection.insertOne(review);
               res.json(result);})

        // Delete API
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query);
            res.json(result)
        })
        // Update API
           app.put('/users/admin', async (req,res)=>{
            const user=req.body;
            const filter={email:user.email};
            const updateDoc={$set:{role:'admin'}}
            const result= await userCollection.updateOne(filter,updateDoc);
            res.json(result)
        })
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
           
           
            
                const updateUser = req.body;
                const filter = { _id: ObjectId(id) };
                const options = { upsert: true };
                const updateDoc = {
                    $set: {
                        status: updateUser.status = "Shipped"
                    },
                };
                const result = await userCollection.updateOne(filter, updateDoc, options);
                res.send(result)
    

            
           
           
        })
     


    }

    finally {

    }



}
run().catch(console.dir)
app.get('/', (req, res) => {
    res.send('Running Angel wonderfully')
});
app.listen(port, () => {
    console.log('Running volunteer network on port', port)
})