// Función para cargar productos desde el archivo JSON
function loadProducts(categoria) {
    fetch('productos.json')
        .then(response => response.json())
        .then(data => {
            let productos = [];
            
            // Renderizar productos destacados en el carrusel, pero no en la sección de categorías
            if (categoria === 'producto_destacado') {
                productos = data.producto_destacado;
                renderCarousel(productos); // Renderizar productos en el carrusel
            } 
            // Renderizar productos en la sección de "otros"
            else if (categoria === 'otros') {
                productos = data.otros;
                renderProducts(productos, categoria);
            } 
            // Renderizar productos de la subcategoría "tintes"
            else if (categoria === 'otros_tintes') {
                productos = data.otros.tintes;
                renderProducts(productos, categoria);
            } 
            // Renderizar productos de otras categorías
            else {
                productos = data.productos.filter(product => product.categoria === categoria);
                renderProducts(productos, categoria);
            }
        })
        .catch(err => console.error('Error al cargar el JSON', err));
}

function loadRecentProducts() {
    fetch('productos.json')
        .then(response => response.json())
        .then(data => {
            const recentProducts = data.productos_recientes;
            renderRecentProducts(recentProducts);
        })
        .catch(err => console.error('Error al cargar los productos recientes', err));
}

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

// Llama a la función para cargar los productos recientes al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    loadRecentProducts();  // Cargar los productos recientes desde el JSON
});

// Función para mostrar los productos de categoría en el DOM
function renderProducts(productos, categoria) {
    const productsGrid = document.querySelector('.products-grid');
    productsGrid.innerHTML = ''; // Limpiar productos anteriores

    productos.forEach(product => {
        // Si es la subcategoría de "tintes", incluir los colores
        let colorOptions = '';
        if (categoria === 'otros_tintes' && product.colores) {
            colorOptions = `
            <div class="color-description"><strong>Colores disponibles:</strong></div>
            <div class="color-options">
                ${product.colores.map(color => `<span class="color-circle" style="background-color:${color};"></span>`).join('')}
            </div>`;
        }

        const productCard = `
            <div class="product-card">
                <img src="${product.imagen}" alt="${product.nombre}">
                <h3>${product.nombre}</h3>
                <p>${product.descripcion}</p>
                <span>${product.precio}</span>
                ${colorOptions} <!-- Agregar los colores si es necesario -->
            </div>
        `;
        productsGrid.innerHTML += productCard;
    });

    // Mostrar la sección de productos y ocultar las categorías
    document.getElementById('products').style.display = 'block';
    document.getElementById('categories').style.display = 'none';
}

// Nueva función para renderizar el carrusel de productos destacados
function renderCarousel(productos) {
    const carousel = document.querySelector('.carousel');
    carousel.innerHTML = ''; // Limpiar carrusel anterior

    productos.forEach((producto, index) => {
        const activeClass = index === 0 ? 'active' : ''; // El primer producto es activo
        const carouselItem = `
            <div class="carousel-item ${activeClass}">
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <div class="carousel-caption">
                    <h2>${producto.nombre}</h2>
                    <p>${producto.descripcion}</p>
                    <span>${producto.precio}</span>
                </div>
            </div>
        `;
        carousel.innerHTML += carouselItem;
    });

    updateCarousel(); // Inicializar el carrusel
}

// Función para inicializar el carrusel
function updateCarousel() {
    const slides = document.querySelectorAll('.carousel-item');
    let currentSlide = 0;
    const totalSlides = slides.length;

    document.querySelector('.next').addEventListener('click', () => {
        currentSlide = (currentSlide === totalSlides - 1) ? 0 : currentSlide + 1;
        updateSlides();
    });

    document.querySelector('.prev').addEventListener('click', () => {
        currentSlide = (currentSlide === 0) ? totalSlides - 1 : currentSlide - 1;
        updateSlides();
    });

    function updateSlides() {
        slides.forEach((slide, index) => {
            slide.style.transform = `translateX(${(index - currentSlide) * 100}%)`;
        });
    }

    updateSlides(); // Mostrar la primera vista del carrusel
}

// Función para cargar productos según la categoría seleccionada
function showProducts(categoria) {
    // Cargar productos desde el JSON solo si la categoría no es "producto_destacado"
    if (categoria === 'producto_destacado') {
        loadProducts('producto_destacado'); // Cargar solo productos destacados en el carrusel
    } else {
        loadProducts(categoria); // Cargar otras categorías
    }
    
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

// Función para abrir/cerrar el menú lateral
function toggleMenu() {
    const menu = document.getElementById('main-menu'); // El menú lateral para móviles
    const overlay = document.getElementById('menu-overlay'); // Fondo oscuro
    menu.classList.toggle('active'); // Mostrar/ocultar el menú
    overlay.classList.toggle('active'); // Mostrar/ocultar el fondo oscuro
}

// Función para seleccionar una opción del menú
function selectMenuOption(option) {
    // Ocultar el menú lateral automáticamente después de seleccionar una opción
    toggleMenu();
    
    // Desplazarse suavemente a la sección seleccionada
    const section = document.querySelector(option);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }

    console.log(`Opción seleccionada: ${option}`);
}

// Añadir eventos a cada opción del menú para cerrar automáticamente después de hacer clic
document.querySelectorAll('#main-menu a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto del enlace
        const href = link.getAttribute('href');
        selectMenuOption(href); // Pasar la opción seleccionada al menú
    });
});

// Iniciar la página mostrando productos destacados en el carrusel y las categorías
document.addEventListener('DOMContentLoaded', () => {
    loadProducts('producto_destacado'); // Mostrar productos destacados al inicio
    document.getElementById('categories').style.display = 'block';
    document.getElementById('products').style.display = 'none'; // Los productos no se muestran inicialmente
    document.getElementById('carousel').style.display = 'block'; // Mostrar productos destacados en el carrusel
});
