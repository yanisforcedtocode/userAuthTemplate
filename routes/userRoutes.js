'use strict'
//============= require components =============//
const express  = require('express')
const router = express.Router()

//============= require controllers =============//
const authController = require('./../controllers/user/authController')


router.route('/login')
.post(authController.login)
router.route('/logout')
.post(authController.logout)
router.route('/signUp')
.post(authController.signup)

module.exports = router