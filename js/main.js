//MANEJO Y VENTA DE CALZADOS: Se calcula monto a pagar y se actualiza el stock de la tienda.
//CLASE CONSTRUCTORA Calzado CREADORA DE OBJETOS (los llamaremos calzadoX)
class Calzado{
    constructor (id, categoria, marca, modelo, talle, precio, cantidad, imagen){
        this.id = id;
        this.categoria = categoria; //Se va a usar en un futuro para filtrar (Hombre, Mujer, Niño).
        this.marca = marca.toUpperCase();
        this.modelo = modelo.toUpperCase();
        this.talle = parseInt(talle);
        this.precio = parseFloat(precio);
        this.cantidad = parseInt(cantidad);
        this.imagen = imagen; //url de la imagen
        this.stock = true;
    }
    fixStock() { //MODIFICO PROPIEDADES CANTIDAD Y STOCK DEL OBJETO
        this.cantidad = this.cantidad - 1; //RESTO LA COMPRA
        
        if(this.cantidad <= 0){ //CHEQUEO STOCK
            this.stock = false;
        }
    }
}
//END CLASE CONSTRUCTORA Calzado

//BASE DE DATOS SIMULADA
const calzado1 = new Calzado("1", "Hombre",  "New Balance", "ninja", "40", "3200", "3", "/img/NB-ninja.jpg");
const calzado2 = new Calzado("2", "Hombre", "New Balance", "ninja", "39", "3200", "10", "/img/NB-ninja.jpg");
const calzado3 = new Calzado("3", "nino", "New Balance", "cebra", "41", "3600", "31", "/img/NB-cebra.jpg");
const calzado4 = new Calzado("4", "Mujer", "Puma", "gacele", "38", "2800", "5", "/img/Puma-gacele.jpg");
const calzado5 = new Calzado("5", "Hombre", "Nike", "infinity", "40", "3100", "1", "/img/Nike-infinity.jpg");
//END BASE SIMULADA//
//FUNCION QUE VALIDA LAS ENTRADAS DEL USUARIO
function validar(ingresoUsuario, rangoMaximo, foo){
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
                cantidadComprada = parseInt(prompt("Nuestro stock para: " + objetoComprado.marca + " - " +objetoComprado.modelo + " es de: " + objetoComprado.cantidad + "\n¿Cuantos pares lleva?"));
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
    id=1 | New Balnce - ninja  |  TALLE 40
    id=2 | New Balnce - ninja  |  TALLE39
    id=3 | New Balance - cebra  |  TALLE 41
    id=4 | Puma - gacele  |  TALLE 38
    id=5 | Nike - infinity  |  TALLE 40`));

validar(idSeleccionado, 5, 1); //Llamo a la funcion para validar los datos del usuario

let objetoComprado = eval("calzado" + idSeleccionado); //SELECCION DINAMICA (Selecciono objeto seleccionado por usuario)
let cantidadComprada = parseInt(prompt("¿Cuántos pares lleva?"));
validar(cantidadComprada, objetoComprado.cantidad, 2); //Llamo a la funcion para validar los datos del usuario
//END USUARIO

//CALCULO (Se hacen diferentes cálculos)
//FUNCION VENTA (calculo precio con iva teniendo en cuenta la cantidad de compra, bajo el stock la cantidad de compra, admito venta si la compra es menor o igual al stock y si además hay stock)
function venta(){ 
    for (var i = 0; i < cantidadComprada; i++) { //Arregla el stock (le resta lo que compró) *****ESTO SE DEBERÍA HACER DESPUES DE CHEQUEAR QUE EL USUARIO PAGÓ*****
        objetoComprado.fixStock(); 
    }
    
    let montoTotal = objetoComprado.precio * cantidadComprada * 1.22; 
    return montoTotal;
};
let totalSinDescuento = venta();
//END CALCULO

//USUARIO DESCUENTO
let cuponDescuento = prompt("Otorgamos descuentos de hasta el 50% de su valor de compra. ¿Cuál es el % de desuento de su cupón?");
validar(cuponDescuento, 50, 3); //Llamo a la funcion para validar los datos del usuario
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
    validar(cuotas, 10, 4); //Llamo a la funcion para validar los datos del usuario
    let pagoTotal, pagoCuotas;
    //END USUARIO

    //Devuelvo valores en array
    return [pagoTotal, cuotas, pagoCuotas] = [(totalSinDescuento * cuponDescuento), cuotas, ((totalSinDescuento * cuponDescuento)/cuotas)]
};
let aPagar = pago(); // Respuesta de funcion pago. Devuelve un array.
//END CALCULO

//INFO PARA EL USUARIO
alert("USTED ESTÁ COMPRANDO: \nCalzado: " + objetoComprado.marca + " - " + objetoComprado.modelo + "\nCantidad: " + cantidadComprada  + "\n-------------\nSu descuento es del: " + Math.round((100-(cuponDescuento*100))) + "%\n-------------\nDebe pagar: $" + Math.round(aPagar[0]) + "\nCuotas: " + aPagar[1] + "\nPago Mensual: $" + Math.round(aPagar[2]));
//Muestra como quedo el objeto modificado luego de la compra por consola ya que este valor es relevante solo para la tienda.
console.log(objetoComprado);

