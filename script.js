// Función para cargar productos desde el archivo JSON
function loadProducts(categoria) {
    fetch('productos.json')
        .then(response => response.json())
        .then(data => {
            let productos = [];

            // Filtra los productos según la categoría
            if (categoria === 'producto_destacado') {
                productos = data.producto_destacado;
                renderCarousel(productos);
            }
            else if (categoria === 'otros') {
                productos = data.otros;
                renderProducts(productos, categoria);
            }
            else if (categoria === 'otros_tintes') {
                productos = data.otros.tintes;
                renderProducts(productos, categoria);
            }
            else {
                productos = data.productos.filter(product => product.categoria === categoria);
                renderProducts(productos, categoria);
            }
        })
        .catch(err => console.error('Error al cargar el JSON', err));
}

// Función para mostrar los productos de categoría en el DOM
function renderProducts(productos, categoria) {
    const productsGrid = document.querySelector('.products-grid');
    productsGrid.innerHTML = ''; // Limpiar productos anteriores

    productos.forEach(product => {
        let imageGallery = '';

        // Verifica si el producto tiene varias imágenes
        if (product.imagenes && product.imagenes.length > 1) {
            imageGallery = `
            <div class="carousel-container">
                <div class="carousel">
                    ${product.imagenes.map(imagen => `<img src="${imagen}" alt="${product.nombre}">`).join('')}
                </div>
                <button class="prev" onclick="prevImage(this)">&#10094;</button>
                <button class="next" onclick="nextImage(this)">&#10095;</button>
            </div>`;
        } else if (product.imagenes && product.imagenes.length === 1) {
            imageGallery = `<img src="${product.imagenes[0]}" alt="${product.nombre}">`;
        } else {
            imageGallery = `<img src="${product.imagen}" alt="${product.nombre}">`;
        }

        let colorOptions = '';
        // Verifica si el producto tiene opciones de colores
        if (product.colores && product.colores.length > 0) {
            colorOptions = `
            <div class="color-description"><strong>Colores disponibles:</strong></div>
            <div class="color-options">
                ${product.colores.map(color => `
                    <span class="color-circle" 
                          style="background-color:${color.hex};"
                          title="${color.nombre}">
                    </span>`).join('')}
            </div>`;
        }

        // Tarjeta de producto
        const productCard = `
            <div class="product-card">
                ${imageGallery} <!-- Muestra la galería o una imagen -->
                <h3>${product.nombre}</h3>
                <p>${product.descripcion}</p>
                <span>${product.precio}</span>
                ${colorOptions} <!-- Mostrar los colores si están disponibles -->
            </div>
        `;
        productsGrid.innerHTML += productCard;
    });

    // Mostrar la sección de productos y ocultar las categorías
    document.getElementById('products').style.display = 'block';
    document.getElementById('categories').style.display = 'none';
}

// Función para manejar la navegación del carrusel de imágenes
function nextImage(button) {
    const carousel = button.closest('.carousel-container').querySelector('.carousel');
    const totalImages = carousel.children.length;
    const currentImageIndex = getCurrentImageIndex(carousel);

    const nextIndex = (currentImageIndex + 1) % totalImages;
    carousel.style.transform = `translateX(-${nextIndex * 100}%)`;
}

function prevImage(button) {
    const carousel = button.closest('.carousel-container').querySelector('.carousel');
    const totalImages = carousel.children.length;
    const currentImageIndex = getCurrentImageIndex(carousel);

    const prevIndex = (currentImageIndex - 1 + totalImages) % totalImages;
    carousel.style.transform = `translateX(-${prevIndex * 100}%)`;
}

function getCurrentImageIndex(carousel) {
    const transformValue = getComputedStyle(carousel).transform;
    const matrix = new WebKitCSSMatrix(transformValue);
    const currentIndex = Math.round(Math.abs(matrix.m41) / carousel.offsetWidth);
    return currentIndex;
}

// Función para cargar productos recientes desde el archivo JSON
function loadRecentProducts() {
    fetch('productos.json')
        .then(response => response.json())
        .then(data => {
            const recentProducts = data.productos_recientes;
            renderRecentProducts(recentProducts);
        })
        .catch(err => console.error('Error al cargar los productos recientes', err));
}

// Función para mostrar los productos recientes en el DOM
function renderRecentProducts(productos) {
    const recentProductsGrid = document.querySelector('.recent-products-grid');
    recentProductsGrid.innerHTML = ''; // Limpiar productos anteriores

    productos.forEach(product => {
        const productCard = `
            <div class="recent-product-card">
                <img src="${product.imagen}" alt="${product.nombre}">
                <h3>${product.nombre}</h3>
                <p>${product.descripcion}</p>
                <span>${product.precio}</span>
            </div>
        `;
        recentProductsGrid.innerHTML += productCard;
    });
}

// Función para cargar productos según la categoría seleccionada
function showProducts(categoria) {
    loadProducts(categoria); 
    const categoryTitle = document.getElementById('products-category');
    categoryTitle.textContent = `Productos de ${capitalizeFirstLetter(categoria.replace('_', ' '))}`;
}

// Función para volver a las categorías
function backToCategories() {
    document.getElementById('products').style.display = 'none';
    document.getElementById('categories').style.display = 'block';
}

// Función para capitalizar la primera letra
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// --- Funcionalidad del menú lateral desplegable ---
function toggleMenu() {
    const menu = document.getElementById('main-menu');
    const overlay = document.getElementById('menu-overlay');
    menu.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Iniciar la página mostrando productos destacados y productos recientes
document.addEventListener('DOMContentLoaded', () => {
    loadProducts('producto_destacado'); // Mostrar productos destacados
    loadRecentProducts(); // Mostrar productos recientes
    document.getElementById('categories').style.display = 'block';
    document.getElementById('products').style.display = 'none';
    document.getElementById('carousel').style.display = 'block';
});
