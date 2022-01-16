'use strict'
//============= require components =============//
const express  = require('express')
const router = express.Router()
const passport = require('passport')

//============= require controllers =============//
const authController = require('./../controllers/user/authController')
//============= handlers =============//

//============= admin routes =============//
router.post('/signUp', passport.authenticate('jwt', {session: false}), (req, res, next)=>{
    authController.adminCheck(req, res, next, authController.signup)
})
router.post('/edit', passport.authenticate('jwt', {session: false}), (req, res, next)=>{
    authController.adminCheck(req, res, next, authController.edit)
})
router.post('/listUsers', passport.authenticate('jwt', {session: false}), (req, res, next)=>{
    authController.adminCheck(req, res, next, authController.listUsers)
})
router.get('/listSignUpParms', passport.authenticate('jwt', {session: false}), (req, res, next)=>{
    authController.adminCheck(req, res, next, authController.listSignUpParams)
})
router.get('/listViewUserParms', passport.authenticate('jwt', {session: false}), (req, res, next)=>{
    authController.adminCheck(req, res, next, authController.listViewUserParams)
})

//============= user routes =============//
router.route('/login')
.post(authController.login)
router.route('/logout')
.post(authController.logout)
router.post('/auth', passport.authenticate('jwt', {session: false}), (res, req, next)=>{
    authController.authenticate(res, req, next)
})




module.exports = router