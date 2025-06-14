const { Router } = require('express')
const folderRouter = Router()
const folderController = require('../controllers/folderController')
const { folderValidation } = require('../validation/folderValidation')

folderRouter.get('/:folderId', folderController.getFolder)

folderRouter.post('/newFolder', folderValidation, folderController.createFolderPost)

folderRouter.post('/:folderId/newFile', (req, res, next) => {
  const upload = req.app.locals.upload
  upload.single('uploadFile')(req, res, next)
}, folderController.createFilePost)

folderRouter.post('/:folderId/update', folderValidation, folderController.updateFolder)

folderRouter.post('/:folderId/delete', folderController.deleteFolder)

folderRouter.post('/:folderId/:fileId/delete', folderController.deleteFile)

module.exports = folderRouter
