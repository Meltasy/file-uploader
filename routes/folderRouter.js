const { Router } = require('express')
const folderRouter = Router()
const folderController = require('../controllers/folderController')
const { folderValidation } = require('../validation/folderValidation')

folderRouter.post('/newFolder', folderValidation, folderController.createFolderPost)
folderRouter.get('/:folderId', folderController.getFolder)

folderRouter.post('/:folderId/newFile', (req, res, next) => {
  const upload = req.app.locals.upload
  upload.single('uploadFile')(req, res, next)
}, folderController.createFilePost)

folderRouter.post('/:folderId/update', folderValidation, folderController.updateFolder)
folderRouter.post('/:folderId/delete', folderController.deleteFolder)

folderRouter.get('/:folderId/file/:fileId/download', folderController.downloadFile)
folderRouter.post('/:folderId/:fileId/delete', folderController.deleteFile)

folderRouter.post('/:folderId/share', folderController.createShare)
folderRouter.post('/:folderId/share/:shareId/delete', folderController.deleteShare)

module.exports = folderRouter
