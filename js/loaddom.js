import {products} from "./product.js";
// CARGANDO EL DOM con FRAGMENT y el TEMPLATE DE HTML
export function loadDOM(){
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


