require('dotenv').config()
const express = require('express')
const app = express()
const path = require('node:path')

// Will need to install and use method-override to use DELETE, PUT and PATCH where these aren't supported.

const userRouter = require('./routes/userRouter')

// Handle static assets

const assetsPath = path.join(__dirname, 'public')
app.use(express.static(assetsPath))

// ejs templating

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// App middleware

app.use('/', userRouter)

// Catches any final errors - must be at end

app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.statusCode || 500).send(err)
})

// Normally at end - but can sit anywhere

app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`File uploader app - listening on port ${process.env.PORT}`)
})
