'use strict'
//============= require components =============//
const express  = require('express')
const router = express.Router()
const passport = require('passport')

//============= require controllers =============//
const authController = require('./../controllers/user/authController')
const asyncWrapper = require('./../utilities/asyncWrapper')
//============= handlers =============//
const authenticate = asyncWrapper(async(req,res,next)=>{
    console.log('protected route connected')
    return res.status(200).json({
        status: 'success',
        message: 'jwt is valid'
    })
})

router.route('/login')
.post(authController.login)
router.route('/logout')
.post(authController.logout)
router.route('/signUp')
.post(authController.signup)
router.post('/auth', passport.authenticate('jwt', {session: false}), (res, req, next)=>{
    authController.authenticate(res, req, next)
}
)
module.exports = router