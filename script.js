// THAY THẾ TOÀN BỘ FILE SCRIPT.JS BẰNG CODE NÀY

document.addEventListener('DOMContentLoaded', () => {
    
    // Khai báo các biến tham chiếu đến các phần tử HTML
    const categoryNav = document.getElementById('category-nav');
    const productList = document.getElementById('product-list');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const paginationControls = document.getElementById('pagination-controls');
    
    // Khai báo các biến trạng thái
    let allProducts = [];
    let currentProducts = []; // Danh sách sản phẩm sau khi đã lọc
    let currentPage = 1;
    const itemsPerPage = 25; // 5 hàng x 5 sản phẩm = 25

    // Hàm để lấy dữ liệu sản phẩm từ file JSON
    async function fetchData() {
        try {
            const response = await fetch('mock-data.json');
            const data = await response.json();
            allProducts = data.products;
            currentProducts = allProducts; // Ban đầu, hiển thị tất cả
            displayCategories(data.categories);
            renderCurrentPage();
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
            productList.innerHTML = '<p>Không thể tải dữ liệu sản phẩm.</p>';
        }
    }

    function displayCategories(categories) {
        // Xóa hết nội dung cũ và thêm lại tiêu đề
        categoryNav.innerHTML = '<h2>Danh mục sản phẩm</h2>';

        // Tạo và thêm nút "Tất cả sản phẩm"
        const allButton = document.createElement('button');
        allButton.textContent = 'Tất cả sản phẩm';
        allButton.classList.add('category-button', 'active');
        allButton.onclick = (event) => {
            handleFilter(event.currentTarget, null);
        };
        categoryNav.appendChild(allButton);
        
        // Tạo và thêm các nút cho danh mục khác
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

    // Hàm xử lý chung cho việc lọc sản phẩm
    function handleFilter(clickedButton, categoryId) {
        // Cập nhật trạng thái active cho nút
        document.querySelectorAll('.category-button').forEach(btn => btn.classList.remove('active'));
        clickedButton.classList.add('active');

        const searchTerm = searchInput.value.toLowerCase();
        let filtered = allProducts;

        // Lọc theo danh mục
        if (categoryId) {
            filtered = filtered.filter(p => p.category_id === categoryId);
        }

        // Lọc tiếp theo từ khóa tìm kiếm
        if (searchTerm) {
            filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm));
        }
        
        currentProducts = filtered;
        currentPage = 1; // Reset về trang 1 mỗi khi có bộ lọc mới
        renderCurrentPage();
    }
    
    // Hàm để render sản phẩm và các nút chuyển trang
    function renderCurrentPage() {
        displayProducts();
        setupPagination();
    }

    // Hàm để hiển thị danh sách sản phẩm của trang hiện tại
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
            productCard.innerHTML = `<a href="product.html?id=${product.id}" class="product-card-link"><img src="${product.image_url}" alt="${product.name}" class="product-image"><div class="product-info"><h3 class="product-name">${product.name}</h3><p class="product-platform">${product.platform}</p><p class="product-price">${product.price.toLocaleString('vi-VN')} ₫</p><span class="buy-button">Xem chi tiết</span></div></a>`;
            productList.appendChild(productCard);
        });
    }

    // Hàm để tạo và quản lý các nút chuyển trang
    function setupPagination() {
        paginationControls.innerHTML = '';
        const pageCount = Math.ceil(currentProducts.length / itemsPerPage);

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
                window.scrollTo(0, 0); // Cuộn lên đầu trang khi chuyển trang
            });
            paginationControls.appendChild(button);
        }
    }

    // Gắn sự kiện cho thanh tìm kiếm
    searchButton.addEventListener('click', () => {
        const activeCategoryButton = document.querySelector('.category-button.active');
        handleFilter(activeCategoryButton, activeCategoryButton.textContent === 'Tất cả sản phẩm' ? null : currentProducts[0]?.category_id);
    });
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });

    // Bắt đầu chạy ứng dụng
    fetchData();
});