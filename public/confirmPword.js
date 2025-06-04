const form = document.querySelector('form')
const passwordInput = document.querySelector('#password')
const confirmPasswordInput = document.querySelector('#confirmPassword')

const errorMessage = document.createElement('div')
errorMessage.style.color = 'darkred'
errorMessage.style.fontSize = '16px'
errorMessage.style.fontWeight = '700'
errorMessage.style.marginTop = '5px'
errorMessage.style.textAlign = 'right'
errorMessage.style.display = 'none'
confirmPasswordInput.parentNode.appendChild(errorMessage)

function checkPasswordsMatch() {
  const password = passwordInput.value
  const confirmPassword = confirmPasswordInput.value
  if (confirmPassword === '') {
    errorMessage.style.display = 'none'
    confirmPasswordInput.setCustomValidity('')
    return true
  }
  if (password !== confirmPassword) {
    errorMessage.textContent = 'Passwords do not match.'
    errorMessage.style.display = 'block'
    confirmPasswordInput.setCustomValidity('Passwords do not match.')
    return false
  } else {
    errorMessage.style.display = 'none'
    confirmPasswordInput.setCustomValidity('')
    return true
  }
}

confirmPasswordInput.addEventListener('input', checkPasswordsMatch)
passwordInput.addEventListener('input', () => {
  if (confirmPasswordInput.value !== '') {
    checkPasswordsMatch()
  }
})

form.addEventListener('submit', (e) => {
  if (!checkPasswordsMatch()) {
    e.preventDefault()
    alert('Please make sure passwords match before submitting.')
  }
})
