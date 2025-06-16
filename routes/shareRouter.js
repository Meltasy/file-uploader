const { Router } = require('express')
const shareRouter = Router()
const folderController = require('../controllers/folderController')

shareRouter.get('/:shareId', folderController.getSharedFolder)

module.exports = shareRouter
