require ('dotenv').config()
const express=require('express')
const mongoose=require('mongoose')
const morgan=require('morgan')
const app=express()
const {PORT=3000, DATABASE_URL}=process.env

mongoose.connect(DATABASE_URL, {
    useUnifiedTopology:true, 
    useNewUrlParser:true
})

mongoose.connection
.on("open", ()=>console.log("connected to mongoose"))
.on("close", ()=>console.log("disconnected to mongoose"))
.on("error", (err)=>console.log(err))

const CheeseSchema=new mongoose.Schema({
    name:String,
    countryOfOrigin: String,
    image: String
})

const Cheese=mongoose.model("Cheese", CheeseSchema)

app.use(morgan('dev'))
app.use(express.json())

// routes
app.get('/', (req, res)=>{
    res.send('hello world')
})

app.get('/cheese', async (req, res)=>{
    try{
        res.json(await Cheese.find({})) // a promise to find cheese
    }catch(error){
        res.status(400).json(error)
    }
})
app.post('/cheese', async (req, res)=>{
    try{
        res.json(await Cheese.create(req.body))
    }catch(error){
        res.status(400).json(error)
    }
})

app.put('/cheese/:id', async (req, res)=>{
    try{
        res.json(await Cheese.findByIdAndUpdate(req.body, req.params.id, {new:true})) // update with the new data
    }catch(error){
        res.status(400).json(error)
    }
})

app.delete('/cheese/:id', async(req, res)=>{
    try{
        res.json(await Cheese.findByIdAndRemove(req.params.id))
    }catch(error){
        res.status(400).json(error)
    }
})

app.get('/cheese/:id', async(req, res)=>{
    try{
        res.json(await Cheese.findById(req.params.id))
    }catch(error){
        res.status(400).json(error)
    }
})


app.listen(PORT, (req, res)=>{
    console.log("listening to PORT" +PORT)
})
