const { body } = require('express-validator')

const validateNewFolder = [
  body('folderName')
    .trim()
    .notEmpty().withMessage('Folder name is required.')
    .isLength({ min: 3, max: 30 }).withMessage('Folder name must be between 3 and 30 characters.')
    .matches(/^[A-Za-z\s]+$/).withMessage('Folder name must only contain letters and spaces.')
    .escape(),
]

module.exports = { validateNewFolder }
