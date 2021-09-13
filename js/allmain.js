//CONSTRUCTOR PRODUCTS - CREADORA DE OBJETOS
class Product {
	constructor(id, category, gender, brand, model, color, price, sizeStock) {
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
		this.imgA = `img/${this.gender.toLowerCase()}/${this.brand.toLowerCase()}/${this.id}_${this.brand.toLowerCase()}_${this.model.toLowerCase()}_${this.color.toLowerCase()}_a.webp`;
		this.imgB = `img/${this.gender.toLowerCase()}/${this.brand.toLowerCase()}/${this.id}_${this.brand.toLowerCase()}_${this.model.toLowerCase()}_${this.color.toLowerCase()}_b.webp`;
	}
}
//Declaro Array products se puebla en fetchDataProducts linea 88 (pudo haber cambiado, capaz que me olvidé de actualizar, jeje)
let products = [];

document.addEventListener('DOMContentLoaded', () => {
	//METODO LIMPIO EL DOM - PARA EVITAR SUMATORIA DE ELEMENTOS CUANDO SE PUEBLA
	function emptyFromDom(empty) {
		while (empty.firstChild) {
			empty.removeChild(empty.firstChild);
		}
	}

	$('.navbar-nav a').on('click', function () {
		console.log('CLICK');

		$('.navbar-nav').find('.active').removeClass('active');
		$(this).addClass('active');
	});

	//*****JQUERY */
	// LOAD DOM JQUERY (Se usa al cargar el archivo JSON con los productos y cada vez que se quiere filtrar)
	let increment = -1;
	let genderSelected = 'ALL';
	function loadDOMJquery(products) {
		console.log(products);
		if (genderSelected != 'ALL') {
			products = products.filter((e) => e.gender == genderSelected);
		}

		//Recorro el Array products en el primer nivel.
		// $('#productsCatalog').empty();
		// console.log(products);
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
		console.log(products.length);
		$('#filterArticles').text(products.length + ' articles');
		// addCartBtn();
	}

	const navBarData = document.getElementById('navbarSupportedContent');
	navBarData.addEventListener('click', (e) => {
		console.log(e.target.classList.contains('active'));
		if (e.target && e.target.classList.contains('active')) {
			genderSelected = e.target.textContent.toUpperCase();
			console.log(genderSelected);
			// addEventListener
			fetchDataProducts(products);
		}
	});

	//CREO "BASE DE DATOS con FETCH"
	const fetchDataProducts = async (products) => {
		try {
			if (products.length === 0) {
				//Cargo el JSON
				console.log('loaded JSON');
				const res = await fetch('./assets/products.json');
				const response = await res.json();
				//Pueblo el array products
				for (let item of response) {
					products.push(new Product(item.id, item.category, item.gender, item.brand, item.model, item.color, item.price, item.sizeStock));
				}
				eventsToButtons();
			} else {
				$('#productsCatalog').fadeOut(250, function () {
					$(this).empty().fadeIn(150, loadDOMJquery(products));
				});
			}
			loadDOMJquery(products);
		} catch (error) {
			console.log(error);
		}
	};
	fetchDataProducts(products);

	// CLICK EN BOTON SIZE (Dentro de los dropdown, cualquier botón de talles)
	let sizeSelected;
	let pressedId;
	function clickSizeBtn(btn) {
		const isActive = document.querySelector('button.btn.btn-outline-primary.active');
		if (isActive) {
			isActive.classList.remove('active');
		}
		sizeSelected = parseInt(btn.textContent);
		pressedId = btn.getAttribute('data-id');
		btn.classList.toggle('active');
		console.log(`* Size selected: ${sizeSelected} * ID of product: ${pressedId}`);
	}

	// AGREGA EVENTO A TODOS LOS BOTONES ADD TO CART Y SIZE (Dentro de los dropdown, cualquier botón de talles), Usando delegation y propagation
	function eventsToButtons() {
		const productsCatalog = document.getElementById('productsCatalog');
		// console.log(productsCatalog);

		productsCatalog.addEventListener('click', (e) => {
			e.preventDefault();
			if (e.target && e.target.getAttribute('data-btn')) {
				clickSizeBtn(e.target);
			} else if (e.target && e.target.classList.contains('cart')) {
				if (sizeSelected === undefined || pressedId != e.target.getAttribute('data-id')) {
					console.log('Seleccione un talle');
				} else {
					fixStock(pressedId, sizeSelected);
				}
			}
		});
	}

	//Encuentra el producto con ese ID y el talle
	let findedProduct;
	let findedSize;
	function findProductAndSize(id, sizeSelected) {
		findedProduct = products.find((el) => el.id == id);
		findedSize = findedProduct.sizeStock.find((el) => el.size == sizeSelected);
	}

	//Arregla el stock luego de agregado el producto al carrito, resta el stock del talle
	function fixStock(id, sizeSelected) {
		findProductAndSize(id, sizeSelected);
		if (findedSize.stock > 0) {
			findedSize.stock = findedSize.stock - 1;
			const removeActive = document.querySelector('.dropdown-menu .active');
			//Si el stock es cero lo deja disabled
			if (findedSize.stock == 0) {
				removeActive.classList.remove('active');
				removeActive.classList.remove('btn-outline-primary');
				removeActive.classList.add('btn-outline-secondary');
				removeActive.disabled = true;
			}
			//Llamo a la función que agrega al carrito.
			addToCart(id, sizeSelected);

			//Despliego el Toast de bootstrap que pregunta si se sigue comprando
			new bootstrap.Toast(document.querySelector('#basicToast')).show();
		} else {
			console.log(`No stock of size: ${findedSize.size}`);
		}
	}

	//NUMERO DEL ICONO CARRITO
	const cartProducts = [];
	function productsQuantityInCart() {
		const cartIconNum1 = document.querySelector('.fa-shopping-cart .badge1');
		console.log(cartIconNum1);
		cartIconNum1.textContent = cartProducts.length;
		const cartIconNum2 = document.querySelector('.fa-shopping-cart .badge2');
		console.log(cartIconNum2);
		cartIconNum2.textContent = cartProducts.length;
	}

	//elimino del array carrito
	function cartArrayRemove() {
		const forIndex = cartProducts.find((el) => el.id);
		const index = cartProducts.indexOf(forIndex);
		cartProducts.splice(index, 1);
		productsQuantityInCart();
	}

	//Elimino del sidebar de carrito
	function trash() {
		const trash = document.querySelectorAll('.trash');
		trash.forEach((el) =>
			el.addEventListener('click', function (e) {
				cartArrayRemove();
				this.parentNode.remove();
			})
		);
	}

	//Esta funcion agrega los productos al carrito
	let productId = 0;
	function addToCart(id, sizeSelected) {
		//Filtro products y creo nuevo array findedProduct
		const findedProduct = products.find((el) => el.id == id);
		productId = ++productId;
		cartProducts.push({
			id: productId,
			originalId: id,
			imgA: findedProduct.imgA,
			model: findedProduct.model,
			brand: findedProduct.brand,
			size: sizeSelected,
			price: findedProduct.price,
		});

		const productInCart = document.getElementById('productsInCart');
		const toastImg = document.getElementById('toastImg');
		toastImg.src = findedProduct.imgA;
		const toastBrand = document.querySelector('#toastBrand');
		const toastDiv = document.createElement('div');
		emptyFromDom(toastBrand);
		toastDiv.innerHTML = `<h6 class="mt-3"><strong>${findedProduct.brand} - ${findedProduct.model} - Size: ${sizeSelected}</strong></h6>`;
		toastBrand.appendChild(toastDiv);

		// Empty productInCart
		emptyFromDom(productInCart);

		productsQuantityInCart();
		for (const index in cartProducts) {
			const product = cartProducts[index];
			const createDiv = document.createElement('div');
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
	}

	//****FILTRADO (SORT BY:)****
	let filteredProducts = products;
	//ORDENAR POR ID (RECOMENDADOS)
	const sortBy = document.getElementById('dropdownMenuButtonSort');
	function sortRecomended() {
		// filteredProducts = products;
		// console.log('ORDENADO POR RECOMENDADOS ');
		filteredProducts.sort((a, b) => a.id - b.id);
		fetchDataProducts(filteredProducts);
		sortBy.textContent = 'Sort By: Recomended';
	}

	//ORDENAR POR PRECIO DESCENDENTE
	function sortDescending() {
		// console.log('PRECIO MÁS ALTO PRIMERO AJAX');
		filteredProducts.sort((a, b) => b.price - a.price);
		fetchDataProducts(filteredProducts);
		sortBy.textContent = 'Sort By: High to low';
	}

	//ORDENAR POR PRECIO ASCENDENTE
	function sortAscending() {
		// console.log('PRECIO MÁS BAJO PRIMERO');
		filteredProducts.sort((a, b) => a.price - b.price);
		fetchDataProducts(filteredProducts);
		sortBy.textContent = 'Sort By: Low to high';
	}

	let newArray = [];
	let newArray2 = [];
	let checkedBrandArray = [];
	let checkeSizedArray = [];
	let lowRange = 0;
	let highRange = 9999999;

	function filterArray() {
		filteredProducts = [];
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
			console.log(checkedBrandArray.length);
			newArray2 = [];
			checkedBrandArray.forEach((el) => {
				filteredProducts.push.apply(
					newArray2,
					filteredProducts.filter((a) => a.brand === el)
				);
				console.log('element = ' + el);
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
		//NUMBER OF ARTICLES TO SHOW
		// $('#filterArticles').text(Object.keys(filteredProducts).length + ' articles');
	}

	//****END FILTRADO****
	// FILTERS
	const filters = document.getElementById('sidebarFilter');

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
			console.log(checkedBrandArray);
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

	const filtersData = document.getElementById('filtersData');
	filtersData.addEventListener('click', (e) => {
		if (e.target && e.target.getAttribute('data-value')) {
			console.log('REMOVE');
			e.target.remove();
			console.log('#' + e.target.getAttribute('data-value').toLowerCase() + 'Filter');
			// $('input:checked').removeAttr('checked');
			$('#' + e.target.getAttribute('data-value').toLowerCase() + 'Filter').prop('checked', false);

			let checkboxClicked = e.target.getAttribute('data-value');
			let index = checkeSizedArray.indexOf(checkboxClicked);
			//Remove from checkeSizedArray
			if (index !== -1) {
				checkeSizedArray.splice(index, 1);
			}
			filterArray();
		} else if (e.target && e.target.getAttribute('data-brand')) {
			console.log('REMOVE');
			e.target.remove();
			console.log('#' + e.target.getAttribute('data-brand').toLowerCase() + 'Filter');
			// $('input:checked').removeAttr('checked');
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

	// EVENTOS
	//***SORT****
	document.getElementById('sortRecomended').addEventListener('click', sortRecomended);
	document.getElementById('sortDescending').addEventListener('click', sortDescending);
	document.getElementById('sortAscending').addEventListener('click', sortAscending);
	//****END SORT****

	//SIDEBARS EVENTOS
	//FILTER sidebar
	const overlay1 = document.getElementById('sidebarOverlay1');
	const filterBtn = document.getElementById('filterBtn');
	const closeSidebar1 = document.getElementById('closeSidebar1');
	const applyFilter = document.getElementById('applyFilters');

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
	const overlay2 = document.getElementById('sidebarOverlay2');
	const cartIcon = document.getElementById('cartIcon');
	const cartIconMobile = document.getElementById('cartIconMobile');
	const checkOut = document.getElementById('checkOut');
	const closeSidebar2 = document.getElementById('closeSidebar2');

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
