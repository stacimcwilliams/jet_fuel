$(document).ready(() => {
  getFolders()
})

$('#submit-button').on('click', (e) => {
  e.preventDefault()
  const userFolder = $('#folder-input').val()
  createFolder(userFolder)
  $('#folder-input').val('')
})

$('.folder-container').on('click', (e) => {
  if(e.target.className === 'folder'){
    folderDetails(e.target.id, e.target.innerText)
  }
})

const folderDetails = (id, name) => {
  let container = $('.folder-detail')
  container.empty()
  container.append(`
    <div class="folder-details">
      <h2 class="detail-name">${name}</h2>
        <input id="url-name" placeholder="name"></input>
        <input id="url" placeholder="url"></input>
        <button onclick=submitUrl(${id}) id="crushify-button">Crushify!!!!</button>
        <div class="link-list">
        </div>
    </div>
  `)
  getLinks(id)
}

const getLinks = (id) => {
  fetch(`/api/v1/folders/${id}/links`)
    .then(response => response.json())
    .then(data => renderLinks(data))
}

const renderLinks = (links) => {
  links.map(link => prependLinks(link))
}

const rout = () => {

}

const prependLinks = (link) => {
  $('.link-list').append(`
    <div class="link-card">
      <h3 class="link-name">${link.name}</h3>
      <a class="short-link" href='/short/${link.id}'>localhost/3000/short/${link.id}</a>
    </div>
  `)
}

const getFolders = () => {
  fetch('/api/v1/folders')
    .then(response => response.json())
    .then(data => renderFolders(data))
}

const renderFolders = folders => {
  folders.map(folder => prependFolder(folder))
}

const prependFolder = folder => {
  $('.folder-container').prepend(`
    <p id=${folder.id} class="folder" name=${folder.title} >${folder.title}</p>
  `)
}

const submitUrl = (id) => {
  const name = $('#url-name').val()
  const url = $('#url').val()

  crushifyLink(name, url, id)
  $('#url, #url-name').val('')
}

const createFolder = title => {
  fetch('/api/v1/folders', {
    method: 'POST',
    headers: { 'Content-type':'application/json' },
    body: JSON.stringify({ title })
  })
  .then(response => response.json())
  .then(folder => prependFolder(folder))
}


const crushifyLink = (name,url,folderId) => {
  fetch(`api/v1/links`, {
    method: 'POST',
    headers: {'Content-type': 'application/json' },
    body: JSON.stringify({ "name": name, "url": url, "folder_id": folderId, "visits": 0 })
  })
  .then(response => response.json())
  .then(link => prependLinks(link))
}
