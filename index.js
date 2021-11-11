const express=require('express');
const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId;
const cors=require('cors');
require('dotenv').config();
const app=express();
const port=process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rf3gx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run(){
    try{
        await client.connect();
    console.log('Database Connected Successfully')
    const database=client.db('angelBaby');
    const productCollection=database.collection('products');
    const userCollection= database.collection('users')
    // Get Api
    app.get('/products', async (req,res)=>{
        const cursor=productCollection.find({});
        const products=await cursor.toArray();
        res.send(products)
    })
     app.get('/products/:productId', async(req,res)=>{
        const id=req.params.productId;
        const query={_id:ObjectId(id)};
        const product=await productCollection.findOne(query);
        res.json(product)
        

    })
    //  post API
    app.post('/users', async (req, res) => {
        const user = req.body;
           const result = await userCollection.insertOne(user);
           res.json(result);})




}
        finally{

        }
    
    
    
    }
run().catch(console.dir)
 app.get('/',(req,res)=>{
     res.send('Running Angel wonderfully')
 });
 app.listen(port,()=>{
     console.log('Running volunteer network on port',port)
 })