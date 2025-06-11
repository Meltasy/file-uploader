const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const asyncHandler = require('express-async-handler')
const bcryptjs = require('bcryptjs')
const CustomError = require('../errors/CustomError')
const { validationResult } = require('express-validator')

const getUserHome = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.render('home', {
      user: null,
      title: 'Welcome',
      folders: []
    })
  }

  const folders = await prisma.folder.findMany({
    where: {
      ownerId: req.user.id
    },
    include: {
      _count: {
        select: {
          files: true
        }
      }
    },
    orderBy: {
      uploadedAt: 'desc'
    }
  })
  res.render('home', {
    user: req.user,
    title: 'Welcome',
    folders: folders
  })
})

const logInUser = function(req, res) {
  res.render('logIn', {
    title: 'Log In'
  })
}

const logOutUser = asyncHandler(async (req, res) => {
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
    throw new CustomError('Username, email or password not found.', 404)
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
