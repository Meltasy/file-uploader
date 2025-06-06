const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const asyncHandler = require('express-async-handler')
const CustomError = require('../errors/CustomError')

const createFileGet = function(req, res) {
  res.render('newFile', {
    user: req.user,
    title: 'Upload File',
    message: ''
  })
}

const createFilePost = asyncHandler(async (req, res) => {
  const username = req.user.username
  const uploadFile = req.file
  // const { originalName, path, size } = req.file
  if (!uploadFile) {
    throw new CustomError('Uploaded file not found.', 400)
  }
  console.log(username, uploadFile)
  // Upload file to cloud and text info to database
  // await prisma.user.create({
  //   where: {
  //     username: username
  //   },
  //   data: {
  //     name: uploadFile.originalname,
  //     url: uploadFile.path,
  //     size: uploadFile.size
  //   }
  // })
  res.render('newFile', {
    user: req.user,
    title: 'Upload File',
    message: 'You have successfully uploaded the file!'
  })
})

module.exports = {
  createFileGet,
  createFilePost
}
