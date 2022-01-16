'use strict'
//============= require modules =============//
const User = require('./../../models/usermodel')
const jwt = require('jsonwebtoken')
const shownListInfo  = {email:1, authority:1}
const editableFileds = ['email', 'psw', 'pswConfirm']
const validator = require('validator')

//============= require controllers =============//
const asyncWrapper = require('./../../utilities/asyncWrapper')
//============= handlers =============//
exports.adminCheck = (req, res, next, fn)=>{
  if (req.user.authority === "admin"){
    fn(req, res, next)
  }
  else{
    return res.status(404).json({
      status: 'failed',
      message: 'you need admin authority to access this route'
    })
  }
}
//============= admin controllers =============//
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
    authority: req.body.authority,
    pswChangedAt: currentTime,
  });
  req.userInfo = await User.findById(newUser._id).select("-psw");
  res.status(201).json({
    status: 'success',
    data:req.userInfo
  })
  }
})
exports.edit = asyncWrapper(async (req, res, next) => {
  const currentTime = Date.now()
  const oldUser = await User.findOne({email:req.body.oriEmail})
  if(oldUser){
    editableFileds.forEach((el)=>{
      oldUser[el] = req.body[el]})
      // validation
      if(validator.isEmail(oldUser.email)&&oldUser.psw === oldUser.pswConfirm){
        // save edited user
        const editedUser = await oldUser.save()
        res.status(201).json({
          status: 'success',
          message:`user updated`,
          user: {email:editedUser.email,
          authority:editedUser.authority}
        })
      }
      else{
        res.status(500).json({
          status: 'failed',
          message:`please follow the rules of data validation`
        })
      }
  }
  else{
  res.status(500).json({
    status: 'failed',
    message: 'user does not exist.'
  })
  }
})
exports.delete = asyncWrapper(async (req, res, next) => {
  const currentTime = Date.now()
  const oldUser = await User.findOne({email:req.body.oriEmail})
  if(oldUser){
    editableFileds.forEach((el)=>{
      oldUser[el] = req.body[el]})
      // validation
      if(validator.isEmail(oldUser.email)&&oldUser.psw === oldUser.pswConfirm){
        // save edited user
        const editedUser = await oldUser.save()
        res.status(201).json({
          status: 'success',
          message:`user updated`,
          user: {email:editedUser.email,
          authority:editedUser.authority}
        })
      }
      else{
        res.status(500).json({
          status: 'failed',
          message:`please follow the rules of data validation`
        })
      }
  }
  else{
  res.status(500).json({
    status: 'failed',
    message: 'user does not exist.'
  })
  }
})
exports.listUsers = asyncWrapper(async(req, res, next)=>{
  const params = {
    email: req.body.email || {$exists: true},
    authority: req.body.authority|| 'user',}
    console.log(params)
  const list = await User.find(params).select(shownListInfo)
  res.status(200).json({
    status: 'success',
    length: list.length,
    data: list
  })
})
exports.listSignUpParams = asyncWrapper(async(req, res, next)=>{
  let adminUser = {...req.user}
  let params = Object.keys(adminUser._doc)
  params.push('psw')
  params.push('pswConfirm')
  const defaultParams = ['_id','authority','createdAt','failedCount','activeUser','pswChangedAt','__v']
  params = params.filter((el)=>{
    let match = false
    defaultParams.forEach((el1)=>{el1 === el?match = true:""})
    return !match
  })
  res.status(200).json({
    status: 'success',
    data: params
  })
})
exports.listViewUserParams = asyncWrapper(async(req, res, next)=>{
  let adminUser = {...req.user}
  let params = Object.keys(adminUser._doc)
  params.push('psw')
  params.push('pswConfirm')
  const defaultParams = ['psw', 'pswConfirm','createdAt','failedCount','activeUser','pswChangedAt','__v']
  params = params.filter((el)=>{
    let match = false
    defaultParams.forEach((el1)=>{el1 === el?match = true:""})
    return !match
  })
  res.status(200).json({
    status: 'success',
    data: params
  })
})
//============= user controllers =============//
exports.login = asyncWrapper(async(req,res,next)=>{
  const {email, psw} = req.body
  const cookieOptions = {
    httpOnly:true,
    expires: new Date(Date.now() + 9000000)
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
  //console.log(req.user._id)
  res.status(201).json({
    status: 'success',
    message: 'jwt is valid',
    email: req.user.email,
    authority: req.user.authority
  })
})

