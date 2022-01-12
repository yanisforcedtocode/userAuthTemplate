'use strict'
//============= require modules =============//
const User = require('./../../models/usermodel')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

//============= require controllers =============//
const asyncWrapper = require('./../../utilities/asyncWrapper')
//============= signUp controller =============//
exports.signup = asyncWrapper(async (req, res, next) => {
  const currentTime = Date.now()
  const oldUser = await User.findOne({email:req.body.email})
  if(oldUser){
    console.log('user exists')
    res.status(400).json({
      message:`user already exists`
    })
  }
  else{
  const newUser = await User.create({
    email: req.body.email,
    psw: req.body.psw,
    pswConfirm: req.body.pswConfirm,
    pswChangedAt: currentTime,
  });
  req.userInfo = await User.findById(newUser._id).select("-psw");
  res.status(201).json({
    data:req.userInfo
  })
  }
})
exports.login = asyncWrapper(async(req,res,next)=>{
  const {email, psw} = req.body
  const cookieOptions = {
    httpOnly:true,
    expires: new Date(Date.now() + 900000)
    //secure: true,
    //sameSite: false
  }
  console.log(`login from ${email}`)
  const oldUser  = await User.findOne({email:email}).select(['psw', 'email', '_id'])
  if (oldUser){
    // check password
    const pswValid = await oldUser.correctPassword(psw, oldUser.psw)
    if(pswValid){
      // sign token
      const payload = {
        id: oldUser._id,
        email: oldUser.email
      }
      const jwtOption = {
        expiresIn: process.env.jwtExpiry,

      }
      jwt.sign(payload, process.env.jwtSecret, jwtOption, (err, token)=>{
        res.cookie('jwtToken', token,cookieOptions)
        return res.status(200).json({
          status: 'success',
          message: 'cookie signed with jwt',
          //token:token
        })
      })
    }else{
      return res.status(400).json({
        status: 'failed',
        message: 'email or psw incorrect'
      })
    }
  }else{
    return res.status(404).json({
      status: 'failed',
      message: 'user not found'
    })
  }
})
exports.logout = asyncWrapper(async(req,res,next)=>{
  res.cookie('jwtToken', '');
  res.status(200).json({
    status: 'success',
    message: 'logout completed, jwt removed from cookies.'
  })
})
exports.authenticate = asyncWrapper(async (req, res, next)=>{
  console.log(req.user._id)
  res.status(201).json({
    status: 'success',
    message: 'jwt is valid',
    email: req.user.email
  })
})

