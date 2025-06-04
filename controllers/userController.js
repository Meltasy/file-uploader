// Will need to require prisma queries here
// const db = require(prisma queries)
const asyncHandler = require('express-async-handler')
const CustomError = require('../errors/CustomError')
const { validationResult } = require('express-validator')

const getUserHome = function(req, res) {
  res.render('home', {
    title: 'Welcome'
  })
}

const logInUser = function(req, res) {
  res.render('logIn', {
    title: 'Log In'
  })
}

const logOutUser = asyncHandler(async(req, res) => {
  // Do we need to add cookie session or user here?
  req.logout((err) => {
    if (err) {
      // Is this a 400 Bad request or something else?
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
  await db.insertUser(username, email, password)
  // Can I redirect to home page as logged in user and how? '/:userId'
  res.redirect('/log-in')
})

module.exports = {
  getUserHome,
  logInUser,
  logOutUser,
  createUserGet,
  createUserPost
}
