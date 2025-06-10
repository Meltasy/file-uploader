const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const asyncHandler = require('express-async-handler')
const CustomError = require('../errors/CustomError')
const { validationResult } = require('express-validator')

const createFolderPost = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    throw new CustomError(`New folder validation failed: ${errors.array().map(err => err.msg).join(', ')}`, 400)
  }
  const folderName = req.body.folderName
  console.log('Folder name: ', folderName)
  if (!folderName) {
    throw new CustomError('Folder name not found.', 400)
  }
  try {
    await prisma.folder.create({
      data: {
        name: folderName,
        ownerId: req.user.id
      }
    })
    res.redirect('/')
  } catch(error) {
    if(error.code === 'P2002') {
      throw new CustomError('A folder with this name already exists.', 400)
    }
    console.error('Database error:', error)
    throw new CustomError('Failed to create folder. Please try again.', 500)
  }
})

// const getFolder = function(req, res) {
//   res.render('folder', {
//     user: req.user,
//     title: folderName
//     message: ''
//   })
// }

const createFilePost = asyncHandler(async (req, res) => {
  const uploadFile = req.file
  // const { originalName, path, size } = req.file
  if (!uploadFile) {
    throw new CustomError('Uploaded file not found.', 400)
  }
  // Upload file to cloud and text info to database
  // await prisma.user.create({
  //   where: {
  //     username: req.user.username
  //   },
  //   data: {
  //     name: uploadFile.originalname,
  //     url: uploadFile.path,
  //     size: uploadFile.size
  //   }
  // })
  res.render('folder', {
    user: req.user,
    title: 'Upload File',
    message: 'You have successfully uploaded the file!'
  })
})

module.exports = {
  createFolderPost,
  // getFolder,
  createFilePost
}
