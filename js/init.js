// ENABLE Tooltip
[...document.querySelectorAll('[data-bs-toggle="tooltip"]')].forEach(el => new bootstrap.Tooltip(el));
// ENABLE popover
[...document.querySelectorAll('[data-bs-toggle="popover"]')].forEach(el => new bootstrap.Popover(el));
document.addEventListener("DOMContentLoaded", function(event) { // <-- add this wrapper
    var element = document.querySelectorAll('.btn-outline-primary');
    if (element) {
        element.forEach(function(el, key){
            el.addEventListener('click', function () {  
                el.classList.toggle("active");
                element.forEach(function(ell, els){
                    if(key !== els) {
                        ell.classList.remove('active');
                    }
                    // console.log(els);
                });
            });
        });
    }
});