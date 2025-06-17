const { Router } = require('express')
const shareRouter = Router()
const folderController = require('../controllers/folderController')

shareRouter.get('/:shareId', folderController.getSharedFolder)
shareRouter.get('/:shareId/file/:fileId/download', folderController.downloadSharedFile)

module.exports = shareRouter
