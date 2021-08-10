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


//ADD SIDEBAR
let toggleClass = document.getElementById('sidebar');
let closeSidebar = document.getElementById('closeSidebar');
closeSidebar.addEventListener('click', toggleSidebar);
let cartIcon = document.getElementById('cartIcon');
cartIcon.addEventListener('click', toggleSidebar);
let toggleClass2 = document.getElementById('sidebarOverlay');
toggleClass2.addEventListener('click', toggleSidebar);
let filterBtn = document.getElementById('filterBtn');
filterBtn.addEventListener('click', toggleSidebar);

function toggleSidebar(e) {
    e.preventDefault();
    toggleClass.classList.toggle('sidebar-off');
    toggleClass2.classList.toggle('overlay-off');
    document.body.classList.toggle('no-scroll');
};