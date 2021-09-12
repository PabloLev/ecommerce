// ENABLE Tooltip
[...document.querySelectorAll('[data-bs-toggle="tooltip"]')].forEach((el) => new bootstrap.Tooltip(el));
// ENABLE popover
[...document.querySelectorAll('[data-bs-toggle="popover"]')].forEach((el) => new bootstrap.Popover(el));
