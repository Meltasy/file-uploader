const { Router } = require('express')
const folderRouter = Router()
const folderController = require('../controllers/folderController')
const { validateNewFolder } = require('../validation/folderValidation')

folderRouter.get('/:folderId', folderController.getFolder)

folderRouter.post('/newFolder', validateNewFolder, folderController.createFolderPost)

folderRouter.post('/:folderId/newFile', (req, res, next) => {
  const upload = req.app.locals.upload
  upload.single('uploadFile')(req, res, next)
}, folderController.createFilePost)

// Add ability to edit (put / patch) folder

folderRouter.post('/:folderId/delete', folderController.deleteFolder)

module.exports = folderRouter
