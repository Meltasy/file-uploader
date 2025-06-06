const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const asyncHandler = require('express-async-handler')
const bcryptjs = require('bcryptjs')
const CustomError = require('../errors/CustomError')
const { validationResult } = require('express-validator')

const getUserHome = function(req, res) {
  res.render('home', {
    user: req.user,
    title: 'Welcome'
  })
}

const logInUser = function(req, res) {
  res.render('logIn', {
    title: 'Log In'
  })
}

const logOutUser = asyncHandler(async(req, res) => {
  req.logout((err) => {
    if (err) {
      throw new CustomError('Unable to log user out.', 400)
    }
    res.redirect('/')
  })
})

const createUserGet = function(req, res) {
  res.render('newUser', {
    title: 'New User'
  })
}

const createUserPost = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    throw new CustomError(`New user validation failed: ${errors.array().map(err => err.msg).join(', ')}`, 400)
  }
  const { username, email, password } = req.body
  if (!username || !email || !password) {
    throw new CustomError('Username, email or password not found.', 400)
  }
  const hashPword = await bcryptjs.hash(password, 10)
  console.log(username, email, password, hashPword)
  const newUser = await prisma.user.create({
    data: {
      username: username,
      email: email,
      password: hashPword
    }
  })
  req.login(newUser, (err) => {
    if (err) {
      throw new CustomError('Unable to log in user after signing up.', 500)
    }
    res.redirect('/')
  })
})

module.exports = {
  getUserHome,
  logInUser,
  logOutUser,
  createUserGet,
  createUserPost
}
