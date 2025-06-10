const { Router } = require('express')
const folderRouter = Router()
const folderController = require('../controllers/folderController')
const { validateNewFolder } = require('../validation/folderValidation')

// folderRouter.get('/newFolder', folderController.createFolderGet)

// folderRouter.get('/:username/:folder', folderController.getFolder)

folderRouter.post('/newFolder', validateNewFolder, folderController.createFolderPost)

folderRouter.post('/newFile', (req, res, next) => {
  const upload = req.app.locals.upload
  upload.single('uploadFile')(req, res, next)
}, folderController.createFilePost)

module.exports = folderRouter
