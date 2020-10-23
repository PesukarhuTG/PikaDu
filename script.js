const close = document.querySelector('.menu-toggle');
const menu = document.querySelector('.sidebar');

close.addEventListener('click', (e) => {
    e.preventDefault();
    menu.classList.toggle('visible');
});