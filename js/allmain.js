
//CONSTRUCTOR PRODUCTS - CREADORA DE OBJETOS 
class Product{
    constructor (id, category, gender, brand, model, color, price, sizeStock){
        this.id = id;
        this.category = category.toUpperCase(); 
        this.gender = gender.toUpperCase();
        this.brand = brand.toUpperCase();
        this.model = model.toUpperCase();
        this.color = color.toUpperCase();
        this.price = parseFloat(price);
        this.sizeStock = sizeStock;
        this.img1 = 'img/' + this.gender.toLowerCase() + '/' + this.brand.toLowerCase() + '/' + this.id + '_' + this.brand.toLowerCase() + '_' + this.model.toLowerCase() + '_' + this.color.toLowerCase() + '_a.webp';
        this.img2 = 'img/' + this.gender.toLowerCase() + '/' + this.brand.toLowerCase() + '/' + this.id + '_' + this.brand.toLowerCase() + '_' + this.model.toLowerCase() + '_' + this.color.toLowerCase() + '_b.webp';
        this.inStock = true;
        this.promotion = false;
    }
}
const products = [];

//CREO "BASE DE DATOS con AJAX"
// function obtainData(){
//     const xhttp = new XMLHttpRequest();
//     xhttp.open('GET', './assets/products.json', true);
//     xhttp.send();
//     xhttp.onreadystatechange = function(){
//         if(this.readyState == 4 && this.status == 200){
//             const datos = JSON.parse(this.responseText);
//             for(let item of datos){
//                 products.push(new Product(item.id, item.category, item.gender, item.brand, item.model, item.color, item.price, item.sizeStock));     
//             }
//             loadDOM(products);
//         }
//     }
// }
//CREO "BASE DE DATOS con FETCH"
const fetchDataProducts = async () => {
    try {
        const res = await fetch('./assets/products.json');
        const response = await res.json();
        console.log(response);
        for(let item of response){
            products.push(new Product(item.id, item.category, item.gender, item.brand, item.model, item.color, item.price, item.sizeStock));     
        }
        loadDOM(products)
    } catch (error) {
        console.log(error);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    fetchDataProducts();
    // obtainData();
})


//RELOAD AJAX
// function obtainDataAjax(newProducts){
//     const xhttp = new XMLHttpRequest();
//     xhttp.open('GET', '', true);
//     xhttp.send();
//     xhttp.onreadystatechange = function(){
//         if(this.readyState == 4 && this.status == 200){
//             emptyFromDom(productsCatalog)
//             loadDOM(newProducts);
//         }
//     }
// }
//RELOAD ASYNC
const fetchDataNewProducts = async (products) => {
    try {
        console.log(products);
        emptyFromDom(productsCatalog)
        loadDOM(products);
    } catch (error) {
        console.log(error);
    }
}
//METODO LIMPIO EL DOM - PARA EVITAR SUMATORIA DE ELEMENTOS CUANDO SE PUEBLA
function emptyFromDom(empty){
    while (empty.firstChild) {
        empty.removeChild(empty.firstChild);
    }
}

// CARGANDO EL DOM con FRAGMENT y el TEMPLATE DE HTML
function loadDOM(products){
    const productsCatalog = document.getElementById('productsCatalog');
    const templateProduct = document.getElementById('templateProduct').content;
    const fragment = document.createDocumentFragment();
    products.forEach( product => {
        templateProduct.querySelector('.img-a').src= product.img1;
        templateProduct.querySelector('.img-b').src= product.img2;
        templateProduct.querySelector('.img-brand-card').src='img/brands/' + product.brand + '.svg';
        templateProduct.querySelector('.card-title').textContent = product.model;
        templateProduct.querySelector('.price').textContent = '$'+product.price;
        templateProduct.querySelector('.card-body .cart').dataset.id=product.id;
        //LIMPIO PARA NO REPOBLAR
        let empty = templateProduct.querySelector('.dropdown-menu');
        emptyFromDom(empty);
        //END LIMPIO PARA NO REPOBLAR
        product.sizeStock.forEach(element => {
            const dropdownSize = templateProduct.querySelector('.dropdown-menu');
            //CREO EL BOTÓN DE TALLES CON SUS CLASES Y LE AGREGO EL VALOR
            const sizeBtn = document.createElement('button');
            sizeBtn.dataset.id = product.id;
            sizeBtn.classList.add('btn', 'm-1', 'p-0');
            sizeBtn.textContent = element.size;
            if (element.stock === 0){
                sizeBtn.classList.add('btn-outline-secondary');
                sizeBtn.disabled = true;
                dropdownSize.appendChild(sizeBtn);
            }else{
                sizeBtn.classList.add('btn-outline-primary');
                dropdownSize.appendChild(sizeBtn);
            }
        });
        const clone = templateProduct.cloneNode(true);
        fragment.appendChild(clone);
    });
    productsCatalog.appendChild(fragment);
    //AGREGO EVENTOS A LOS BOTONES CREADOS
    selectSizeBtn();
    addCartBtn();
}


let sizeSelected;
let pressedId;
// AGREGA EVENTO A TODOS LOS BOTONES SIZE
function selectSizeBtn(){
    const sizeButton = document.querySelectorAll('.dropdown .dropdown-menu .btn-outline-primary');
    sizeButton.forEach(function(el, key){
        el.addEventListener('click', function () {  
            clickSizeBtn(sizeButton, key, el)
        });
    });
}
// CLICK EN BOTON SIZE
function clickSizeBtn(sizeButton, key, el){
    sizeSelected=parseInt(el.textContent);
    pressedId = el.getAttribute('data-id'); 
    el.classList.toggle("active");
    sizeButton.forEach(function(ell, els){
        if(key !== els) {
            ell.classList.remove('active');
        }
    });
    console.log('Size selected: ' + sizeSelected + '\nID of product: ' + pressedId);
}

// AGREGA EVENTO A TODOS LOS BOTONES ADD TO CART
function addCartBtn(){
    const addCart = document.querySelectorAll('.card-body .cart');
    addCart.forEach(element => {element.addEventListener('click', function() {
        if(sizeSelected === undefined || pressedId != element.getAttribute('data-id')){
            console.log('Seleccione un talle');
        }else{
            fixStock(pressedId, sizeSelected);
        }
    })}); 
}

let findedProduct;
function findTheProduct(id){
    findedProduct = products.find((el)=>el.id == id);
}

let findedSize;
function findTheSize(sizeSelected){
    findedSize = findedProduct.sizeStock.find((el)=>el.size == sizeSelected);
}


function fixStock(id, sizeSelected) {
    findTheProduct(id);
    findTheSize(sizeSelected);
    if ( findedSize.stock > 0){
        findedSize.stock = findedSize.stock - 1;
        let removeActive = document.querySelector('.dropdown-menu .active');
        if(findedSize.stock == 0){
            removeActive.classList.remove('active');
            removeActive.classList.remove('btn-outline-primary');
            removeActive.classList.add('btn-outline-secondary');
            removeActive.disabled = true;
        }
        console.log(findedSize);
        addToCart(id, sizeSelected);
        new bootstrap.Toast(document.querySelector('#basicToast')).show();
        // new bootstrap.Toast(document.querySelector('#sidebarOverlay3')).show();
    }else{
        console.log('No stock of size: ' + findedSize.size);
    }
}
//END ARREGLO STOCK


let cartProducts=[];
//NUMERO DEL CARRITO
function productsQuantityInCart(){
    let cartIconNum = document.querySelector('.fa-shopping-cart .badge');    
    let productsInCart = cartProducts.length;
    cartIconNum.textContent = productsInCart;
}
let productId = 0;
function addToCart(id, sizeSelected){
    let findedProduct = products.find((el)=>el.id == id)
    productId = ++productId;
    let productImg1 = findedProduct.img1;
    let productBrand = findedProduct.brand;
    let productModel = findedProduct.model;
    let productSize = sizeSelected;
    let productPrice = findedProduct.price;
    cartProducts.push({id: productId, originalId: id, img1: productImg1, model: productModel, brand: productBrand, size: productSize, price: productPrice});
    let productInCart = document.getElementById('productsInCart');

    let toastImg = document.getElementById('toastImg');
    toastImg.src=productImg1;
    let toastBrand = document.querySelector('#toastBrand');
    let toastDiv = document.createElement('div');
    emptyFromDom(toastBrand);
    toastDiv.innerHTML=`<h6 class="mt-3"><strong>${productBrand} - ${productModel} - Size: ${productSize}</strong></h6>`
    toastBrand.appendChild(toastDiv);
    
    // Empty productInCart
    emptyFromDom(productInCart);
    productsQuantityInCart();

    for (const index in cartProducts){
        let product = cartProducts[index]
        let createDiv = document.createElement('div');
        createDiv.innerHTML = `
            <div data-id="${product.id}" data-originalId="${product.originalId}" class="d-flex flex-row justify-content-between align-items-center bg-white p-2 mt-4 px-3 rounded text-dark col-12 shadow-sm">
                <div class="mr-1"><img class="rounded" src="${product.img1}" width="70"></div>
                <div class="d-flex flex-column align-items-center product-details">
                    <span class=""><strong>${product.brand} - ${product.model}</strong></span>
                    <span class=""><strong>Size: ${product.size}</strong></span>
                </div>
                <div class="d-flex flex-row align-items-center">
                    <span class="text-dark pointer"><strong>-</strong></span>
                    <span class="text-dark mt-1 ms-3 me-3"><strong>1</strong></span>
                    <span class="text-dark pointer"><strong>+</strong></span>
                </div>
                <div>
                    <span class="text-dark"><strong>$${product.price}</strong></span>
                </div>
                <i data-cartid="${product.id}" class="trash fa fa-trash mb-1 text-dark pointer"></i>
            </div>`;
        productInCart.appendChild(createDiv);   
    }  
    trash();
}
//elimino del array carrito
function cartArrayRemove() { 
    const forIndex = cartProducts.find(el=> el.id)
    const index = cartProducts.indexOf(forIndex);
    cartProducts.splice(index, 1);
    productsQuantityInCart();
}
//Elimino del sidebar
function trash(){
    let trash = document.querySelectorAll('.trash');
    trash.forEach(el => el.addEventListener('click', function(e) { 
        cartArrayRemove();
        this.parentNode.remove();  
    })); 
}






//CART sidebar
let cartIcon = document.getElementById('cartIcon');
cartIcon.addEventListener('click', toggleSidebar);
let overlay2 = document.getElementById('sidebarOverlay2');
overlay2.addEventListener('click', toggleSidebar);
let checkOut = document.getElementById('checkOut');
checkOut.addEventListener('click', toggleSidebar);
let closeSidebar2 = document.getElementById('closeSidebar2');
closeSidebar2.addEventListener('click', toggleSidebar);
function toggleSidebar(e) {
    e.preventDefault();
    let sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('sidebar-off');
    overlay2.classList.toggle('overlay-off');
    document.body.classList.toggle('no-scroll');
};
//FILTER sidebar
let filterBtn = document.getElementById('filterBtn');
filterBtn.addEventListener('click', toggleSidebarFilter);
let closeSidebar1 = document.getElementById('closeSidebar1');
closeSidebar1.addEventListener('click', toggleSidebarFilter);
let overlay1 = document.getElementById('sidebarOverlay1');
overlay1.addEventListener('click', toggleSidebarFilter);
function toggleSidebarFilter(e) {
    e.preventDefault();
    let sidebarFilter = document.getElementById('sidebarFilter');
    sidebarFilter.classList.toggle('sidebar-off');
    overlay1.classList.toggle('overlay-off');
    document.body.classList.toggle('no-scroll');
};

//****FILTROS****
let sortBy = document.getElementById('dropdownMenuButton1');
//ORDENAR POR ID
function sortRecomended(){ 
    console.log('ORDENADO POR RECOMENDADOS ');
    products.sort((a, b) => a.id - b.id)
    // obtainDataAjax(products);
    fetchDataNewProducts(products);
    sortBy.textContent = 'Sort By: Recomended';
};
//ORDENAR POR PRECIO DESCENDENTE
function sortDescending(){ 
    console.log('PRECIO MÁS ALTO PRIMERO AJAX');
    products.sort((a, b) => b.price - a.price)
    // obtainDataAjax(products);
    fetchDataNewProducts(products);
    sortBy.textContent = 'Sort By: High to low';
};
//ORDENAR POR PRECIO ASCENDENTE
function sortAscending(){ 
    console.log('PRECIO MÁS BAJO PRIMERO');
    products.sort((a, b) => a.price - b.price)
    // obtainDataAjax(products);
    fetchDataNewProducts(products);
    sortBy.textContent = 'Sort By: Low to high';
};
//FILTRAR POR RANGO DE PRECIOS

function priceRange(){
    let priceRanges = [];
    let lowRange = parseInt(prompt('Ingrese su precio mínimo'));
    let highRange = parseInt(prompt('Ingrese su precio máximo'));
    console.log('NEW PRICE RANGE');
    priceRanges = products.filter( a => a.price > lowRange && a.price < highRange);
    // obtainDataAjax(priceRanges);
    fetchDataNewProducts(priceRanges);
    sortBy.textContent = 'Sort By: Price Range - $' + lowRange + ' to $' + highRange;
};
//****END FILTROS****
// EVENTOS
//***SORT****
document.getElementById('sortRecomended').addEventListener('click', sortRecomended);
document.getElementById('sortDescending').addEventListener('click', sortDescending);
document.getElementById('sortAscending').addEventListener('click', sortAscending);
//****END SORT****
//****RANGE****
document.getElementById('priceRange').addEventListener('click', priceRange);
//****END RANGE****