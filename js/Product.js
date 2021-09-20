//CONSTRUCTOR PRODUCTS - CREADORA DE OBJETOS
export class Product {
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
