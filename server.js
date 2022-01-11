const dotenv  = require('dotenv')
dotenv.config({path: "config.env"})
const app = require('./app')
const mongoose = require('mongoose')

//============= Server =============//
const server = app.listen(process.env.port, ()=>{
    console.log(`${process.env.AppName} is running on ${process.env.port}`)
})
//============= Mongoose connection =================//
const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD)
mongoose.connect(DB,{

}).then(()=> {
  console.log("DB connection successful")
}).catch((err)=>{
  console.log(err+"Not connected to Database")
})

//============= Uncaught Exception =============//
process.on("uncaughtException", err =>{
    console.log(err.name, err.message)
    console.log("unhanlded rejection, shutting down");
    process.exit(1)
  })
//============= Unhandled Rejections =============//
process.on("unhandledRejection", err =>{
    console.log(err.name, err.message)
    console.log("unhanlded rejection, shutting down");
    server.close(()=>{process.exit(1)})
})