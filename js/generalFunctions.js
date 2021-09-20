import { products } from './main.js';
import { addToCart } from './cartFunctions.js';
export let sizeSelected;
export let pressedId;
let findedProduct;
let findedSize;
//METODO LIMPIO EL DOM - PARA EVITAR SUMATORIA DE ELEMENTOS CUANDO SE PUEBLA
export function emptyFromDom(empty) {
	while (empty.firstChild) {
		empty.removeChild(empty.firstChild);
	}
}
// CLICK EN BOTON SIZE (Dentro de los dropdown, cualquier botón de talles)
export function clickSizeBtn(btn) {
	const isActive = document.querySelector('button.btn.btn-outline-primary.active');
	if (isActive) {
		isActive.classList.remove('active');
	}
	sizeSelected = parseInt(btn.textContent);
	pressedId = btn.getAttribute('data-id');
	btn.classList.toggle('active');
}
//Encuentra el producto con ese ID y el talle

function findProductAndSize(id, sizeSelected) {
	findedProduct = products.find((el) => el.id == id);
	findedSize = findedProduct.sizeStock.find((el) => el.size == sizeSelected);
}
//Arregla el stock luego de agregado el producto al carrito, resta el stock del talle
export function fixStock(id, sizeSelected, operation) {
	findProductAndSize(id, sizeSelected);
	if (findedSize.stock >= 1 && operation === 'sub') {
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
		new bootstrap.Toast(document.querySelector('#addToast')).show();
	} else if (operation === 'add') {
		if (findedSize.stock === 0) {
			findedSize.stock = 1;
			// if (findedSize.stock > 0) {
			// 	const addActive = $('#elementId').attr("data-id");
			// 	addActive.classList.add('btn-outline-primary');
			// 	addActive.classList.remove('btn-outline-secondary');
			// 	addActive.disabled = false;
			// }
		}
		findedSize.stock = findedSize.stock + 1;
	} else {
		new bootstrap.Toast(document.querySelector('#noStockToast')).show();
	}
}
