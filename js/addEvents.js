import { clickSizeBtn, sizeSelected, pressedId, fixStock } from './generalFunctions.js';
// import { sizeSelected, pressedId } from './.js';

// AGREGA EVENTO A TODOS LOS BOTONES ADD TO CART Y SIZE (Dentro de los dropdown, cualquier botón de talles), Usando delegation y propagation
export function eventsToButtons() {
	const productsCatalog = document.getElementById('productsCatalog');
	productsCatalog.addEventListener('click', (e) => {
		e.preventDefault();
		const operation = 'sub';
		if (e.target && e.target.getAttribute('data-btn')) {
			clickSizeBtn(e.target);
		} else if (e.target && e.target.classList.contains('cart')) {
			if (sizeSelected === undefined || pressedId != e.target.getAttribute('data-id')) {
				new bootstrap.Toast(document.querySelector('#selectSizeToast')).show();
			} else {
				fixStock(pressedId, sizeSelected, operation);
			}
		}
	});
}
