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
const products = [];

document.addEventListener('DOMContentLoaded', () => {
	//METODO LIMPIO EL DOM - PARA EVITAR SUMATORIA DE ELEMENTOS CUANDO SE PUEBLA
	function emptyFromDom(empty) {
		while (empty.firstChild) {
			empty.removeChild(empty.firstChild);
		}
	}

	//*****JQUERY */
	// LOAD DOM JQUERY (Se usa al cargar el archivo JSON con los productos y cada vez que se quiere filtrar)
	let increment = -1;
	function loadDOMJquery(products) {
		//Recorro el Array products en el primer nivel.
		$('#productsCatalog').empty();
		console.log(products);
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
		eventsToButtons();
		// addCartBtn();
	}

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
			} else {
				$('#productsCatalog').fadeOut(150, function () {
					$(this).empty().fadeIn(150, loadDOMJquery(products));
					console.log('filtered = ' + products);
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
		productsCatalog.addEventListener('click', (e) => {
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
		console.log('ORDENADO POR RECOMENDADOS ');
		filteredProducts.sort((a, b) => a.id - b.id);
		fetchDataProducts(filteredProducts);
		sortBy.textContent = 'Sort By: Recomended';
	}

	//ORDENAR POR PRECIO DESCENDENTE
	function sortDescending() {
		console.log('PRECIO MÁS ALTO PRIMERO AJAX');
		filteredProducts.sort((a, b) => b.price - a.price);
		fetchDataProducts(filteredProducts);
		sortBy.textContent = 'Sort By: High to low';
	}

	//ORDENAR POR PRECIO ASCENDENTE
	function sortAscending() {
		console.log('PRECIO MÁS BAJO PRIMERO');
		filteredProducts.sort((a, b) => a.price - b.price);
		fetchDataProducts(filteredProducts);
		sortBy.textContent = 'Sort By: Low to high';
	}

	//FILTRAR POR RANGO DE PRECIOS
	function priceRange() {
		let lowRange = parseInt(document.getElementById('price-min-control').value);
		let highRange = parseInt(document.getElementById('price-max-control').value);
		// let filteredProducts = [];
		if (highRange < lowRange) {
			lowRange = 0;
		}
		if (isNaN(lowRange) && isNaN(highRange)) {
			fetchDataProducts(products);
		} else {
			if (isNaN(lowRange)) {
				lowRange = 0;
				filteredProducts = products.filter((a) => a.price > lowRange && a.price < highRange);
				fetchDataProducts(filteredProducts);
			} else if (isNaN(highRange)) {
				highRange = 99999999;
				filteredProducts = products.filter((a) => a.price > lowRange && a.price < highRange);
				fetchDataProducts(filteredProducts);
			} else if (!isNaN(lowRange) && !isNaN(highRange)) {
				filteredProducts = products.filter((a) => a.price > lowRange && a.price < highRange);
				fetchDataProducts(filteredProducts);
			}
		}
	}

	function brandFilter(brandSelected) {
		filteredProducts = [];
		filteredProducts = products.filter((a) => a.brand === brandSelected);
		console.log(filteredProducts);
		fetchDataProducts(filteredProducts);
	}

	let newArray = [];
	let dataArr = [];
	let checkedArray = [];
	function pushArray(sizeValue) {
		filteredProducts.push.apply(
			newArray,
			products.filter((product) => product.sizeStock.some((element) => element.size === sizeValue))
		);

		console.log(newArray);

		filteredProducts = [...new Set(newArray)];
		console.log(filteredProducts);
	}
	//****END FILTRADO****
	function removeArray(sizeValue) {
		newArray = [];
		console.log(sizeValue);
		filteredProducts = filteredProducts.filter((product) => product.sizeStock.every((element) => element.size !== sizeValue));
		console.log(filteredProducts);
		newArray = filteredProducts;
		// return arr.filter(function (ele) {
		// 	return ele != value;
		// });
	}
	function filterArray() {
		filteredProducts = [];
		newArray = [];
		console.log(filteredProducts);
		console.log('checkedARRAY');
		console.log(checkedArray);
		checkedArray.forEach((el) => {
			console.log(el);
			filteredProducts.push.apply(
				newArray,
				products.filter((product) => product.sizeStock.some((element) => element.size == el))
			);
			filteredProducts = [...new Set(newArray)];
			// console.log(filteredProducts);
		});
		console.log('filtered');
		console.log(filteredProducts);
	}
	// FILTERS
	const filters = document.getElementById('sidebarFilter');

	filters.addEventListener('click', (e) => {
		if (e.target.checked && e.target.getAttribute('data-value')) {
			//Add to filter array
			checkedArray.push(e.target.getAttribute('data-value'));
			console.log(checkedArray);
			console.log('CHECKED');
			filterArray();
		}
		if (!e.target.checked && e.target.getAttribute('data-value')) {
			let checkboxClicked = e.target.getAttribute('data-value');
			let index = checkedArray.indexOf(checkboxClicked);
			//Remove from array to filter
			if (index !== -1) {
				checkedArray.splice(index, 1);
			}
			console.log('UNCHECKED');
			filterArray();
		}
		// if (e.target && e.target.getAttribute('data-value')) {
		// 	sizeValue = parseInt(e.target.getAttribute('data-value'));
		// 	console.log(sizeValue);
		// 	pushArray(sizeValue);
		// } else if (e.target && e.target.getAttribute('data-brand')) {
		// 	brandSelected = e.target.getAttribute('data-brand');
		// 	brandFilter(brandSelected);
		// }
		if (e.target && e.target == document.getElementById('applyFilters')) {
			fetchDataProducts(filteredProducts);
		}
		// if (ckeckBoxAdidas.checked) {
		// 	console.log('Adidas checked');
		// 	brandFilter('ADIDAS');
		// } else if (ckeckBoxTopper.checked) {
		// 	console.log('Adidas checked');
		// 	brandFilter('TOPPER');
		// }
	});

	// filters.addEventListener('click', (e) => {
	// 	if (e.target && e.target.getAttribute('data-value')) {
	// 		sizeValue = parseInt(e.target.getAttribute('data-value'));
	// 		console.log(sizeValue);
	// 	}

	// 	if (e.target && e.target == document.getElementById('pushArray')) {
	// 		filteredProducts = [];
	// 		filteredProducts = products;
	// 		sizeFilter(sizeValue);
	// 		console.log(sizeValue);
	// 		// priceRange();
	// 	}
	// 	const ckeckBoxAdidas = document.getElementById('adidasFilter');
	// 	const ckeckBoxTopper = document.getElementById('topperFilter');
	// 	if (ckeckBoxAdidas.checked) {
	// 		console.log('Adidas checked');
	// 		brandFilter('ADIDAS');
	// 	} else if (ckeckBoxTopper.checked) {
	// 		console.log('Adidas checked');
	// 		brandFilter('TOPPER');
	// 	}
	// });

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
	const applyFilter = document.querySelector('.sidebar-filter .btn-primary');

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
