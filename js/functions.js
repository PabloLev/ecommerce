// DESCUENTA STOCK POR CADA COMPRA
import {products} from "./product.js";
// CLICK EN BOTON SIZE
let pressedBtn;
let pressedId;
export function selectSize(){
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
export function addCart(){
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

export function fixStock(id, sizeSelected) {
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