require('dotenv').config()
const path = require('node:path')
const express = require('express')
const app = express()
const session = require('express-session')
const passport = require('passport')
const multer = require('multer')
const { PrismaSessionStore } = require('@quixo3/prisma-session-store')
const { PrismaClient } = require('@prisma/client')
const CustomError = require('./errors/CustomError')

// Will need to install and use method-override to use DELETE, PUT and PATCH where these aren't supported.

const userRouter = require('./routes/userRouter')
const folderRouter = require('./routes/folderRouter')
const shareRouter = require('./routes/shareRouter')

// Handle static assets
const assetsPath = path.join(__dirname, 'public')
app.use(express.static(assetsPath))

// Hanlde file uploads

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const blockedFiles = ['application/x-executable', 'application/x-msdownload', 'application/x-dosexec']
    if (blockedFiles.includes(file.mimetype)) {
      cb(new Error('This file type is not allowed for security reasons'), false)
    } else {
      cb(null, true)
    }
  }
})
app.locals.upload = upload

// ejs templating
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// Used for POST and PUT requests only
app.use(express.urlencoded({ extended: true }))

// App middleware
app.use(session({
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000
  },
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  store: new PrismaSessionStore(
    new PrismaClient(),
    {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }
  )
}))
app.use(passport.session())

// User available in all views
app.use((req, res, next) => {
  res.locals.currentUser = req.user
  next()
})

app.use('/', userRouter)
app.use('/folder', folderRouter)
app.use('/share', shareRouter)

// Catches any final errors - must be at end
app.use((req, res, next) => {
  next(new CustomError('Page not found.', 404))
})

app.use((err, req, res, next) => {
  console.error(err)
  if (err instanceof CustomError) {
    return res.status(err.statusCode).render('error', {
      message: err.message,
      error: process.env.NODE_ENV === 'development' ? err : null
    })
  }
  res.status(err.statusCode || 500).render('error', {
    message: err.message || 'Something broke!',
    error: process.env.NODE_ENV === 'development' ? err : null
  })
})

// Normally at end - but can sit anywhere
app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`File uploader app - listening on port ${process.env.PORT}`)
})
