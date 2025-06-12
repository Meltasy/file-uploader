const { supabase, bucketName } = require('./supabase')
const crypto = require('crypto')
const path = require('path')

const uploadFileSupabase = async (file, userId, folderId) => {
  try {
    const fileExtension = path.extname(file.originalname)
    const fileNameWithoutExt = path.basename(file.originalname, fileExtension)
    const uniqueId = crypto.randomUUID()
    const uniqueFileName = `${fileNameWithoutExt}_${uniqueId}${fileExtension}`
    const filePath = `${userId}/${folderId}/${uniqueFileName}`

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      })

    if (error) {
      throw new Error(`Supabase upload error: ${error.message}`)
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath)
    
    return {
      url: publicUrlData.publicUrl,
      path: filePath,
      data: data
    }
  } catch (error) {
    console.error('File upload error:', error)
    throw error
  }
}

const deleteFileSupabase = async (filePath) => {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath])

    if (error) {
      throw new Error(`Supabase delete error: ${error.message}`)
    }

    return true
  } catch (error) {
    console.error('File deletion error:', error)
    throw error
  }
}

const getSignedUrl = async (filePath, expiresIn = 3600) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, expiresIn)

    if (error) {
      throw new Error(`Signed URL error:', ${error.message}`)
    }
    return data.signedUrl
  } catch (error) {
    console.error('Signed URL error:', error)
    throw error
  }
}

module.exports = {
  uploadFileSupabase,
  deleteFileSupabase,
  getSignedUrl
}
