// Will need to require prisma queries here
// const db = require(prisma queries)
const asyncHandler = require('express-async-handler')
const CustomNotFoundError = require('../errors/CustomNotFoundError')

const getUserHome = function(req, res) {
  res.render('home', {
    title: 'Welcome'
  })
}

const createUserGet = function(req, res) {
  res.render('newUser', {
    title: 'New User'
  })
}

const createUserPost = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body
  await db.insertUser(userName, email, password)
  if (!userName || !email || !password) {
    throw new CustomNotFoundError('Username, email or password not found.')
  }
  res.redirect('/log-in')
})

module.exports = {
  getUserHome,
  createUserGet,
  createUserPost
}
