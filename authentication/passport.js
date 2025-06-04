const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
// Will need to require prisma db connection here
// const connect = require(prisma connect)
const bcryptjs = require('bcryptjs')

// Need to check how we update this when using prisma
// Can I use asyncHandler in this function?
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username])
      const user = rows[0]
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
  done(null, user.user_id)
})

passport.deserializeUser(async (userId, done) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId])
    const user = rows[0]
    return done(null, user)
  } catch(err) {
    return done(err)
  }
})

module.exports = passport
