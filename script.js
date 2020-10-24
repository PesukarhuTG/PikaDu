const close = document.querySelector('.menu-active');
const menu = document.querySelector('.sidebar');

close.addEventListener('click', (e) => {
    menu.classList.toggle('visible');
});