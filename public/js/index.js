const clearInput = () => {
  $('#folder-input').val('')
}

$('#submit-button').on('click', (e) => {
  e.preventDefault()
  const userFolder = $('#folder-input').val()
  createFolder(userFolder)
  clearInput()
})

const createFolder = name => {
  fetch('/api/v1/folders', {
    method: 'POST',
    headers: { 'Content-type':'application/json' },
    body: JSON.stringify({ "name": name })
  })
    .then(response => response.json())
    .then(folders => prependFolder(folders))
}

const prependFolder = folder => {
  $('.folder-container').prepend(`
    <p class=${folder.id}  name=${folder.id} >${folder.name}</p>
  `)
}

$(document).ready(() => {
  console.log('ready')
})

const getFolders = () => {
  fetch('/api/v1/folders')
    .then(response => response.json())
    .then(data => renderfolder(data.folders))
}

const renderFolders = folders => {
  $('.folder-container').prepend(folders.map(folder => {`
    <p class=${folder.id}  name=${folder.id} >${folder.name}</p>
  `}))
}
