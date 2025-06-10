const folderModal = document.querySelector('#folderModal')
const openFolderModal = document.querySelector('#openFolderModal')
const closeFolderModal = document.querySelector('#closeFolderModal')

openFolderModal.addEventListener('click', (e) => {
  e.preventDefault()
  folderModal.showModal()
})

closeFolderModal.addEventListener('click', (e) => {
  e.preventDefault()
  folderModal.close()
})

folderModal.addEventListener('click', (e) => {
  if (e.target === folderModal) {
    folderModal.close()
  }
})
