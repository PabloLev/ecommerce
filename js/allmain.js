
document.addEventListener('DOMContentLoaded', () => {
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

            //SizeStock es un array, para poder manejar el stock por cada talle pero seguir manejandolo como un único objeto (Definido conceptualmente por marca y modelo)
            this.sizeStock = sizeStock;

            //Mantengo una nomeclatura al guardar imagenes. Si se respeta la estructura y nomeclatura funciona de manera dinamica.
            this.imgA = 'img/' + this.gender.toLowerCase() + '/' + this.brand.toLowerCase() + '/' + this.id + '_' + this.brand.toLowerCase() + '_' + this.model.toLowerCase() + '_' + this.color.toLowerCase() + '_a.webp';
            this.imgB = 'img/' + this.gender.toLowerCase() + '/' + this.brand.toLowerCase() + '/' + this.id + '_' + this.brand.toLowerCase() + '_' + this.model.toLowerCase() + '_' + this.color.toLowerCase() + '_b.webp';
            this.inStock = true;
            this.promotion = false;
        }
    }
    //Declaro Array products se puebla en fetchDataProducts linea 88 (pudo haber cambiado, capaz que me olvidé de actualizar, jeje)
    const products = [];

    //METODO LIMPIO EL DOM - PARA EVITAR SUMATORIA DE ELEMENTOS CUANDO SE PUEBLA
    function emptyFromDom(empty){
        while (empty.firstChild) {
            empty.removeChild(empty.firstChild);
        }
    }

    //*****JQUERY */
    // LOAD DOM JQUERY (Se usa al cargar el archivo JSON con los productos y cada vez que se quiere filtrar)
    function loadDOMJquery(products){
        //Recorro el Array products en el primer nivel.
        for (const product of products){
            $("#productsCatalog").append(`
                <article class="card col-6 col-md-4 col-lg-3 text-center border-0 p-3">
                    <div class="img-wrapper position-relative p-1 d-flex justify-content-end" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-placement="bottom" data-bs-content="More info">
                        <img src="${product.imgA}" class="img-a card-img-top" alt="${product.brand}-${product.model}">
                        <img src="${product.imgB}" class="img-b card-img-top position-absolute p-1" alt="${product.brand}-${product.model}">
                    </div>
                    <div class="card-body">
                        <img src='img/brands/${product.brand}.svg' class="img-brand-card" alt="${product.brand}">
                        <p class="card-title text-uppercase fw-bold">${product.model}</p>
                        <span class="price card-text fs-5 text-dark">$${product.price}</span>
                        <div class="dropdown">
                            <button class="btn dropdown-toggle mb-4" type="button" data-bs-toggle="dropdown" aria-expanded="false">Chose Size</button>
                            <ul id="dropdownMenuButton${product.id}" class="dropdown-menu" aria-labelledby="dropdownMenuButton"></ul>
                        </div>
                        <!-- <i class="fas fa-shopping-cart cart text-primary fs-3 pointer p-3"></i> -->
                        <button type="button" class="cart btn container-fluid btn-primary py-2" data-id="${product.id}">Add to Cart<i class="fas fa-shopping-cart ms-3"></i></button>
                    </div>
                </article>
                
            `);

            //Recorro el Array sizeStock dentro del array products (segundo nivel). Agrega botones en el dropdown Size. Agrega los talles de cada modelo.
            $.each(product.sizeStock, function(element, value) {
                const dropdownSize = $('#dropdownMenuButton'+ product.id);

                //CREO EL BOTÓN DE TALLES CON SUS CLASES Y LE AGREGO EL VALOR
                const sizeBtn = $('<button></button>')
                sizeBtn.addClass('btn', 'm-1', 'p-0');
                sizeBtn.text(value.size);
                sizeBtn.attr("data-id", product.id);

                //En caso de no haber stock del talle inhabilito el botón.
                if (value.stock === 0){
                    sizeBtn.addClass('btn-outline-secondary');
                    sizeBtn.prop('disabled', true);
                    dropdownSize.append(sizeBtn);
                }else{
                    sizeBtn.addClass('btn-outline-primary');
                    dropdownSize.append(sizeBtn);
                }
            });
        };
        eventToSizeBtn();
        addCartBtn();
    }

    //CREO "BASE DE DATOS con FETCH"
    const fetchDataProducts = async (products) => {
        try {
            if (products.length === 0){

                //Cargo el JSON
                const res = await fetch('./assets/products.json');
                const response = await res.json();

                //Pueblo el array products 
                for(let item of response){
                    products.push(new Product(item.id, item.category, item.gender, item.brand, item.model, item.color, item.price, item.sizeStock));     
                }
            }else{
                $("#productsCatalog").fadeOut(150, function(){
                    $(this).empty().fadeIn(150, loadDOMJquery(products));
                });
            }
            loadDOMJquery(products);
        } catch (error) {
            console.log(error);
        }
    }
    fetchDataProducts(products);

    // CLICK EN BOTON SIZE (Dentro de los dropdown, cualquier botón de talles)
    let sizeSelected;
    let pressedId;
    function clickSizeBtn(sizeButton, key, btn){  
        sizeSelected=parseInt(btn.textContent);
        pressedId = btn.getAttribute('data-id'); 
        btn.classList.toggle("active");
        sizeButton.forEach(function(ell, els){
            if(key !== els) {
                ell.classList.remove('active');
            }
        });
        console.log('Size selected: ' + sizeSelected + '\nID of product: ' + pressedId);
        return;
    }

    // AGREGA EVENTO A TODOS LOS BOTONES SIZE (Dentro de los dropdown, cualquier botón de talles)
    function eventToSizeBtn(){
        const sizeButton = document.querySelectorAll('.dropdown .dropdown-menu .btn-outline-primary');
        sizeButton.forEach(function(btn, key){
            btn.addEventListener('click', function () {  
                clickSizeBtn(sizeButton, key, btn)
            });
        });
        return;
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
        return;
    }

    //Encuentra el producto con ese ID
    let findedProduct;
    function findTheProduct(id){
        return findedProduct = products.find((el)=>el.id == id);
    }

    //Encuentra el producto con ese Talle
    let findedSize;
    function findTheSize(sizeSelected){
        return findedSize = findedProduct.sizeStock.find((el)=>el.size == sizeSelected);
    }

    //Arregla el stock luego de agregado el producto al carrito, resta el stock del talle
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

            //Llamo a la función que agrega al carrito.
            addToCart(id, sizeSelected);

            //Despliego el Toast de bootstrap que pregunta si se sigue comprando
            new bootstrap.Toast(document.querySelector('#basicToast')).show();
        }else{
            console.log('No stock of size: ' + findedSize.size);
        }
        return;
    }

    //NUMERO DEL ICONO CARRITO
    let cartProducts=[];
    function productsQuantityInCart(){
        let cartIconNum = document.querySelector('.fa-shopping-cart .badge');    
        cartIconNum.textContent = cartProducts.length;
        return;
    }
    
    //Esta funcion agrega los productos al carrito
    let productId = 0;
    function addToCart(id, sizeSelected){

        //Filtro products y creo nuevo array findedProduct
        const findedProduct = products.find((el)=>el.id == id)
        productId = ++productId;
        cartProducts.push({id: productId, originalId: id, imgA: findedProduct.imgA, model: findedProduct.model, brand: findedProduct.brand, size: sizeSelected, price: findedProduct.price});
        let productInCart = document.getElementById('productsInCart');
        let toastImg = document.getElementById('toastImg');
        toastImg.src=findedProduct.imgA;
        let toastBrand = document.querySelector('#toastBrand');
        let toastDiv = document.createElement('div');
        emptyFromDom(toastBrand);
        toastDiv.innerHTML=`<h6 class="mt-3"><strong>${findedProduct.brand} - ${findedProduct.model} - Size: ${sizeSelected}</strong></h6>`
        toastBrand.appendChild(toastDiv);
        
        // Empty productInCart
        emptyFromDom(productInCart);

        productsQuantityInCart();
        for (const index in cartProducts){
            let product = cartProducts[index]
            let createDiv = document.createElement('div');
            createDiv.innerHTML = `
                <div data-id="${product.id}" data-originalId="${product.originalId}" class="d-flex flex-row justify-content-between align-items-center bg-white p-2 mt-4 px-3 rounded text-dark col-12 shadow-sm">
                    <div class="mr-1"><img class="rounded" src="${product.imgA}" width="70"></div>
                    <div class="d-flex flex-column align-items-center product-details">
                        <span class=""><strong>${product.brand} - ${product.model}</strong></span>
                        <span class=""><strong>Size: ${product.size}</strong></span>
                    </div>
                    
                    <div>
                        <span class="text-dark"><strong>$${product.price}</strong></span>
                    </div>
                    <i data-cartid="${product.id}" class="trash fa fa-trash mb-1 text-dark pointer"></i>
                </div>`;
            productInCart.appendChild(createDiv);   
        }  
        trash();
        return;
    }

    //elimino del array carrito
    function cartArrayRemove() { 
        const forIndex = cartProducts.find(el=> el.id)
        const index = cartProducts.indexOf(forIndex);
        cartProducts.splice(index, 1);
        productsQuantityInCart();
        return;
    }

    //Elimino del sidebar
    function trash(){
        let trash = document.querySelectorAll('.trash');
        trash.forEach(el => el.addEventListener('click', function(e) { 
            cartArrayRemove();
            this.parentNode.remove();  
        })); 
        return;
    }

    //FILTER sidebar
    let overlay1 = document.getElementById('sidebarOverlay1');
    overlay1.addEventListener('click', function() {toggleSidebars('sidebarFilter', overlay1)});
    let filterBtn = document.getElementById('filterBtn');
    filterBtn.addEventListener('click', function() {toggleSidebars('sidebarFilter', overlay1)});
    let closeSidebar1 = document.getElementById('closeSidebar1');
    closeSidebar1.addEventListener('click', function() {toggleSidebars('sidebarFilter', overlay1)});

    //CART sidebar
    let overlay2 = document.getElementById('sidebarOverlay2');
    overlay2.addEventListener('click', function() {toggleSidebars('sidebar', overlay2)});
    let cartIcon = document.getElementById('cartIcon');
    cartIcon.addEventListener('click', function() {toggleSidebars('sidebar', overlay2)});
    let checkOut = document.getElementById('checkOut');
    checkOut.addEventListener('click', function() {toggleSidebars('sidebar', overlay2)});
    let closeSidebar2 = document.getElementById('closeSidebar2');
    closeSidebar2.addEventListener('click', function() {toggleSidebars('sidebar', overlay2)});
    
    //Function Toggle clases del sidebar para mostrarlo. Se eliminan las clases y aparecen y se cancela el scroll.
    function toggleSidebars(sidebar, overlay) {
        let sidebarInDOM = document.getElementById(sidebar);
        sidebarInDOM.classList.toggle('sidebar-off');
        overlay.classList.toggle('overlay-off');
        document.body.classList.toggle('no-scroll');
    };

    //****FILTRADO (SORT BY:)****
    //ORDENAR POR ID (RECOMENDADOS)
    let sortBy = document.getElementById('dropdownMenuButtonSort');
    function sortRecomended(){ 
        console.log('ORDENADO POR RECOMENDADOS ');
        products.sort((a, b) => a.id - b.id)
        fetchDataProducts(products);
        sortBy.textContent = 'Sort By: Recomended';
        return;
    };

    //ORDENAR POR PRECIO DESCENDENTE
    function sortDescending(){ 
        console.log('PRECIO MÁS ALTO PRIMERO AJAX');
        products.sort((a, b) => b.price - a.price)
        fetchDataProducts(products);
        sortBy.textContent = 'Sort By: High to low';
        return;
    };

    //ORDENAR POR PRECIO ASCENDENTE
    function sortAscending(){ 
        console.log('PRECIO MÁS BAJO PRIMERO');
        products.sort((a, b) => a.price - b.price)
        fetchDataProducts(products);
        sortBy.textContent = 'Sort By: Low to high';
        return;
    };

    //FILTRAR POR RANGO DE PRECIOS
    function priceRange(){
        let priceRanges = [];
        let lowRange = parseInt(prompt('Ingrese su precio mínimo'));
        let highRange = parseInt(prompt('Ingrese su precio máximo'));
        console.log('NEW PRICE RANGE');
        priceRanges = products.filter( a => a.price > lowRange && a.price < highRange);
        fetchDataProducts(priceRanges);
        sortBy.textContent = 'Sort By: Price Range - $' + lowRange + ' to $' + highRange;
        return;
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
});