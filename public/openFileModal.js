const fileModal = document.querySelector('#fileModal')
const openFileModal = document.querySelector('#openFileModal')
const closeFileModal = document.querySelector('#closeFileModal')

console.log('file elements:', { fileModal, openFileModal, closeFileModal })

if (openFileModal && fileModal && closeFileModal) {
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
} else {
  console.log('Missing elements:')
  console.log('fileModal:', fileModal)
  console.log('openFileModal:', openFileModal)
  console.log('closeFileModal:', closeFileModal)
}
