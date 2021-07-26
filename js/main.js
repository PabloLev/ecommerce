document.getElementById("runScript").addEventListener("click", function() {
    //MANEJO Y VENTA DE CALZADOS: Se calcula monto a pagar y se actualiza el stock de la tienda.
    //CLASE CONSTRUCTORA Calzado CREADORA DE OBJETOS (los llamaremos calzadoX)
    class Product{
        constructor (id, category, gender, brand, model, color, size, price, quantity){
            this.id = id;
            this.category = category.toUpperCase(); //Posibilidad de vender otro producto que no sean Productos y escalar a una especie de mercadolibre.
            this.gender = gender.toUpperCase(); //Se va a usar en un futuro para filtrar (Hombre, Mujer, Niño).
            this.brand = brand.toUpperCase();
            this.model = model.toUpperCase();
            this.color = color.toUpperCase();
            this.size = parseInt(size);
            this.price = parseFloat(price);
            this.quantity = parseInt(quantity);
            this.img1 = "img/" + this.gender.toLowerCase() + "/" + this.brand.toLowerCase() + "/" + this.id + "_" + this.brand.toLowerCase() + "_" + this.model.toLowerCase() + "_" + this.color.toLowerCase() + "_a.webp"; //Crea URL de imagen 1
            this.img2 = "img/" + this.gender.toLowerCase() + "/" + this.brand.toLowerCase() + "/" + this.id + "_" + this.brand.toLowerCase() + "_" + this.model.toLowerCase() + "_" + this.color.toLowerCase() + "_b.webp"; //Crea URL de imagen 2
            this.stock = true;
            this.promotion = false;
        }
        fixStock() { //MODIFICO PROPIEDADES CANTIDAD Y STOCK DEL OBJETO
            this.quantity = this.quantity - 1; //RESTO LA COMPRA
            
            if(this.quantity <= 0){ //CHEQUEO STOCK
                this.stock = false;
            }
        }
    }
    //END CLASE CONSTRUCTORA Producto

    //BASE DE DATOS SIMULADA en array de objetos productos.
    const products = []; //Creo el array;
    products.push(new Product(1, "calzado", "hombre",  "Topper", "classic", "black", 40, 1800, 3));
    products.push(new Product(2, "calzado", "hombre", "Topper", "rainbow", "multi", 39, 1500, 10));
    products.push(new Product(3, "calzado", "mujer", "Topper", "cebra", "black_red", 41, 2800, 31));
    products.push(new Product(4, "calzado", "mujer", "Topper", "cebra", "light-grey", 38, 2800, 5));
    products.push(new Product(5, "calzado", "hombre", "Adidas", "infinity", "black", 40, 5100, 1));
    products.push(new Product(6, "calzado", "hombre", "Adidas", "infinity", "black", 41, 5100, 5));
    products.push(new Product(7, "calzado", "hombre", "Adidas", "infinity", "black", 38, 5100, 10));
    products.push(new Product(8, "calzado", "hombre", "Adidas", "infinity", "black", 39, 5100, 1));


    console.log(products);
    console.log("------SCRIPT INICIALIZADO------- AHORA PUEDE ORDENAR MEDIANTE SORT O COMPRAR MEDIANTE BUY");

    //****FILTROS****
    //ORDENAR POR PRECIO
    function sortDescending(){ //DESCENDENTE
        console.log("PRECIO MÁS ALTO PRIMERO");
        products.sort((a, b) => b.price - a.price)
    };

    function sortAscending(){ //ASCENDENTE
        console.log("PRECIO MÁS BAJO PRIMERO");
        products.sort((a, b) => a.price - b.price)
    };

    //FILTRAR POR RANGO DE PRECIOS
    let priceRanges = [];
    function priceRange(){ 
        let lowRange = parseInt(prompt("Ingrese su precio mínimo"));
        let highRange = parseInt(prompt("Ingrese su precio máximo"));
        console.log("NEW PRICE RANGE");
        priceRanges = products.filter( a => a.price > lowRange && a.price < highRange);
        
    };
    //****END FILTROS****
    function buy(){
        //FUNCION QUE VALIDA LAS ENTRADAS DEL USUARIO
        function validation(ingresoUsuario, rangoMaximo, foo){
            while (ingresoUsuario < 0 || ingresoUsuario > rangoMaximo || ingresoUsuario.length === 0 || ingresoUsuario === null || !parseInt(ingresoUsuario)){ 
                switch (foo) {
                    case 1:
                        idSeleccionado = parseInt(prompt( //Se ve feo me toma en cuenta las tabulaciones
                            `Seleccione un modelo de la lista ingresando su id:
                            id=1 | New Balnce - ninja  |  TALLE 40
                            id=2 | New Balnce - ninja  |  TALLE39
                            id=3 | New Balance - cebra  |  TALLE 41
                            id=4 | Puma - gacele  |  TALLE 38
                            id=5 | Nike - infinity  |  TALLE 40`));
                        ingresoUsuario = idSeleccionado;
                        break;
                    case 2:
                        cantidadComprada = parseInt(prompt("Nuestro stock para: " + objetoComprado.brand + " - " +objetoComprado.model + " es de: " + objetoComprado.quantity + "\n¿Cuantos pares lleva?"));
                        ingresoUsuario = cantidadComprada;
                        break;
                    case 3:
                        cuponDescuento = prompt("No podemos otorgar ese descuento. El descuento mayor es de 50% ¿Cuál es el % de desuento de su cupón?");
                        ingresoUsuario = cuponDescuento;
                        break;
                    case 4:
                        cuotas = prompt("Debe pagar $" + Math.round(pagoConDescuento) +". Ingrese la cantidad de cuotas. El máximo de cuotas es 10");
                        ingresoUsuario = cuotas;
                        break;
                    default:
                        break;
                }
            }
            return true;
        };

        //USUARIO id y CANTIDAD
        let idSeleccionado = parseInt(prompt(
            `Seleccione un modelo de la lista ingresando su id:
            id=1 | Topper - force  |  TALLE 40
            id=2 | New Balnce - ninja  |  TALLE39
            id=3 | New Balance - cebra  |  TALLE 41
            id=4 | Puma - gacele  |  TALLE 38
            id=5 | Nike - infinity  |  TALLE 40`));

        validation(idSeleccionado, 5, 1); //Llamo a la funcion para validar los datos del usuario

        // let objetoComprado = eval("calzado" + idSeleccionado); //SELECCION DINAMICA (Selecciono objeto seleccionado por usuario)
        let objetoComprado = products[idSeleccionado-1]; //SELECCION DINAMICA (Selecciono objeto seleccionado por usuario)
        // console.log(objetoComprado);
        let cantidadComprada = parseInt(prompt("¿Cuántos pares lleva?"));
        validation(cantidadComprada, objetoComprado.quantity, 2); //Llamo a la funcion para validar los datos del usuario
        //END USUARIO

        //CALCULO (Se hacen diferentes cálculos)
        //FUNCION VENTA (calculo precio con iva teniendo en cuenta la cantidad de compra, bajo el stock la cantidad de compra, admito venta si la compra es menor o igual al stock y si además hay stock)
        function sold(){ 
            for (var i = 0; i < cantidadComprada; i++) { //Arregla el stock (le resta lo que compró) *****ESTO SE DEBERÍA HACER DESPUES DE CHEQUEAR QUE EL USUARIO PAGÓ*****
                objetoComprado.fixStock(); 
            }
            
            let montoTotal = objetoComprado.price * cantidadComprada * 1.22; 
            return montoTotal;
        };
        let totalSinDescuento = sold();
        //END CALCULO
        //USUARIO DESCUENTO
        let cuponDescuento = prompt("Otorgamos descuentos de hasta el 50% de su valor de compra. ¿Cuál es el % de descuento de su cupón?");
        if (cuponDescuento != 0){
            validation(cuponDescuento, 50, 3); //Llamo a la funcion para validar los datos del usuario
        }
        
        //END USUARIO
        //CALCULO (Se hacen diferentes cálculos)
        let pagoConDescuento;
        let cuotas;
        function pago(){
            //DESCUENTO
            cuponDescuento = (100 - parseInt(cuponDescuento))/100;
            pagoConDescuento = totalSinDescuento * cuponDescuento;
            //USUARIO CUOTAS
            cuotas = prompt("Debe pagar $" + Math.round(pagoConDescuento) +". Ingrese la cantidad de cuotas. El máximo de cuotas es 10");
            validation(cuotas, 10, 4); //Llamo a la funcion para validar los datos del usuario
            let pagoTotal, pagoCuotas;
            //END USUARIO

            //Devuelvo valores en array
            return [pagoTotal, cuotas, pagoCuotas] = [(totalSinDescuento * cuponDescuento), cuotas, ((totalSinDescuento * cuponDescuento)/cuotas)]
        };
        let aPagar = pago(); // Respuesta de funcion pago. Devuelve un array.
        //END CALCULO
        //INFO PARA EL USUARIO
        alert("USTED ESTÁ COMPRANDO: \nCalzado: " + objetoComprado.brand + " - " + objetoComprado.model + "\nCantidad: " + cantidadComprada  + "\n-------------\nSu descuento es del: " + Math.round((100-(cuponDescuento*100))) + "%\n-------------\nDebe pagar: $" + Math.round(aPagar[0]) + "\nCuotas: " + aPagar[1] + "\nPago Mensual: $" + Math.round(aPagar[2]));
        //Muestra como quedo el objeto modificado luego de la compra por consola ya que este valor es relevante solo para la tienda.
        console.log(objetoComprado);
        console.log(products);
    }
    //***SORT****
    document.getElementById("sortDescending").addEventListener("click", function() {
        sortDescending();
        console.log(products);
    });
    document.getElementById("sortAscending").addEventListener("click", function() {
        sortAscending();
        console.log(products);
    });
    //****END SORT****
    //****RANGE****
    document.getElementById("priceRange").addEventListener("click", function() {
        priceRange();
        console.log(priceRanges);
    });
    //****END RANGE****
    //****BOTON BUY****
    document.getElementById("buy").addEventListener("click", function() {
        buy();
    });
    //****END BOTON BUY****
});