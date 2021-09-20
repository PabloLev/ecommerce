import { emptyFromDom } from './generalFunctions.js';
import { loadDOMHome, fetchDataProducts } from './addDOM.js';
import { sortRecomended, sortDescending, sortAscending, filterArray } from './filter.js';

//VARIABLES
export let products = [];
export let cartProducts = [];

//----//

export let genderSelected = 'ALL';

export let checkedBrandArray = [];
export let checkeSizedArray = [];
export let lowRange = 0;
export let highRange = 9999999;
//--//
const navBarData = document.getElementById('navbarSupportedContent');
const finishBtn = document.getElementById('finish');

const filters = document.getElementById('sidebarFilter');
const filtersData = document.getElementById('filtersData');
const sortRecomendedEl = document.getElementById('sortRecomended');
const sortDescendingEl = document.getElementById('sortDescending');
const sortAscendingEl = document.getElementById('sortAscending');
const overlay1 = document.getElementById('sidebarOverlay1');
const filterBtn = document.getElementById('filterBtn');
const closeSidebar1 = document.getElementById('closeSidebar1');
const applyFilter = document.getElementById('applyFilters');
const overlay2 = document.getElementById('sidebarOverlay2');
const cartIcon = document.getElementById('cartIcon');
const cartIconMobile = document.getElementById('cartIconMobile');
const checkOut = document.getElementById('checkOut');
const closeSidebar2 = document.getElementById('closeSidebar2');
const womanBtn = document.getElementById('womanBtn');
const kidsBtn = document.getElementById('kidsBtn');
const manBtn = document.getElementById('manBtn');

document.addEventListener('DOMContentLoaded', () => {
	//Agrga active class al navbar
	$('.navbar-nav a').on('click', function () {
		$('.navbar-nav').find('.active').removeClass('active');
		$(this).addClass('active');
	});

	// Agrego eventListeners a los botones del navbar
	navBarData.addEventListener('click', (e) => {
		if (e.target && e.target.classList.contains('active') && e.target.textContent.toUpperCase() !== 'HOME') {
			genderSelected = e.target.textContent.toUpperCase();
			fetchDataProducts(products);
		} else if (e.target && e.target.classList.contains('active') && e.target.textContent.toUpperCase() === 'HOME') {
			loadDOMHome();
		}
	});

	womanBtn.addEventListener('click', (e) => {
		genderSelected = 'WOMAN';
		products = products.filter((e) => e.gender == genderSelected);
		fetchDataProducts(products);
	});

	kidsBtn.addEventListener('click', (e) => {
		genderSelected = 'KIDS';
		products = products.filter((e) => e.gender == genderSelected);
		fetchDataProducts(products);
	});

	manBtn.addEventListener('click', (e) => {
		genderSelected = 'MAN';
		products = products.filter((e) => e.gender == genderSelected);
		fetchDataProducts(products);
	});

	finishBtn.addEventListener('click', (e) => {
		finishBuy();
		cartProducts = [];
		productsQuantityInCart();
		const productInCart = document.getElementById('productsInCart');
		emptyFromDom(productInCart);
		payment();
		enableFinishBtn();
	});

	// FILTERS
	filters.addEventListener('click', (e) => {
		if (e.target.checked && e.target.getAttribute('data-value')) {
			//Add to checkeSizedArray
			let sizeVal = e.target.getAttribute('data-value');
			checkeSizedArray.push(sizeVal);
			filterArray();
			$('#filtersData').append(
				`<span data-value="${sizeVal}" class="d-inline-block m-1 border border-secondary pe-2 ps-2 pointer text-gray fw-light rounded">Size ${sizeVal} X</span>`
			);
		}
		if (!e.target.checked && e.target.getAttribute('data-value')) {
			let checkboxClicked = e.target.getAttribute('data-value');
			let index = checkeSizedArray.indexOf(checkboxClicked);
			//Remove from checkeSizedArray
			if (index !== -1) {
				checkeSizedArray.splice(index, 1);
			}
			filterArray();
			$('#filtersData')
				.find(`[data-value='${e.target.getAttribute('data-value')}']`)
				.remove();
		}

		if (e.target.checked && e.target.getAttribute('data-brand')) {
			//Add to checkedBrandArray
			let brandVal = e.target.getAttribute('data-brand');
			checkedBrandArray.push(brandVal);
			filterArray();
			$('#filtersData').append(
				`<span data-brand="${brandVal}" class="d-inline-block m-1 mt-3 border border-secondary pe-2 ps-2 pointer text-gray fw-light rounded">${brandVal} X</span>`
			);
		}
		if (!e.target.checked && e.target.getAttribute('data-brand')) {
			let brandCheckboxClicked = e.target.getAttribute('data-brand');
			let index = checkedBrandArray.indexOf(brandCheckboxClicked);
			//Remove from checkedBrandArray
			if (index !== -1) {
				checkedBrandArray.splice(index, 1);
			}
			filterArray();
			$('#filtersData')
				.find(`[data-brand='${e.target.getAttribute('data-brand')}']`)
				.remove();
		}

		if (e.target && e.target == document.getElementById('sortByRange')) {
			lowRange = document.getElementById('price-min-control').value;
			highRange = document.getElementById('price-max-control').value;
			if (lowRange == '') {
				lowRange = 0;
			}
			if (highRange == '') {
				highRange = 19999999;
			}
			filterArray();
		}
	});

	//FilterData functions
	filtersData.addEventListener('click', (e) => {
		if (e.target && e.target.getAttribute('data-value')) {
			e.target.remove();
			$('#' + e.target.getAttribute('data-value').toLowerCase() + 'Filter').prop('checked', false);
			let checkboxClicked = e.target.getAttribute('data-value');
			let index = checkeSizedArray.indexOf(checkboxClicked);

			//Remove from checkeSizedArray
			if (index !== -1) {
				checkeSizedArray.splice(index, 1);
			}
			filterArray();
		} else if (e.target && e.target.getAttribute('data-brand')) {
			e.target.remove();
			$('#' + e.target.getAttribute('data-brand').toLowerCase() + 'Filter').prop('checked', false);
			let brandCheckboxClicked = e.target.getAttribute('data-brand');
			let index = checkedBrandArray.indexOf(brandCheckboxClicked);

			//Remove from checkedBrandArray
			if (index !== -1) {
				checkedBrandArray.splice(index, 1);
			}
			filterArray();
		}
	});

	//Function Toggle clases del sidebar para mostrarlo. Se eliminan las clases y aparecen y se cancela el scroll.
	function toggleSidebars(sidebar, overlay) {
		const sidebarInDOM = document.getElementById(sidebar);
		sidebarInDOM.classList.toggle('sidebar-off');
		overlay.classList.toggle('overlay-off');
		document.body.classList.toggle('no-scroll');
	}

	//SORT

	sortRecomendedEl.addEventListener('click', sortRecomended);
	sortDescendingEl.addEventListener('click', sortDescending);
	sortAscendingEl.addEventListener('click', sortAscending);

	//SIDEBARS EVENTOS
	//FILTER sidebar

	overlay1.addEventListener('click', function () {
		toggleSidebars('sidebarFilter', overlay1);
	});
	filterBtn.addEventListener('click', function () {
		toggleSidebars('sidebarFilter', overlay1);
	});
	closeSidebar1.addEventListener('click', function () {
		toggleSidebars('sidebarFilter', overlay1);
	});
	applyFilter.addEventListener('click', function () {
		toggleSidebars('sidebarFilter', overlay1);
	});

	//CART sidebar

	overlay2.addEventListener('click', function () {
		toggleSidebars('sidebar', overlay2);
	});
	cartIcon.addEventListener('click', function () {
		toggleSidebars('sidebar', overlay2);
	});
	cartIconMobile.addEventListener('click', function () {
		toggleSidebars('sidebar', overlay2);
	});
	checkOut.addEventListener('click', function () {
		toggleSidebars('sidebar', overlay2);
	});
	closeSidebar2.addEventListener('click', function () {
		toggleSidebars('sidebar', overlay2);
	});
});
