// Función para cargar productos desde el archivo JSON
function loadProducts(categoria) {
    fetch('productos.json')
        .then(response => response.json())
        .then(data => {
            const productos = data.productos.filter(product => product.categoria === categoria);
            renderProducts(productos);
        })
        .catch(err => console.error('Error al cargar el JSON', err));
}

// Función para mostrar los productos en el DOM
function renderProducts(productos) {
    const productsGrid = document.querySelector('.products-grid');
    productsGrid.innerHTML = ''; // Limpiar productos anteriores

    productos.forEach(product => {
        const productCard = `
            <div class="product-card">
                <img src="${product.imagen}" alt="${product.nombre}">
                <h3>${product.nombre}</h3>
                <p>${product.descripcion}</p>
                <span>${product.precio}</span>
            </div>
        `;
        productsGrid.innerHTML += productCard;
    });

    // Mostrar la sección de productos y ocultar las categorías
    document.getElementById('products').style.display = 'block';
    document.getElementById('categories').style.display = 'none';
}

// Función para cargar productos según la categoría seleccionada
function showProducts(categoria) {
    loadProducts(categoria); // Cargar productos desde el JSON
    const categoryTitle = document.getElementById('products-category');
    categoryTitle.textContent = `Productos de ${capitalizeFirstLetter(categoria)}`;
}

// Función para volver a las categorías
function backToCategories() {
    document.getElementById('products').style.display = 'none';
    document.getElementById('categories').style.display = 'block';
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-item');
const totalSlides = slides.length;

document.querySelector('.next').addEventListener('click', () => {
    moveToNextSlide();
});

document.querySelector('.prev').addEventListener('click', () => {
    moveToPrevSlide();
});

function updateCarousel() {
    slides.forEach((slide, index) => {
        slide.style.transform = `translateX(${(index - currentSlide) * 100}%)`;
    });
}

function moveToNextSlide() {
    currentSlide = (currentSlide === totalSlides - 1) ? 0 : currentSlide + 1;
    updateCarousel();
}

function moveToPrevSlide() {
    currentSlide = (currentSlide === 0) ? totalSlides - 1 : currentSlide - 1;
    updateCarousel();
}

updateCarousel();
