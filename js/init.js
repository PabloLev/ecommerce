// ENABLE Tooltip
[...document.querySelectorAll('[data-bs-toggle="tooltip"]')].forEach(el => new bootstrap.Tooltip(el));
// ENABLE popover
[...document.querySelectorAll('[data-bs-toggle="popover"]')].forEach(el => new bootstrap.Popover(el));





// let el = document.getElementById('buy');
// let toggleClass = document.getElementById('sidebar');
// el.addEventListener("click", toggle())
// function toggle() {
//     toggleClass.classList.toggle('closeSidebar');
// }

let closeSidebar = document.getElementById('closeSidebar');
let cartIcon = document.getElementById('cartIcon');
let toggleClass = document.getElementById('sidebar');
let toggleClass2 = document.getElementById('sidebarOverlay');

cartIcon.addEventListener('click', toggleSidebar);
closeSidebar.addEventListener('click', toggleSidebar);
toggleClass2.addEventListener('click', toggleSidebar);
function toggleSidebar(e) {
    e.preventDefault();
    toggleClass.classList.toggle('sidebar-off');
    toggleClass2.classList.toggle('overlay-off');
    document.body.classList.toggle('no-scroll');
};