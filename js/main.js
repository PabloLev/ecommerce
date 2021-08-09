//MANEJO Y VENTA DE CALZADOS: Se calcula monto a pagar y se actualiza el stock de la tienda.
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
//END CLASE CONSTRUCTORA Producto

// CARGANDO EL DOM con FRAGMENT y el TEMPLATE DE HTML
function loadDOM(){
    const productsCatalog = document.getElementById('productsCatalog');
    const templateProduct = document.getElementById('templateProduct').content;
    const fragment = document.createDocumentFragment();
    products.forEach( product => {
        templateProduct.querySelector('.img-a').src= product.img1;
        templateProduct.querySelector('.img-b').src= product.img2;
        templateProduct.querySelector('.img-brand-card').src='img/brands/' + product.brand + '.svg';
        templateProduct.querySelector('.card-title').textContent = product.model;
        templateProduct.querySelector('.price').textContent = '$'+product.price;
        //LIMPIO PARA NO REPOBLAR
        let empty = templateProduct.querySelector('.dropdown-menu');
        while (empty.firstChild) {
            empty.removeChild(empty.firstChild);
        }
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
}
// CLICK EN BOTON SIZE
let pressedBtn;
let pressedId;
function selectSize(){
    const selectedSize = document.querySelectorAll('.btn-outline-primary');
    selectedSize.forEach(function(el, key){
        el.addEventListener('click', function () {  
            pressedBtn=parseInt(el.textContent);
            pressedId = el.getAttribute('data-id');
            
            el.classList.toggle("active");
            selectedSize.forEach(function(ell, els){
                if(key !== els) {
                    ell.classList.remove('active');
                }
            });
            console.log('Size selected: ' + pressedBtn + '\nID of product: ' + pressedId);
        });
    });
    
}
// CLICK EN BOTON ADD CARRITO
function addCart(){
    const addCart = document.querySelectorAll('.card-body .cart');
    addCart.forEach(element => {element.addEventListener('click', function() {
        if(pressedBtn === undefined){
            console.log('Seleccione un talle');
        }else{
            console.log('id' + pressedId +" - " + pressedBtn);
            // products[pressedId-1].fixStock(pressedId, pressedBtn);
            fixStock(pressedId, pressedBtn);
        }
    })});
}


//BASE DE DATOS SIMULADA en array de objetos productos.
const products = [];

function obtainData(){
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', '../assets/products.json', true);
    xhttp.send();
    xhttp.onreadystatechange = function(){

        if(this.readyState == 4 && this.status == 200){
            let datos = JSON.parse(this.responseText);
            // console.log(datos);
            for(let item of datos){
                products.push(new Product(item.id, item.category, item.gender, item.brand, item.model, item.color, item.price, item.sizeStock));     
            }
            loadDOM();
            selectSize()
            addCart()
        }
    }
}
obtainData();


// FUNCIONES CLACULOS
// DESCUENTA STOCK POR CADA COMPRA
function fixStock(id, sizeSelected) {
    console.log(id);
    let restaStock = products[id-1].sizeStock.find((el)=>el.size == sizeSelected);

    if ( restaStock.stock > 0){
        restaStock.stock = restaStock.stock - 1;
        let cartIconNum = document.querySelector('.fa-shopping-cart span');
        cartIconNum.textContent = parseInt(cartIconNum.textContent) + 1;
        let removeActive = document.querySelector('.dropdown-menu .active');
        if(cartIconNum.classList.contains('active')){
            removeActive.classList.remove('active');
        }
        removeActive.classList.remove('btn-outline-primary');
        removeActive.classList.add('btn-outline-secondary');
        removeActive.disabled = true;
        console.log(restaStock);
        console.log(products[id-1]);
    }else{
        // products[id-1].inStock = false;
        console.log('No stock of size: ' + restaStock.size);
    }
}

//****FILTROS****
//ORDENAR POR PRECIO DESCENDENTE
function sortDescending(){ 
    console.log('PRECIO MÁS ALTO PRIMERO');
    products.sort((a, b) => b.price - a.price)
};
//ORDENAR POR PRECIO ASCENDENTE
function sortAscending(){ 
    console.log('PRECIO MÁS BAJO PRIMERO');
    products.sort((a, b) => a.price - b.price)
};
//FILTRAR POR RANGO DE PRECIOS
let priceRanges = [];
function priceRange(){ 
    let lowRange = parseInt(prompt('Ingrese su precio mínimo'));
    let highRange = parseInt(prompt('Ingrese su precio máximo'));
    console.log('NEW PRICE RANGE');
    priceRanges = products.filter( a => a.price > lowRange && a.price < highRange);
};
//****END FILTROS****
// EVENTOS
//***SORT****
document.getElementById('sortDescending').addEventListener('click', function() {
    sortDescending();
    console.log(products);
});
document.getElementById('sortAscending').addEventListener('click', function() {
    sortAscending();
    console.log(products);
});
//****END SORT****
//****RANGE****
document.getElementById('priceRange').addEventListener('click', function() {
    priceRange();
    console.log(priceRanges);
});
//****END RANGE****
