const openShareModal = document.querySelector('.openShareModal')
const closeShareModal = document.querySelector('.closeShareModal')
const shareModal = document.querySelector('.shareModal')
const shareForm = document.querySelector('.shareModal form')
const shareResult = document.querySelector('#shareResult')
const shareUrl = document.querySelector('#shareUrl')
const expiresAt = document.querySelector('#expiresAt')
const closeCopyToClipboard = document.querySelector('.closeCopyToClipboard')
const duration = document.querySelector('#duration')

const folderId = window.location.pathname.split('/').pop()

openShareModal.addEventListener('click', (e) => {
  e.preventDefault()
  shareModal.showModal()
  shareResult.style.display = 'none'
  shareForm.style.display = 'block'
})

closeShareModal.addEventListener('click', (e) => {
  e.preventDefault()
  shareModal.close()
})

shareForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const formData = new FormData(shareForm)
  const duration = formData.get('duration')
  try {
    const response = await fetch(`/folder/${folderId}/share`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
      },
      body: `duration=${duration}`
    })
    const data = await response.json()
    if (data.success) {
      shareUrl.value = data.shareUrl
      expiresAt.textContent = new Date(data.expiresAt).toLocaleString()
      shareForm.style.display = 'none'
      shareResult.style.display = 'block'
    } else {
      alert('Failed to create share link.')
    }
  } catch (error) {
    console.error('Error creating share:', error)
    alert('Failed to create share link.')
  }
})

function copyToClipboard() {
  shareUrl.select()
  shareUrl.setSelectionRange(0, shareUrl.value.length)
  navigator.clipboard.writeText(shareUrl.value).then(() => {
    alert('Share link copied to clipboard.')
    duration.value = '1d'
  })
}

closeCopyToClipboard.addEventListener('click', (e) => {
  e.preventDefault()
  shareModal.close()
})
