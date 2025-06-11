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
    throw new CustomError('Folder name not found.', 404)
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

const getFolder = asyncHandler(async (req, res) => {
  const folderId = req.params.folderId
  const folder = await prisma.folder.findFirst({
    where: {
      id: folderId,
      ownerId: req.user.id
    },
    include: {
      files: {
        orderBy: {
          uploadedAt: 'desc'
        }
      }
    }
  })
  if (!folder) {
    throw new CustomError('Folder not found.', 404)
  }
  res.render('folder', {
    user: req.user,
    title: folder.name,
    folder: folder,
    files: folder.files,
  })
})

const createFilePost = asyncHandler(async (req, res) => {
  const folderId = req.params.folderId
  const uploadFile = req.file
  if (!uploadFile) {
    throw new CustomError('Uploaded file not found.', 404)
  }
  const folder = await prisma.folder.findFirst({
    where: {
      id: folderId,
      ownerId: req.user.id
    }
  })
  if (!folder) {
    throw new CustomError('Folder not found.', 404)
  }
  try {
    await prisma.file.create({
      data: {
        name: uploadFile.originalname,
        url: uploadFile.path,
        size: uploadFile.size,
        ownerId: req.user.id,
        folderId: folderId
      }
    })
    res.redirect(`/folder/${folderId}`)
  } catch (error) {
    if (error.code === 'P2002') {
      throw new CustomError('A file with this name already exists in this folder.', 400)
    }
    console.error('Database error:', error)
    throw new CustomError('Failed to upload file. Please try again.', 500)
  }
})

// Add ability to edit (put / patch) folder

const deleteFolder = asyncHandler(async (req, res) => {
  const folderId = req.params.folderId
  const folder = await prisma.folder.findFirst({
    where: {
      id: folderId,
      ownerId: req.user.id
    }
  })
  if (!folder) {
    throw new CustomError('Folder not found.', 404)
  }
  await prisma.$transaction(async (tx) =>{
    await tx.file.deleteMany({
      where: {
        folderId: folderId
      }
    })
    await tx.folder.delete({
      where: {
        id: folderId,
        ownerId: req.user.id
      }
    })
  })
  res.redirect('/')
})

module.exports = {
  createFolderPost,
  getFolder,
  createFilePost,
  deleteFolder
}
