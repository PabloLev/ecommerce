import { products, cartProducts } from './main.js';
import { emptyFromDom } from './generalFunctions.js';
import { fixStock } from './generalFunctions.js';
//NUMERO DEL ICONO CARRITO

function productsQuantityInCart() {
	const cartIconNum1 = document.querySelector('.fa-shopping-cart .badge1');
	cartIconNum1.textContent = cartProducts.length;
	const cartIconNum2 = document.querySelector('.fa-shopping-cart .badge2');
	cartIconNum2.textContent = cartProducts.length;
}

//Calculo precio carrito
function payment() {
	let totalPrice = 0;
	for (const index in cartProducts) {
		const product = cartProducts[index];
		totalPrice = product.price + totalPrice;
	}
	const totalPriceContainer = document.getElementById('totalPrice');
	totalPriceContainer.innerHTML = `
        <h5 class="m-2">Total = $${totalPrice}</h5>
    `;
	if (cartProducts.length === 0) {
		emptyFromDom(totalPriceContainer);
	}
}

//ENABLE DISABLE FINALIZAR COMPRA
function enableFinishBtn() {
	const finishBtn = document.getElementById('finish');
	if (cartProducts.length === 0) {
		finishBtn.disabled = true;
	} else {
		finishBtn.disabled = false;
	}
}

//EVENTO A ICONO TRASH
function trash() {
	const trash = document.querySelectorAll('.trash');
	trash.forEach((el) =>
		el.addEventListener('click', function (e) {
			cartArrayRemove();
			this.parentNode.remove();
		})
	);
}

//elimino del array carrito
function cartArrayRemove() {
	const forIndex = cartProducts.find((el) => el.id);
	const originalId = forIndex.originalId;
	const originalSize = forIndex.size;
	const index = cartProducts.indexOf(forIndex);
	cartProducts.splice(index, 1);
	productsQuantityInCart();
	const operation = 'add';
	fixStock(originalId, originalSize, operation);
	// findedSize.stock = findedSize.stock - 1;
	payment();
	enableFinishBtn();
}

//FINALIZAR COMPRA
function finishBuy() {
	new bootstrap.Toast(document.querySelector('#buyToast')).show();
	enableFinishBtn();
}

//Esta funcion agrega los productos al carrito
let productId = 0;
export function addToCart(id, sizeSelected) {
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

	//Recorro cartProducts
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
	payment();
	enableFinishBtn();
	trash();
}
