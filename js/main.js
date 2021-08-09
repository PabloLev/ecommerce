//MANEJO Y VENTA DE CALZADOS: Se calcula monto a pagar y se actualiza el stock de la tienda.
import { Product, products } from "./product.js";
import { loadDOM } from "./loaddom.js";
import { selectSize, addCart } from "./functions.js";

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
