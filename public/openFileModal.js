const fileModal = document.querySelector('.fileModal')
const openFileModal = document.querySelector('.openFileModal')
const closeFileModal = document.querySelector('.closeFileModal')

openFileModal.addEventListener('click', (e) => {
  e.preventDefault()
  fileModal.showModal()
})

closeFileModal.addEventListener('click', (e) => {
  e.preventDefault()
  fileModal.close()
})

fileModal.addEventListener('click', (e) => {
  if (e.target === fileModal) {
    fileModal.close()
  }
})
