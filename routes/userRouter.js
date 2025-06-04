const { Router } = require('express')
const userController = require('../controllers/userController')
const userRouter = Router()

userRouter.get('/', userController.getUserHome)
userRouter.get('/newUser', userController.createUserGet)
userRouter.post('/newUser', userController.createUserPost)

module.exports = userRouter
