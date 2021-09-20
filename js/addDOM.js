import { Product } from './Product.js';
import { genderSelected } from './main.js';
import { eventsToButtons } from './addEvents.js';
import { asignFilteredProduct } from './filter.js';

let increment = -1;
//Cargo el home
export function loadDOMHome() {
	$('#productsCatalog').empty();
	$('#filterNavBar').hide();
	$('#productsCatalog').append(`
        <div class="container">
            <div class="row mt-5">
                <div class="col-12 col-md-4 p-3">
                    <div class="style-img1 style-img p-3">
                        <h5 id="womanBtn" class="text-uppercase text-white bg-primary d-inline-block p-2 pointer">best for woman</h5>
                    </div>
                </div>
                <div class="col-12 col-md-4 p-3">
                    <div class="style-img2 style-img p-3">
                        <h5 id="kidsBtn" class="text-uppercase text-white bg-primary d-inline-block p-2 pointer">best for kids</h5>
                    </div>
                </div>
                <div class="col-12 col-md-4 p-3">
                    <div class="style-img3 style-img p-3">
                        <h5 id="manBtn" class="text-uppercase text-white bg-primary d-inline-block p-2 pointer">best for man</h5>
                    </div>
                </div>

                <div class="d-flex bd-highlight">
                    <div class="flex-fill bd-highlight">
                        <h3 class="text-center mt-5 text-primary fw-bold bg-mark p-2">ALL BRANDS IN ONE PLACE</h3>
                    </div>
                    <div class="flex-fill bd-highlight">
                        <h3 class="text-center mt-5 fw-bold bg-primary text-mark p-2">AT THE BEST PRIES IN THE HOLE WORLD!!!</h3>
                    </div>
                </div>

                <div class="col-12 col-md-6 col-lg-9 p-3 zzz">
                    <div class="promo-img1 promo-img p-3">
                        <h3 class="text-uppercase text-white text-shadow-lg d-inline-block p-2 fw-bold">BESTS DISCOUNTS</h3>
                    </div>
                </div>
                <div class="col-12 col-md-6 col-lg-3 p-3">
                    <div class="promo-img2 promo-img p-3 d-flex align-items-end justify-content-center">
                        <h5 class="text-uppercase text-white text-shadow-primary d-inline-block p-2 fw-bold">YOUR OWN STYLE</h5>
                    </div>
                </div>
                <div class="col-12 p-3 mt-5">
                    <div class="banner-img1 promo-img p-3 d-flex justify-content-center align-items-center">
                        <h2 class="text-uppercase text-white text-shadow-lg p-2">It is time to rock!!!</h2>
                    </div>
                </div>
            </div>
        </div>
        
            
        `);
}
loadDOMHome();

// LOAD DOM JQUERY (Se usa al cargar el archivo JSON con los productos y cada vez que se quiere filtrar)
export function loadDOMJquery(products) {
	//muestro el filterNavBar
	$('#filterNavBar').show();
	if (genderSelected != 'ALL') {
		products = products.filter((e) => e.gender == genderSelected);
	}

	//Recorro el Array products en el primer nivel.
	$('#productsCatalog').empty();
	for (const product of products) {
		$('#productsCatalog').append(`
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
		$.each(product.sizeStock, function (element, value) {
			const dropdownSize = $('#dropdownMenuButton' + product.id);
			increment = increment + 1;

			//CREO EL BOTÓN DE TALLES CON SUS CLASES Y LE AGREGO EL VALOR
			const sizeBtn = $('<button></button>');
			sizeBtn.addClass('btn', 'm-1', 'p-0');
			sizeBtn.text(value.size);
			sizeBtn.attr('data-id', product.id);

			//En caso de no haber stock del talle inhabilito el botón.
			if (value.stock === 0) {
				sizeBtn.addClass('btn-outline-secondary');
				sizeBtn.prop('disabled', true);
				dropdownSize.append(sizeBtn);
			} else {
				sizeBtn.addClass('btn-outline-primary');
				dropdownSize.append(sizeBtn);
				sizeBtn.attr('data-btn', increment);
			}
		});
	}
	$('#filterArticles').text(products.length + ' articles');
}

//CREO "BASE DE DATOS con FETCH"
export const fetchDataProducts = async (products) => {
	try {
		if (products.length === 0) {
			console.log('load JSON');
			//Cargo el JSON
			const res = await fetch('./assets/products.json');
			const response = await res.json();
			//Pueblo el array products
			for (let item of response) {
				products.push(new Product(item.id, item.category, item.gender, item.brand, item.model, item.color, item.price, item.sizeStock));
			}
			eventsToButtons();
			asignFilteredProduct();
		} else {
			console.log('JQUERY');
			$('#productsCatalog').fadeOut(150, function () {
				$(this).empty().fadeIn(150, loadDOMJquery(products));
			});
		}
		loadDOMJquery(products);
	} catch (error) {
		console.log(error);
	}
};
