const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const asyncHandler = require('express-async-handler')
const CustomError = require('../errors/CustomError')
const { validationResult } = require('express-validator')
const { uploadFileSupabase, deleteFileSupabase, getSignedUrl } = require('../storage/fileService')

const createFolderPost = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    throw new CustomError(`New folder validation failed: ${errors.array().map(err => err.msg).join(', ')}`, 400)
  }
  const folderName = req.body.folderName
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
  const filesSignedUrls = await Promise.all(
    folder.files.map(async (file) => {
      const signedUrl = await getSignedUrl(file.storagePath, 3600)
      return {
        ...file,
        signedUrl: signedUrl
      }
    })
  )
  res.render('folder', {
    user: req.user,
    title: folder.name,
    folder: folder,
    files: filesSignedUrls,
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
    const uploadResult = await uploadFileSupabase(uploadFile, req.user.id, folderId)
    await prisma.file.create({
      data: {
        name: uploadFile.originalname,
        url: uploadResult.url,
        storagePath: uploadResult.path,
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

const updateFolder = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    throw new CustomError(`New folder validation failed: ${errors.array().map(err => err.msg).join(', ')}`, 400)
  }
  const folderId = req.params.folderId
  const folderName = req.body.folderName
  if (!folderName) {
    throw new CustomError('Folder name not found.', 404)
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
    await prisma.folder.update({
      where: {
        id: folderId,
        ownerId: req.user.id
      },
      data: {
        name: folderName
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

const deleteFolder = asyncHandler(async (req, res) => {
  const folderId = req.params.folderId
  const folder = await prisma.folder.findFirst({
    where: {
      id: folderId,
      ownerId: req.user.id
    },
    include: {
      files: true
    }
  })
  if (!folder) {
    throw new CustomError('Folder not found.', 404)
  }
  try {
    await prisma.$transaction(async (tx) =>{
      const deletePromises = folder.files.map(file => {
        if (file.storagePath) {
          return deleteFileSupabase(file.storagePath)
        }
      }).filter(Boolean)
      await Promise.all(deletePromises)
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
  } catch (error) {
    console.error('Delete folder error:', error)
    throw new CustomError('Failed to delete folder. Please try again.', 500)
  }
})

const downloadFile = asyncHandler(async (req, res) => {
  const fileId = req.params.fileId
  const folderId = req.params.folderId

  const file = await prisma.file.findFirst({
    where: {
      id: fileId,
      folderId: folderId,
      ownerId: req.user.id
    }
  })
  if (!file) {
    throw new CustomError('File not found', 404)
  }
  try {
    const signedUrl = await getSignedUrl(file.storagePath, 300)
    const response = await fetch(signedUrl)
    if (!response.ok) {
      throw new Error('Failed to fetch file from storage.')
    }
    res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`)
    res.setHeader('Content-type', 'application/octet-stream')
    const buffer = await response.arrayBuffer()
    res.send(Buffer.from(buffer))
  } catch (error) {
    console.error('Download error:', error)
    throw new CustomError('Failed to download file. Please try again.', 500)
  }
})

const deleteFile = asyncHandler(async (req, res) => {
  const fileId = req.params.fileId
  const folderId = req.params.folderId
  const file = await prisma.file.findFirst({
    where: {
      id: fileId,
      ownerId: req.user.id
    }
  })
  if (!file) {
    throw new CustomError('File not found.', 404)
  }
  try {
    if (file.storagePath) {
      await deleteFileSupabase(file.storagePath)
    }
    await prisma.file.delete({
      where: {
        id: fileId,
        ownerId: req.user.id
      }
    })
    res.redirect(`/folder/${folderId}`)
  } catch (error) {
    console.error('Delete file error:', error)
    throw new CustomError('Failed to delete file. Please try again.', 500)
  }
})

module.exports = {
  createFolderPost,
  getFolder,
  createFilePost,
  updateFolder,
  deleteFolder,
  downloadFile,
  deleteFile
}
