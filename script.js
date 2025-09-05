// База даних продуктів (зберігається в localStorage)
let products = JSON.parse(localStorage.getItem('products')) || [
    { id: 1, title: 'Chanel No.5', desc: 'Класичний аромат', price: 500, image: 'images/chanel.jpg', brand: 'Chanel' },
    { id: 2, title: 'Dior Sauvage', desc: 'Свіжий чоловічий', price: 600, image: 'images/dior.jpg', brand: 'Dior' },
    // Додайте більше продуктів
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Функція збереження
function saveData() {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Оновлення лічильника корзини
function updateCartCount() {
    document.getElementById('cart-count').innerText = cart.length;
}

// Відображення популярних на головній (перші 3)
function displayPopular() {
    const row = document.getElementById('popular-products-row');
    if (row) {
        row.innerHTML = products.slice(0, 3).map(p => `
            <div class="col-md-4">
                <div class="card product-card">
                    <img src="${p.image}" class="card-img-top" alt="${p.title}">
                    <div class="card-body">
                        <h5 class="card-title">${p.title}</h5>
                        <p>${p.price} грн / 100 мл</p>
                        <a href="product.html?id=${p.id}" class="btn btn-primary">Деталі</a>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Каталог: відображення з фільтрами та пагінацією
function displayCatalog() {
    const row = document.getElementById('catalog-row');
    const search = document.getElementById('search-input');
    const brandFilter = document.getElementById('filter-brand');
    const priceFilter = document.getElementById('filter-price');
    const pagination = document.getElementById('pagination');
    const itemsPerPage = 6;
    let currentPage = 1;

    function render(page = 1) {
        let filtered = products.filter(p => {
            const s = search.value.toLowerCase();
            const b = brandFilter.value;
            const pr = priceFilter.value;
            return (!s || p.title.toLowerCase().includes(s)) &&
                   (!b || p.brand === b) &&
                   (!pr || (pr === 'low' ? p.price < 500 : p.price >= 500));
        });
        const totalPages = Math.ceil(filtered.length / itemsPerPage);
        const start = (page - 1) * itemsPerPage;
        row.innerHTML = filtered.slice(start, start + itemsPerPage).map(p => `
            <div class="col-md-4 mb-4">
                <div class="card product-card">
                    <img src="${p.image}" class="card-img-top" alt="${p.title}">
                    <div class="card-body">
                        <h5>${p.title}</h5>
                        <p>${p.price} грн / 100 мл</p>
                        <a href="product.html?id=${p.id}" class="btn btn-primary">Деталі</a>
                    </div>
                </div>
            </div>
        `).join('');

        pagination.innerHTML = Array.from({length: totalPages}, (_, i) => `
            <li class="page-item ${i + 1 === page ? 'active' : ''}">
                <a class="page-link" href="#" onclick="render(${i + 1})">${i + 1}</a>
            </li>
        `).join('');
    }

    if (row) {
        search.addEventListener('input', () => render());
        brandFilter.addEventListener('change', () => render());
        priceFilter.addEventListener('change', () => render());
        render();
    }
}

// Сторінка продукту
function displayProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get('id'));
    const product = products.find(p => p.id === id);
    if (product) {
        document.getElementById('product-title').innerText = product.title;
        document.getElementById('product-description').innerText = product.desc;
        document.getElementById('product-price').innerText = `${product.price} грн / 100 мл`;
        document.getElementById('product-image').src = product.image;
    }

    // Відгуки (з localStorage)
    let reviews = JSON.parse(localStorage.getItem(`reviews_${id}`)) || [];
    document.getElementById('reviews').innerHTML = reviews.map(r => `<p>${r}</p>`).join('');

    document.getElementById('review-form').addEventListener('submit', e => {
        e.preventDefault();
        const text = e.target[0].value;
        if (text) {
            reviews.push(text);
            localStorage.setItem(`reviews_${id}`, JSON.stringify(reviews));
            displayProduct();
            e.target[0].value = '';
        }
    });
}

// Додати в корзину
function addToCart() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get('id'));
    const volume = document.getElementById('volume-select').value;
    const product = products.find(p => p.id === id);
    cart.push({ ...product, volume });
    saveData();
    updateCartCount();
    alert('Додано в корзину!');
}

// Корзина
function displayCart() {
    const items = document.getElementById('cart-items');
    if (items) {
        items.innerHTML = cart.map((item, index) => `
            <tr>
                <td>${item.title}</td>
                <td>${item.volume} мл</td>
                <td>${item.price / 100 * item.volume} грн</td>
                <td>1</td> <!-- Можна додати кількість -->
                <td>${item.price / 100 * item.volume} грн</td>
                <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">Видалити</button></td>
            </tr>
        `).join('');
        const total = cart.reduce((sum, item) => sum + (item.price / 100 * item.volume), 0);
        document.getElementById('total-price').innerText = `Всього: ${total} грн`;
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveData();
    displayCart();
    updateCartCount();
}

// Бронювання
function displayBooking() {
    const select = document.getElementById('booking-product');
    if (select) {
        select.innerHTML = products.map(p => `<option value="${p.id}">${p.title}</option>`).join('');
    }
    document.getElementById('booking-form').addEventListener('submit', e => {
        e.preventDefault();
        alert('Бронювання успішне!');
    });
}

// Логін (симуляція)
function login() {
    document.getElementById('login-form').addEventListener('submit', e => {
        e.preventDefault();
        localStorage.setItem('user', 'logged');
        window.location.href = 'index.html';
    });
}

function register() {
    // Аналогічно логіну
    alert('Реєстрація успішна!');
}

// Адмін
function displayAdmin() {
    const form = document.getElementById('add-product-form');
    const list = document.getElementById('admin-products');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const newProduct = {
                id: products.length + 1,
                title: document.getElementById('admin-title').value,
                desc: document.getElementById('admin-desc').value,
                price: parseInt(document.getElementById('admin-price').value),
                image: document.getElementById('admin-image').value,
                brand: 'Other' // Можна додати поле
            };
            products.push(newProduct);
            saveData();
            displayAdmin();
            form.reset();
        });
        list.innerHTML = products.map(p => `<li>${p.title} <button onclick="deleteProduct(${p.id})">Видалити</button></li>`).join('');
    }
}

function deleteProduct(id) {
    products = products.filter(p => p.id !== id);
    saveData();
    displayAdmin();
}

// Ініціалізація на завантаженні
window.onload = () => {
    updateCartCount();
    if (document.getElementById('popular-products-row')) displayPopular();
    if (document.getElementById('catalog-row')) displayCatalog();
    if (document.getElementById('product-title')) displayProduct();
    if (document.getElementById('cart-items')) displayCart();
    if (document.getElementById('booking-product')) displayBooking();
    if (document.getElementById('login-form')) login();
    if (document.getElementById('add-product-form')) displayAdmin();
};
