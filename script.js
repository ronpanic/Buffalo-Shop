class Productos {
  constructor() {
    this.productContainer = document.getElementById('product-container');
    this.totalPriceElement = document.getElementById('total-price');
    this.deleteButton = document.getElementById('delete-button');
    this.cartItemsElement = document.getElementById('cart-items');

    this.totalPrice = parseFloat(localStorage.getItem('totalPrice')) || 0;
    this.selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];

    this.obtenerProductos()
      .then(productos => {
        this.renderizarProductos(productos);
        this.renderizarCarrito(); 
      })
      .catch(error => console.error('Error al cargar el archivo JSON:', error));

    this.totalPriceElement.textContent = 'Precio final: $' + this.totalPrice.toFixed(2);
    this.deleteButton.addEventListener('click', this.borrarProductos.bind(this));
  }

  obtenerProductos() {
    return fetch('productos.json').then(response => response.json());
  }

  renderizarProductos(productos) {
    productos.forEach(producto => {
      const productDiv = document.createElement('div');
      productDiv.classList.add('plan1-container');

      const imageElement = document.createElement('img');
      imageElement.classList.add('product-image');
      imageElement.src = producto.imagen;

      const nameElement = document.createElement('h1');
      nameElement.classList.add('product-name');
      nameElement.textContent = producto.nombre;

      const priceElement = document.createElement('p');
      priceElement.classList.add('product-price');
      priceElement.textContent = '$' + producto.precio.toFixed(2);

      const buttonElement = document.createElement('button');
      buttonElement.classList.add('add-to-cart-button');
      buttonElement.textContent = 'Agregar al carrito';

      buttonElement.addEventListener('click', () => {
        this.agregarProductoAlCarrito(producto);
      });

      productDiv.appendChild(imageElement);
      productDiv.appendChild(nameElement);
      productDiv.appendChild(priceElement);
      productDiv.appendChild(buttonElement);

      this.productContainer.appendChild(productDiv);
    });
  }

  agregarProductoAlCarrito(producto) {
    const productInCart = this.selectedProducts.find(item => item.nombre === producto.nombre);

    if (!productInCart) {
      this.selectedProducts.push(producto);
      this.totalPrice += producto.precio;
      this.totalPriceElement.textContent = 'Precio final: $' + this.totalPrice.toFixed(2);
      this.guardarDatosEnStorage();
      this.renderizarCarrito();

      Toastify({
        text: 'Producto añadido',
        backgroundColor: 'linear-gradient(to right, #283e51, #4B79A1)',
        className: 'toastify-message',
      }).showToast();
    }
  }

  renderizarCarrito() {
    this.cartItemsElement.innerHTML = '';

    if (this.selectedProducts.length === 0) {
      const emptyCartElement = document.createElement('p');
      emptyCartElement.textContent = 'El carrito está vacío';
      this.cartItemsElement.appendChild(emptyCartElement);
    } else {
      this.selectedProducts.forEach(producto => {
        const productItem = document.createElement('p');
        productItem.textContent = producto.nombre;
        this.cartItemsElement.appendChild(productItem);
      });
    }
  }

  guardarDatosEnStorage() {
    localStorage.setItem('totalPrice', this.totalPrice.toString());
    localStorage.setItem('selectedProducts', JSON.stringify(this.selectedProducts));
  }

  borrarProductos() {
    this.totalPrice = 0;
    this.totalPriceElement.textContent = 'Precio final: $00.00';
    this.selectedProducts = [];
    this.guardarDatosEnStorage();
    this.renderizarCarrito();
  }
}

const productos = new Productos();
