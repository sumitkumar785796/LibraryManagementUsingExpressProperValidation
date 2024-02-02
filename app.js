require('dotenv').config()
const PORT = process.env.PORT 
const express = require('express')
const app = express()
const route = require('./routes/routes')
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('',route)
app.listen(PORT,()=>{
    console.log(`server is running at http://localhost:${PORT}`)
})