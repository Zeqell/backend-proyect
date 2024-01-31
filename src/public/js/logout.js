document.querySelector('#logOut').addEventListener('click', async () => {
    await fetch("/api/sessions/logout")

    window.location.href = "/";
})