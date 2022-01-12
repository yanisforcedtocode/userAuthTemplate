'use strict'
//============= require modules =============//
const express = require('express')
const app = express()
const passport = require('passport')
const cookieParser = require('cookie-parser')
const cors = require('cors')
//============= variables =============//
const protectRoute = (passport)=>{
    return passport.authenticate('jwt', { session: false })
}
const corsOptions = {
  origin: 'http://localhost:3001/',
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "application/json",'Accept'],
  optionsSuccessStatus: 200,
}
//============= require handlers =============//
const configPassport = require('./passport-config')
const testRoutes = require('./routes/testRoutes')
const userRoutes = require('./routes/userRoutes')
const AppError = require('./utilities/appError')
const globalErrorHandler = require('./controllers/modalities/errorController')
//============= db model =============//
//============= global dir =============//
global.__basedir = __dirname
//============= middleware =============//
app.use(cors(corsOptions),)
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json({limit:'10kb'}));
//============= handlers =============//
//============= passport initialization =============//
app.use(passport.initialize())
configPassport(passport)
//============= Routes =============//
app.use('/user',userRoutes)
app.use('/test', testRoutes);
app.all("*", (req, res, next)=>{
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)) 
  })
app.use(globalErrorHandler)
//============= Exports =============//
module.exports = app