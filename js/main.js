//MANEJO Y VENTA DE CALZADOS: Se calcula monto a pagar y se actualiza el stock de la tienda.
//CLASE CONSTRUCTORA Calzado CREADORA DE OBJETOS (los llamaremos calzadoX)
class Product{
    constructor (id, category, gender, brand, model, color, price, sizeStock){
        this.id = id;
        this.category = category.toUpperCase(); //Posibilidad de vender otro producto que no sean Productos y escalar a una especie de mercadolibre.
        this.gender = gender.toUpperCase(); //Se va a usar en un futuro para filtrar (Hombre, Mujer, Niño).
        this.brand = brand.toUpperCase();
        this.model = model.toUpperCase();
        this.color = color.toUpperCase();
        this.price = parseFloat(price);
        this.sizeStock = sizeStock;
        this.img1 = 'img/' + this.gender.toLowerCase() + '/' + this.brand.toLowerCase() + '/' + this.id + '_' + this.brand.toLowerCase() + '_' + this.model.toLowerCase() + '_' + this.color.toLowerCase() + '_a.webp'; //Crea URL de imagen 1
        this.img2 = 'img/' + this.gender.toLowerCase() + '/' + this.brand.toLowerCase() + '/' + this.id + '_' + this.brand.toLowerCase() + '_' + this.model.toLowerCase() + '_' + this.color.toLowerCase() + '_b.webp'; //Crea URL de imagen 2
        this.inStock = true;
        this.promotion = false;
    }
    fixStock() { //MODIFICO PROPIEDADES CANTIDAD Y STOCK DEL OBJETO
        // this.stock = this.stock - 1; //RESTO LA COMPRA
        // if(this.stock <= 0){ //CHEQUEO STOCK
        //     this.inStock = false;
        // }
        // console.log(this.sizeStock[0].size)
        // products.forEach( product => {
        //     let array = product.stock;
        //     array.forEach ((array) => {
        //         suma += array;
        //     });
        //     console.log(suma);  
        // });   

        //TENGO QUE ARREGLAR ESTO CON FIND, PARA QUE DESCUENTE SOLO DEL TALLE QUE SE COMPRO. DETECTO CUAL FUE CON FIND Y LE HAGO LA RESTA POR INDEX DEL ARRAY
        products.forEach( product => { 
            product.sizeStock.forEach(element => { // RECORRO EL ARRAY sizeStock
                element.stock = element.stock -1; //AGREGO EL VALOR AL BOTÓN
            });
        });
        products.forEach( product => {
            
            let sum = 0;
            product.sizeStock.forEach(element => { // RECORRO EL ARRAY sizeStock

                sum += element.stock; //AGREGO EL VALOR AL BOTÓN
                
            });
            if(sum <= 0){ //CHEQUEO STOCK
                product.inStock = false;
            }
            // console.log(product.id+ "= "+ sum);  
        });
    }
}

//END CLASE CONSTRUCTORA Producto

//BASE DE DATOS SIMULADA en array de objetos productos.
const products = []; //Creo el array;
products.push(new Product(1, 'calzado', 'hombres', 'Topper', 'classic', 'black', 1800, [{'size': 34, 'stock': 2},{'size': 35, 'stock': 0},{'size':36, 'stock':1}, {'size': 37, 'stock': 2}]));
products.push(new Product(2, 'calzado', 'hombres', 'Topper', 'rainbow', 'multi', 1500, [{'size': 37, 'stock': 4},{'size': 40, 'stock': 5},{'size':42, 'stock':1}]));
products.push(new Product(3, 'calzado', 'hombres', 'Topper', 'cebra', 'black_red', 2800, [{'size': 37, 'stock': 30},{'size': 30 , 'stock': 335},{'size':42, 'stock':0}]));
products.push(new Product(4, 'calzado', 'hombres', 'Topper', 'lover', 'light-grey', 3100, [{'size': 10, 'stock': 3}]));
products.push(new Product(5, 'calzado', 'hombres', 'Adidas', 'infinity', 'black', 5100, [{'size': 15, 'stock': 0}]));
products.push(new Product(6, 'calzado', 'hombres', 'Adidas', 'js', 'black', 3100, [{'size': 39, 'stock': 0},{'size': 40, 'stock': 5},{'size':41, 'stock':1}]));
products.push(new Product(7, 'calzado', 'hombres', 'Adidas', 'angular', 'black', 2100, [{'size': 35, 'stock': 3},{'size': 40, 'stock': 5}]));
products.push(new Product(8, 'calzado', 'hombres', 'Adidas', 'rougue', 'black', 4200, [{'size': 16, 'stock': 9}]));
console.log(products);
// products[0].fixStock();

console.log(products);
console.log('------SCRIPT INICIALIZADO------- AHORA PUEDE ORDENAR MEDIANTE SORT O COMPRAR MEDIANTE BUY');

// CARGANDO EL DOM con FRAGMENT y el TEMPLATE DE HTML
const productsCatalog = document.getElementById('productsCatalog');
const templateProduct = document.getElementById('templateProduct').content;
const fragment = document.createDocumentFragment();
products.forEach( product => {
    templateProduct.querySelector('.img-a').src= product.img1; //img/hombres/topper/1_topper_classic_black_a.webp
    templateProduct.querySelector('.img-b').src= product.img2;
    templateProduct.querySelector('.img-brand-card').src='img/brands/' + product.brand + '.svg';
    templateProduct.querySelector('.card-title').textContent = product.model;
    templateProduct.querySelector('.price').textContent = '$'+product.price;
    //LIMPIO PARA NO REPOBLAR
    let empty = templateProduct.querySelector('.dropdown-menu');
    while (empty.firstChild) {
        empty.removeChild(empty.firstChild);
    }
    // templateProduct.querySelector('.btn-group').innerHTML = ''; //LIMPIO PARA NO REPOBLAR (METODO CON innerHTML tratar de no usarlo)
    //END LIMPIO PARA NO REPOBLAR

    
    
    product.sizeStock.forEach(element => { // RECORRO EL ARRAY sizeStock
        const addBtns = templateProduct.querySelector('.dropdown-menu');
        //CREO EL BOTÓN DE TALLES CON SUS CLASES Y LE AGREGO EL VALOR
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-outline-primary', 'm-1', 'p-0');
        button.textContent = element.size; //AGREGO EL VALOR AL BOTÓN
        if (element.stock === 0){
            button.classList.add('btn-outline-secondary');
            button.disabled = true;
            addBtns.appendChild(button);
        }else{
            addBtns.appendChild(button);
        }
        // templateProduct.querySelector('.btn').textContent = element.size;
        // console.log(button);
    });

    const clone = templateProduct.cloneNode(true);
    fragment.appendChild(clone);
});
productsCatalog.appendChild(fragment);
// END TEMPLATE LOAD

let cart = document.querySelectorAll('.dropdown-menu .btn');
cart.forEach(element => {element.addEventListener('click', function() {
    let pressedBtn=parseInt(element.textContent);
    alert(pressedBtn);
})});
// products[1].fixStock()
//****FILTROS****
//ORDENAR POR PRECIO
function sortDescending(){ //DESCENDENTE
    console.log('PRECIO MÁS ALTO PRIMERO');
    products.sort((a, b) => b.price - a.price)
};

function sortAscending(){ //ASCENDENTE
    console.log('PRECIO MÁS BAJO PRIMERO');
    products.sort((a, b) => a.price - b.price)
};

//FILTRAR POR RANGO DE PRECIOS
let priceRanges = [];
function priceRange(){ 
    let lowRange = parseInt(prompt('Ingrese su precio mínimo'));
    let highRange = parseInt(prompt('Ingrese su precio máximo'));
    console.log('NEW PRICE RANGE');
    priceRanges = products.filter( a => a.price > lowRange && a.price < highRange);
};
//****END FILTROS****
function buy(){
    //FUNCION QUE VALIDA LAS ENTRADAS DEL USUARIO
    function validation(userEntry, maxRange, foo){
        while (userEntry < 0 || userEntry > maxRange || userEntry.length === 0 || userEntry === null || !parseInt(userEntry)){ 
            switch (foo) {
                case 1:
                    idSelected = parseInt(prompt(
                        `Seleccione un modelo de la lista ingresando su id:
        id=1 | Topper - Classic  |  TALLE 40
        id=2 | Topper - Rainbow  |  TALLE39
        id=3 | Topper - Cebra  |  TALLE 41
        id=4 | Topper - Lover  |  TALLE 38
        id=5 | Adidas - Infinity  |  TALLE 40
        id=6 | Adidas - JS  |  TALLE 40
        id=7 | Adidas - Angular  |  TALLE39
        id=8 | Adidas - Rougue  |  TALLE 41`));
                    userEntry = idSelected;
                    break;
                case 2:
                    buyStock = parseInt(prompt('Nuestro stock para: ' + buyObject.brand + ' - ' +buyObject.model + ' es de: ' + buyObject.stock + '\n¿Cuantos pares lleva?'));
                    userEntry = buyStock;
                    break;
                case 3:
                    saleCupon = prompt('No podemos otorgar ese descuento. El descuento mayor es de 50% ¿Cuál es el % de desuento de su cupón?');
                    userEntry = saleCupon;
                    break;
                case 4:
                    dues = prompt('Debe pagar $' + Math.round(payWithSale) +'. Ingrese la cantidad de cuotas. El máximo de cuotas es 10');
                    userEntry = dues;
                    break;
                default:
                    break;
            }
        }
        return true;
    };

    //USUARIO id y CANTIDAD (**********NO LO ACTUALICÉ Y NO COINCIDE CON LOS PRODUCTOS, PREFERÍ NO PERDER TIEMPO EN ESO, SE VA A SACAR CUANDO HAYA INTERACCION CON EL DOM**********)
    let idSelected = parseInt(prompt(
        `Seleccione un modelo de la lista ingresando su id:
        id=1 | Topper - Classic  |  TALLE 40
        id=2 | Topper - Rainbow  |  TALLE39
        id=3 | Topper - Cebra  |  TALLE 41
        id=4 | Topper - Lover  |  TALLE 38
        id=5 | Adidas - Infinity  |  TALLE 40
        id=6 | Adidas - JS  |  TALLE 40
        id=7 | Adidas - Angular  |  TALLE39
        id=8 | Adidas - Rougue  |  TALLE 41`));

    validation(idSelected, 8, 1); //Llamo a la funcion para validar los datos del usuario

    // let buyObject = eval('calzado' + idSelected); //SELECCION DINAMICA (Selecciono objeto seleccionado por usuario)
    let buyObject = products[idSelected-1]; //SELECCION DINAMICA (Selecciono objeto seleccionado por usuario)
    // console.log(buyObject);
    let buyStock = parseInt(prompt('¿Cuántos pares lleva?'));
    validation(buyStock, buyObject.stock, 2); //Llamo a la funcion para validar los datos del usuario
    //END USUARIO

    //CALCULO (Se hacen diferentes cálculos)
    //FUNCION VENTA (calculo precio con iva teniendo en cuenta la cantidad de compra, bajo el stock la cantidad de compra, admito venta si la compra es menor o igual al stock y si además hay stock)
    function sold(){ 
        for (var i = 0; i < buyStock; i++) { //Arregla el stock (le resta lo que compró) *****ESTO SE DEBERÍA HACER DESPUES DE CHEQUEAR QUE EL USUARIO PAGÓ*****
            buyObject.fixStock(); 
        }
        
        let montoTotal = buyObject.price * buyStock * 1.22; 
        return montoTotal;
    };
    let totalNoCupon = sold();
    //END CALCULO
    //USUARIO DESCUENTO
    let saleCupon = prompt('Otorgamos descuentos de hasta el 50% de su valor de compra. ¿Cuál es el % de descuento de su cupón?');
    if (saleCupon != 0){
        validation(saleCupon, 50, 3); //Llamo a la funcion para validar los datos del usuario
    }
    
    //END USUARIO
    //CALCULO (Se hacen diferentes cálculos)
    let payWithSale;
    let dues;
    function pago(){
        //DESCUENTO
        saleCupon = (100 - parseInt(saleCupon))/100;
        payWithSale = totalNoCupon * saleCupon;
        //USUARIO CUOTAS
        dues = prompt('Debe pagar $' + Math.round(payWithSale) +'. Ingrese la cantidad de dues. El máximo de dues es 10');
        validation(dues, 10, 4); //Llamo a la funcion para validar los datos del usuario
        let totalPay, duesPay;
        //END USUARIO

        //Devuelvo valores en array
        return [totalPay, dues, duesPay] = [(totalNoCupon * saleCupon), dues, ((totalNoCupon * saleCupon)/dues)]
    };
    let aPagar = pago(); // Respuesta de funcion pago. Devuelve un array.
    //END CALCULO
    //INFO PARA EL USUARIO
    alert('USTED ESTÁ COMPRANDO: \nCalzado: ' + buyObject.brand + ' - ' + buyObject.model + '\nCantidad: ' + buyStock  + '\n-------------\nSu descuento es del: ' + Math.round((100-(saleCupon*100))) + '%\n-------------\nDebe pagar: $' + Math.round(aPagar[0]) + '\ndues: ' + aPagar[1] + '\nPago Mensual: $' + Math.round(aPagar[2]));
    //Muestra como quedo el objeto modificado luego de la compra por consola ya que este valor es relevante solo para la tienda.
    console.log(buyObject);
    console.log(products);
}
//***SORT****
document.getElementById('sortDescending').addEventListener('click', function() {
    sortDescending();
    console.log(products);
});
document.getElementById('sortAscending').addEventListener('click', function() {
    sortAscending();
    console.log(products);
});
//****END SORT****
//****RANGE****
document.getElementById('priceRange').addEventListener('click', function() {
    priceRange();
    console.log(priceRanges);
});
//****END RANGE****
//****BOTON BUY****
document.getElementById('buy').addEventListener('click', function() {
    buy();
});
//****END BOTON BUY****
