//const { logger } = require("../../utils/logger")

const socket = io()

const chatBox = document.getElementById('chatBox')
const messageLogs = document.getElementById('messageLogs')

Swal.fire({
    title: 'tu correo',
    input: 'texto',
    text: 'Completa con tu email para chatear',
    allowOutsideClick: false,
    inputValidator: value => {
        return !value && 'Necesitas llenar el cuadro para chatear'
    }
}).then(result => {
    user = result.value
})

chatBox.addEventListener('keyup', evt => {
    if(evt.key === 'Enter'){
        if(chatBox.value.trim().length > 0){
            socket.emit('message', { user, message: chatBox.value })
            chatBox.value = ''
        }
    }
})

socket.on('messageLogs', (data) => {
    if (data && data.message) {
        const messageLogs = document.getElementById('messageLogs')
        messageLogs.innerHTML += `<p>${data.user}: ${data.message.message}</p>`
    }
})