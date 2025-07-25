const { Router } = require('express')
const userRouter = Router()
const userController = require('../controllers/userController')
const passport = require('../authentication/passport')
const { validateNewUser } = require('../validation/userValidation')

userRouter.get('/', userController.getUserHome)

userRouter.get('/logIn', userController.logInUser)
userRouter.post('/logIn', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/logIn'
}))
userRouter.get('/logOut', userController.logOutUser)

userRouter.get('/newUser', userController.createUserGet)
userRouter.post('/newUser', validateNewUser, userController.createUserPost)

module.exports = userRouter
