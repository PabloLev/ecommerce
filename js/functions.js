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
export function fixStock(id, sizeSelected) {
    let findProduct = products.find((el)=>el.id == id)
    console.log(findProduct);
    // let restaStock = products[id-1].sizeStock.find((el)=>el.size == sizeSelected);
    let restaStock = findProduct.sizeStock.find((el)=>el.size == sizeSelected);
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
        // console.log(products[id-1]);
    }else{
        // products[id-1].inStock = false;s
        
        console.log('No stock of size: ' + restaStock.size);
    }
}
function addToCart(){

}