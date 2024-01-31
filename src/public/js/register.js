const password = document.querySelector('#password')
const pswRepeat = document.querySelector('#pswRepeat')
const submitButton = document.querySelector('#registerButton')
const answer = document.querySelector('#answer')

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        answer.innerHTML = ''
    }, 3000)
})

password.addEventListener('keyup', (e) => {
    if (password.value === pswRepeat.value && password.value.length >= 4) {
        submitButton.disabled = false
        answer.innerHTML = ''
    } else {
        submitButton.disabled = true
        answer.innerHTML = 'La contraseña debe tener mínima de 4 caracteres'
        setTimeout(() => {
            answer.innerHTML = ''
        }, 2000)
    }
})
pswRepeat.addEventListener('keyup', (e) => {
    if (password.value === pswRepeat.value && password.value.length >= 4) {
        submitButton.removeAttribute('disabled')

        answer.innerHTML = ''
    } else {
        submitButton.disabled = true;
        answer.innerHTML = 'La contraseña deben ser identicas'
        setTimeout(() => {
            answer.innerHTML = ''
        }, 2000)
    }
})
