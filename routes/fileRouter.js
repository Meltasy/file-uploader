const { Router } = require('express')
const fileRouter = Router()
const fileController = require('../controllers/fileController')

fileRouter.get('/newFile', fileController.createFileGet)
fileRouter.post('/newFile', (req, res, next) => {
  const upload = req.app.locals.upload
  upload.single('uploadFile')(req, res, next)
}, fileController.createFilePost)

module.exports = fileRouter
