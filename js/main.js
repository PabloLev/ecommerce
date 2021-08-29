// //MANEJO Y VENTA DE CALZADOS: Se calcula monto a pagar y se actualiza el stock de la tienda.
// import { Product, products } from "./product.js";
// import { loadDOM } from "./loaddom.js";
// import { selectSize, addCart } from "./functions.js";

// function obtainData(){
//     const xhttp = new XMLHttpRequest();
//     xhttp.open('GET', './assets/products.json', true);
//     xhttp.send();
//     xhttp.onreadystatechange = function(){
//         if(this.readyState == 4 && this.status == 200){
//             let datos = JSON.parse(this.responseText);
//             // console.log(datos);
//             for(let item of datos){
//                 products.push(new Product(item.id, item.category, item.gender, item.brand, item.model, item.color, item.price, item.sizeStock));     
//             }
//             loadDOM();
//             selectSize()
//             addCart()
//         }
//     }
// }
// obtainData();

// //****FILTROS****
// //ORDENAR POR ID
// function sortRecomended(){ 
//     console.log('ORDENADO POR RECOMENDADOS');
//     products.sort((a, b) => a.id - b.id)
//     obtainDataAjax(products);
// };
// //ORDENAR POR PRECIO DESCENDENTE
// function sortDescending(){ 
//     console.log('PRECIO MÁS ALTO PRIMERO AJAX');
//     products.sort((a, b) => b.price - a.price)
//     obtainDataAjax(products);
// };
// //ORDENAR POR PRECIO ASCENDENTE
// function sortAscending(){ 
//     console.log('PRECIO MÁS BAJO PRIMERO');
//     products.sort((a, b) => a.price - b.price)
//     obtainDataAjax(products);
// };
// //FILTRAR POR RANGO DE PRECIOS
// let priceRanges = [];
// function priceRange(){
//     let lowRange = parseInt(prompt('Ingrese su precio mínimo'));
//     let highRange = parseInt(prompt('Ingrese su precio máximo'));
//     console.log('NEW PRICE RANGE');
//     priceRanges = products.filter( a => a.price > lowRange && a.price < highRange);
//     // products = priceRanges;
//     console.log(priceRanges);
//     obtainDataAjax(priceRanges);
// };
// //****END FILTROS****
// // EVENTOS
// //***SORT****
// document.getElementById('sortRecomended').addEventListener('click', function() {
//     sortRecomended();
//     console.log(products);
// });
// document.getElementById('sortDescending').addEventListener('click', function() {
//     sortDescending();
//     console.log(products);
// });
// document.getElementById('sortAscending').addEventListener('click', function() {
//     sortAscending();
//     console.log(products);
// });
// //****END SORT****
// //****RANGE****
// document.getElementById('priceRange').addEventListener('click', function() {
//     console.log(priceRanges);
//     priceRange();
//     // console.log(priceRanges);
// });
// //****END RANGE****


// function obtainDataAjax(data){
//     const xhttp = new XMLHttpRequest();
//     xhttp.open('GET', '', true);
//     xhttp.send();
//     xhttp.onreadystatechange = function(){
//         if(this.readyState == 4 && this.status == 200){
//             let datos = data;
//             const productsCatalog = document.getElementById('productsCatalog');
//             const templateProduct = document.getElementById('templateProduct').content;
//             const fragment = document.createDocumentFragment();
//             for(let product of datos){
//                 templateProduct.querySelector('.img-a').src= product.img1;
//                 templateProduct.querySelector('.img-b').src= product.img2;
//                 templateProduct.querySelector('.img-brand-card').src='img/brands/' + product.brand + '.svg';
//                 templateProduct.querySelector('.card-title').textContent = product.model;
//                 templateProduct.querySelector('.price').textContent = '$'+ product.price;
//                 templateProduct.querySelector('.card-body .cart').dataset.id=product.id;
//                 //LIMPIO PARA NO REPOBLAR
//                 let empty = templateProduct.querySelector('.dropdown-menu');
//                 while (empty.firstChild) {
//                     empty.removeChild(empty.firstChild);
//                 }
//                 //END LIMPIO PARA NO REPOBLAR
//                 product.sizeStock.forEach(element => {
//                     const dropdownSize = templateProduct.querySelector('.dropdown-menu');
//                     //CREO EL BOTÓN DE TALLES CON SUS CLASES Y LE AGREGO EL VALOR
//                     const sizeBtn = document.createElement('button');
//                     sizeBtn.dataset.id = product.id;
//                     sizeBtn.classList.add('btn', 'm-1', 'p-0');
//                     sizeBtn.textContent = element.size;
//                     if (element.stock === 0){
//                         sizeBtn.classList.add('btn-outline-secondary');
//                         sizeBtn.disabled = true;
//                         dropdownSize.appendChild(sizeBtn);
//                     }else{
//                         sizeBtn.classList.add('btn-outline-primary');
//                         dropdownSize.appendChild(sizeBtn);
//                     }
                    
//                 }); 
//                 const clone = templateProduct.cloneNode(true);
//                 fragment.appendChild(clone); 
                
//             }
//             productsCatalog.innerHTML = '';
//             productsCatalog.appendChild(fragment);
//             // loadDOMAjax();
//             selectSize()
//             addCart()
//         }
//     }
// }

