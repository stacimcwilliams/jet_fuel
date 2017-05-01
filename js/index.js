const clearInput = () => {
  $('#folder-input').val('')
}

$('#submit-button').on('click', (e) => {
  e.preventDefault()
  const userFolder = $('#folder-input').val()
  clearInput()
})
