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


function obtainData(){
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', './assets/products.json', true);
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
        templateProduct.querySelector('.card-body .cart').dataset.id=product.id;
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



//RELOAD AJAX
function obtainDataAjax(data){
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', '', true);
    xhttp.send();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            let datos = data;
            const productsCatalog = document.getElementById('productsCatalog');
            const templateProduct = document.getElementById('templateProduct').content;
            const fragment = document.createDocumentFragment();
            for(let product of datos){
                templateProduct.querySelector('.img-a').src= product.img1;
                templateProduct.querySelector('.img-b').src= product.img2;
                templateProduct.querySelector('.img-brand-card').src='img/brands/' + product.brand + '.svg';
                templateProduct.querySelector('.card-title').textContent = product.model;
                templateProduct.querySelector('.price').textContent = '$'+ product.price;
                templateProduct.querySelector('.card-body .cart').dataset.id=product.id;
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
                
            }
            productsCatalog.innerHTML = '';
            productsCatalog.appendChild(fragment);
            // loadDOMAjax();
            selectSize()
            addCart()
        }
    }
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
        if(pressedBtn === undefined || pressedId != element.getAttribute('data-id')){
            console.log('Seleccione un talle');
        }else{
            // products[pressedId-1].fixStock(pressedId, pressedBtn);
            fixStock(pressedId, pressedBtn);
        }
    })});
}
//Arreglo stock
let sum = 0;
function fixStock(id, sizeSelected) {
    let findedProduct = products.find((el)=>el.id == id)
    console.log(findedProduct);
    // let restaStock = products[id-1].sizeStock.find((el)=>el.size == sizeSelected);
    let restaStock = findedProduct.sizeStock.find((el)=>el.size == sizeSelected);
    if ( restaStock.stock > 0){
        restaStock.stock = restaStock.stock - 1;
        let removeActive = document.querySelector('.dropdown-menu .active');
        let cartIconNum = document.querySelector('.fa-shopping-cart .badge');
        
        sum = sum + 1;
        cartIconNum.textContent = sum;
        if(restaStock.stock == 0){
            removeActive.classList.remove('active');
            removeActive.classList.remove('btn-outline-primary');
            removeActive.classList.add('btn-outline-secondary');
            removeActive.disabled = true;
        }
        console.log(restaStock);
        addToCart(id, sizeSelected);
        // console.log(products[id-1]);
    }else{
        // products[id-1].inStock = false;s
        
        console.log('No stock of size: ' + restaStock.size);
    }
}
let cartProducts=[];
function addToCart(id, sizeSelected){
    
    let findedProduct = products.find((el)=>el.id == id)
    let productImg1 = findedProduct.img1;
    let productBrand = findedProduct.brand;
    let productModel = findedProduct.model;
    let productSize = sizeSelected;
    let productPrice = findedProduct.price;
    // let element = {};
    // element.id = id;
    // element.quantity = quantity;
    cartProducts.push({img1: productImg1, model: productModel, brand: productBrand, size: productSize, price: productPrice});
    console.log(cartProducts);
    //Agrego como objeto cada producto que agrego.
    //Con un for o foreach voy llenando un innerHTML y le hago el appendchild.
    //Agregar funcionalidad a los botones de agregar cantidad y que si agrego el mismo producto se sume y no ponga otro elemento nuevo del mismo. Si es otro tamaño si es un obj nuevo
    console.log(productImg1);
    // console.log(productBrand);
    // console.log(productModel);
    // console.log(productPrice);

    // let prod = {};
    // prod.img1 = findedProduct.img1;
    // prod.brand = findedProduct.brand;
    // prod.model = findedProduct.model;
    // prod.price = findedProduct.price;
    // cartProducts.push({element: prod});

    let productInCart = document.getElementById('productsInCart');
    productInCart.innerHTML = '';
    for (const index in cartProducts){
        // console.log(cartProducts[product].model)
        let product = cartProducts[index]
        let createDiv = document.createElement('div');
        createDiv.innerHTML = `
            <div class="d-flex flex-row justify-content-between align-items-center bg-white p-2 mt-4 px-3 rounded text-dark col-12 shadow-sm">
                <div class="mr-1"><img class="rounded" src="${product.img1}" width="70"></div>
                <div class="d-flex flex-column align-items-center product-details">
                    <span class=""><strong>${product.brand} - ${product.model}</strong></span>
                    <span class=""><strong>Size: ${product.size}</strong></span>
                </div>
                <div class="d-flex flex-row align-items-center">
                    <span class="text-dark pointer"><strong>-</strong></span>
                    <span class="text-dark mt-1 ms-3 me-3"><strong>2</strong></span>
                    <span class="text-dark pointer"><strong>+</strong></span>
                </div>
                <div>
                    <span class="text-dark"><strong>$${product.price}</strong></span>
                </div>
                <div class="d-flex align-items-center pointer"><i class="fa fa-trash mb-1 text-dark"></i></div>
            </div>
        `;
        productInCart.appendChild(createDiv);
    }
    // cartProducts.forEach( () => {
        
    // });
    
    
}


















//****FILTROS****
//ORDENAR POR ID
function sortRecomended(){ 
    console.log('ORDENADO POR RECOMENDADOS');
    products.sort((a, b) => a.id - b.id)
    obtainDataAjax(products);
};
//ORDENAR POR PRECIO DESCENDENTE
function sortDescending(){ 
    console.log('PRECIO MÁS ALTO PRIMERO AJAX');
    products.sort((a, b) => b.price - a.price)
    obtainDataAjax(products);
};
//ORDENAR POR PRECIO ASCENDENTE
function sortAscending(){ 
    console.log('PRECIO MÁS BAJO PRIMERO');
    products.sort((a, b) => a.price - b.price)
    obtainDataAjax(products);
};
//FILTRAR POR RANGO DE PRECIOS
let priceRanges = [];
function priceRange(){
    let lowRange = parseInt(prompt('Ingrese su precio mínimo'));
    let highRange = parseInt(prompt('Ingrese su precio máximo'));
    console.log('NEW PRICE RANGE');
    priceRanges = products.filter( a => a.price > lowRange && a.price < highRange);
    // products = priceRanges;
    console.log(priceRanges);
    obtainDataAjax(priceRanges);
};
//****END FILTROS****
// EVENTOS
//***SORT****
document.getElementById('sortRecomended').addEventListener('click', function() {
    sortRecomended();
    console.log(products);
});
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
    console.log(priceRanges);
    priceRange();
    // console.log(priceRanges);
});
//****END RANGE****


