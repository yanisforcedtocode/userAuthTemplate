'use strict'
//============= require components =============//
const express  = require('express')
const passport = require('passport')
const router = express.Router()
//============= require controllers =============//
const asyncWrapper = require('./../utilities/asyncWrapper')
//============= handlers =============//
const sendSth = asyncWrapper(async(req,res,next)=>{
    console.log('protected route connected')
    return res.status(200).json({
        message: 'protected route connected'
    })
})
//============= routes =============//
router.get('/', passport.authenticate('jwt', {session: false}), (res, req, next)=>{
    console.log('login success')
    sendSth(res, req, next)
}
)
module.exports = router