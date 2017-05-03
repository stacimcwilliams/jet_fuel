$(document).ready(() => {
  getFolders()
})

$('#submit-button').on('click', (e) => {
  e.preventDefault()
  const userFolder = $('#folder-input').val()
  createFolder(userFolder)
  $('#folder-input').val('')
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
    <p id=${folder.id} class="folder" name=${folder.id} >${folder.name}</p>
  `)
}

$('.folder-container').on('click', (e) => {
  if(e.target.className === 'folder'){
    folderDetails(e.target.id)
  }
})

const folderDetails = (id) => {
  $('.folder-detail').append(`
    
  `)
}


const getFolders = () => {
  fetch('/api/v1/folders')
    .then(response => response.json())
    .then(data => renderFolders(data.folders))
}

const renderFolders = folders => {
  folders.map(folder => prependFolder(folder))
}

$('#crushify-button').on('click', (e) => {
  e.preventDefault()
  const name = $('#url-name').val()
  const url = $('#url').val()
  crushifyLink(name, url, 1)
  $('#url, #url-name').val('')
})

const crushifyLink = (name,url,folderId) => {
  fetch(`api/v1/links`, {
    method: 'POST',
    headers: {'Content-type': 'application/json' },
    body: JSON.stringify({ "name": name, "url": url, "folderId": folderId })
  })
  .then(response => response.json())
  .then(data => console.log(data))
}
