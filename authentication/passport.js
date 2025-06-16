const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcryptjs = require('bcryptjs')

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username: username
        }
      })
      if (!user) {
        return done(null, false, { message: 'This username is incorrect.'})
      }
      const match = await bcryptjs.compare(password, user.password)
      if (!match) {
        return done(null, false, { message: 'This passowrd is incorrect.' })
      }
      return done(null, user)
    } catch (err) {
      return done(err)
    }
  })
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id
      }
    })
    return done(null, user)
  } catch(err) {
    return done(err)
  }
})

module.exports = passport
