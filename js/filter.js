import { products, checkeSizedArray, checkedBrandArray, lowRange, highRange } from './main.js';
import { fetchDataProducts } from './addDOM.js';

export let filteredProducts = [];
let newArray = [];
let newArray2 = [];
const sortBy = document.getElementById('dropdownMenuButtonSort');
export function asignFilteredProduct() {
	filteredProducts = products;
}
//ORDENAR POR ID (RECOMENDADOS)
export function sortRecomended() {
	console.log(filteredProducts);
	filteredProducts.sort((a, b) => a.id - b.id);
	fetchDataProducts(filteredProducts);
	sortBy.textContent = 'Sort By: Recomended';
}

//ORDENAR POR PRECIO ASCENDENTE
export function sortAscending() {
	console.log(filteredProducts);
	filteredProducts.sort((a, b) => a.price - b.price);
	fetchDataProducts(filteredProducts);
	sortBy.textContent = 'Sort By: Low to high';
	console.log(filteredProducts);
}

//ORDENAR POR PRECIO DESCENDENTE
export function sortDescending() {
	console.log(filteredProducts);
	filteredProducts.sort((a, b) => b.price - a.price);
	fetchDataProducts(filteredProducts);
	sortBy.textContent = 'Sort By: High to low';
}

//Function Toggle clases del sidebar para mostrarlo. Se eliminan las clases y aparecen y se cancela el scroll.
export function toggleSidebars(sidebar, overlay) {
	const sidebarInDOM = document.getElementById(sidebar);
	sidebarInDOM.classList.toggle('sidebar-off');
	overlay.classList.toggle('overlay-off');
	document.body.classList.toggle('no-scroll');
}

//Funcion de Filtros
export function filterArray() {
	// filteredProducts = [];
	newArray = [];

	// SI ALGÚN CHECKBOX DE FILTER BY SIZE ESTÁ ACTIVO
	if (checkeSizedArray.length > 0) {
		checkeSizedArray.forEach((el) => {
			filteredProducts.push.apply(
				newArray,
				products.filter((product) => product.sizeStock.some((element) => element.size == el))
			);
		});
		filteredProducts = [...new Set(newArray)];
		// SI NO HAY CHECKBOX DE FILTER BY SIZE ACTIVO
	} else {
		filteredProducts = products;
	}

	if (checkedBrandArray.length > 0) {
		newArray2 = [];
		checkedBrandArray.forEach((el) => {
			filteredProducts.push.apply(
				newArray2,
				filteredProducts.filter((a) => a.brand === el)
			);
		});
		filteredProducts = [...new Set(newArray2)];
	}

	//filter by price range
	filteredProducts = filteredProducts.filter((a) => a.price > lowRange && a.price < highRange);

	//Sort by after filter applyed
	if (sortBy.textContent == 'Sort By: Recomended' && filteredProducts.length > 0) {
		sortRecomended();
	} else if (sortBy.textContent == 'Sort By: High to low' && filteredProducts.length > 0) {
		sortDescending();
	} else if (sortBy.textContent == 'Sort By: Low to high' && filteredProducts.length > 0) {
		sortAscending();
	} else {
		$('#productsCatalog').empty().append('<h3 class="text-uppercase text-center mt-5">ZERO RESULTS TO SHOW, please filter again</h3>');
	}

	//SHOW HIDE FILTER BY:
	if (checkedBrandArray.length > 0 || checkeSizedArray.length > 0) {
		$('#filtersData').slideDown();
	} else {
		$('#filtersData').slideUp();
	}
}
