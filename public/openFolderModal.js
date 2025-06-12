const folderModal = document.querySelector('.folderModal')
const openFolderModal = document.querySelector('.openFolderModal')
const closeFolderModal = document.querySelector('.closeFolderModal')
const folderForm = document.querySelector('.folderModal form')
const folderNameInput = document.querySelector('#folderName')
const submitBtn = document.querySelector('.submitBtn')

openFolderModal.addEventListener('click', (e) => {
  e.preventDefault()
  resetModalCreate()
  folderModal.showModal()
})

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('renameFolderBtn')) {
    const folderId = e.target.dataset.folderId
    const folderName = e.target.dataset.folderName
    openModalRename(folderId, folderName)
  }
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

function resetModalCreate() {
  folderForm.action = '/folder/newFolder'
  folderForm.method = 'POST'
  folderNameInput.value = ''
  submitBtn.textContent = 'Add folder'
}

function openModalRename(folderId, folderName) {
  folderForm.action = `/folder/${folderId}/update`
  folderForm.method = 'POST'
  folderNameInput.value = folderName
  submitBtn.textContent = 'Rename'
  folderModal.showModal()
  folderNameInput.select()
}
