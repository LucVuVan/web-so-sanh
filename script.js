document.addEventListener('DOMContentLoaded', () => {
    
    const categoryNav = document.getElementById('category-nav');
    const productList = document.getElementById('product-list');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const paginationControls = document.getElementById('pagination-controls');
    
    let allProducts = [];
    let currentProducts = [];
    let currentPage = 1;
    const itemsPerPage = 25;

    async function fetchData() {
        try {
            const response = await fetch('mock-data.json');
            const data = await response.json();
            allProducts = data.products;
            currentProducts = allProducts;
            displayCategories(data.categories);
            renderCurrentPage();
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
            productList.innerHTML = '<p>Không thể tải dữ liệu sản phẩm.</p>';
        }
    }

    function displayCategories(categories) {
        categoryNav.innerHTML = '<h2>Danh mục sản phẩm</h2>';

        const allButton = document.createElement('button');
        allButton.textContent = 'Tất cả sản phẩm';
        allButton.classList.add('category-button', 'active');
        allButton.onclick = (event) => {
            handleFilter(event.currentTarget, null);
        };
        categoryNav.appendChild(allButton);
        
        categories.forEach(category => {
            const button = document.createElement('button');
            button.textContent = category.name;
            button.classList.add('category-button');
            button.onclick = (event) => {
                handleFilter(event.currentTarget, category.id);
            };
            categoryNav.appendChild(button);
        });
    }

    function handleFilter(clickedButton, categoryId) {
        document.querySelectorAll('.category-button').forEach(btn => btn.classList.remove('active'));
        if (clickedButton) clickedButton.classList.add('active');

        const searchTerm = searchInput.value.toLowerCase();
        let filtered = allProducts;

        if (categoryId) {
            filtered = filtered.filter(p => p.category_id === categoryId);
        }

        if (searchTerm) {
            filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm));
        }
        
        currentProducts = filtered;
        currentPage = 1;
        renderCurrentPage();
    }
    
    function renderCurrentPage() {
        displayProducts();
        setupPagination();
    }

    function displayProducts() {
        productList.innerHTML = '';
        
        if (currentProducts.length === 0) {
            productList.innerHTML = '<p>Không tìm thấy sản phẩm nào.</p>';
            return;
        }

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageProducts = currentProducts.slice(startIndex, endIndex);

        pageProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <a href="product.html?id=${product.id}" class="product-card-link">
                    <img src="${product.image_url}" alt="${product.name}" class="product-image">
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-platform">${product.platform}</p>
                        <p class="product-price">${product.price.toLocaleString('vi-VN')} ₫</p>
                        <span class="buy-button">Xem chi tiết</span>
                    </div>
                </a>`;
            productList.appendChild(productCard);
        });
    }

    function setupPagination() {
        paginationControls.innerHTML = '';
        const pageCount = Math.ceil(currentProducts.length / itemsPerPage);

        if (pageCount <= 1) return; // Không hiển thị nút nếu chỉ có 1 trang

        for (let i = 1; i <= pageCount; i++) {
            const button = document.createElement('button');
            button.innerText = i;
            button.classList.add('page-button');
            if (i === currentPage) {
                button.classList.add('active');
            }
            button.addEventListener('click', () => {
                currentPage = i;
                renderCurrentPage();
                window.scrollTo(0, 0);
            });
            paginationControls.appendChild(button);
        }
    }

    searchButton.addEventListener('click', () => {
        const activeCategoryButton = document.querySelector('.category-button.active');
        const activeCategoryId = activeCategoryButton.textContent === 'Tất cả sản phẩm' ? null : activeCategoryButton.dataset.categoryId;
        handleFilter(activeCategoryButton, activeCategoryId);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });

    fetchData();
});