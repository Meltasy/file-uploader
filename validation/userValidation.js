const { body } = require('express-validator')

const reqErr = 'is required.'
const lengthErr = 'must be between 6 and 60 characters.'

const validateNewUser = [
  body('username')
    .trim()
    .notEmpty().withMessage(`Full name ${reqErr}`)
    .isLength({ min: 6, max: 60 }).withMessage(`Full name ${lengthErr}`)
    .matches(/^[A-Za-z\s]+$/).withMessage('Surname must only contain letters and spaces.'),
  body('email')
    .notEmpty().withMessage(`Email ${reqErr}`)
    .isEmail().withMessage('This is not a valid email address.')
    .isLength({ min: 6, max: 60 }).withMessage(`Email ${lengthErr}`)
    .normalizeEmail({ gmail_remove_dots: false }),
  body('password')
    .trim()
    .notEmpty().withMessage(`Password ${reqErr}`)
    .isLength({ min: 8, max: 24 }).withMessage('Password must be between 8 and 24 characters.')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).*$/).withMessage('Password must contain one number, one lowercase letter, one uppercase letter, one special character and no spaces.'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match.')
      }
      return true
    })
]

module.exports = { validateNewUser }
