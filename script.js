// Chờ cho toàn bộ nội dung HTML được tải xong rồi mới chạy script
document.addEventListener('DOMContentLoaded', () => {
    
    const categoryNav = document.getElementById('category-nav');
    const productList = document.getElementById('product-list');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const paginationControls = document.getElementById('pagination-controls');
    const sortSelect = document.getElementById('sort-select');
    
    let allProducts = [];
    let currentProducts = [];
    let currentPage = 1;
    const itemsPerPage = 25;
    let currentCategoryId = null;

    // Hàm để lấy dữ liệu sản phẩm từ file JSON (chỉ lấy 1 lần)
    async function fetchData() {
        try {
            const response = await fetch('mock-data.json');
            const data = await response.json();
            allProducts = data.products;
            displayCategories(data.categories);
            // KHÔNG hiển thị sản phẩm lúc đầu nữa
            productList.innerHTML = '<p>Không tìm thấy sản phẩm nào.</p>';
            paginationControls.innerHTML = '';
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
            productList.innerHTML = '<p>Không thể tải dữ liệu sản phẩm.</p>';
        }
    }

    // Hàm để hiển thị các nút danh mục (ĐÃ BỎ NÚT "Tất cả sản phẩm")
    function displayCategories(categories) {
        categoryNav.innerHTML = '<h2>Danh mục sản phẩm</h2>';

        // KHỐI CODE TẠO NÚT "Tất cả sản phẩm" ĐÃ BỊ XÓA

        // Tạo và thêm các nút cho danh mục khác
        categories.forEach(category => {
            const button = document.createElement('button');
            button.textContent = category.name;
            button.classList.add('category-button');
            // Gán category ID vào dataset để dễ lấy
            button.dataset.categoryId = category.id;
            button.onclick = (event) => {
                handleCategoryClick(event.currentTarget, category.id);
            };
            categoryNav.appendChild(button);
        });
    }

    // --- HÀM MỚI: Xử lý khi bấm vào danh mục ---
    function handleCategoryClick(clickedButton, categoryId) {
        currentCategoryId = categoryId;
        searchInput.value = '';

        document.querySelectorAll('.category-button').forEach(btn => btn.classList.remove('active'));
        if (clickedButton) clickedButton.classList.add('active');

        // Gọi hàm tìm kiếm/lọc (đã bao gồm hiển thị loading)
        filterAndDisplayProducts();
    }

    // --- HÀM MỚI: Xử lý khi bấm nút tìm kiếm ---
    function handleSearchClick() {
        currentCategoryId = null;
        document.querySelectorAll('.category-button').forEach(btn => btn.classList.remove('active'));

        // Gọi hàm tìm kiếm/lọc (đã bao gồm hiển thị loading)
        filterAndDisplayProducts();
    }

    // --- HÀM MỚI: Lọc, Sắp xếp và Hiển thị sản phẩm (Có trạng thái Loading) ---
    async function filterAndDisplayProducts() { // Thêm async để sau này gọi API
        const searchTerm = searchInput.value.toLowerCase();
        const sortOption = sortSelect.value;

        // *** BƯỚC 1: HIỂN THỊ THÔNG BÁO LOADING ***
        productList.innerHTML = '<p class="loading-text">Đang tìm kiếm sản phẩm...</p>';
        paginationControls.innerHTML = ''; // Xóa phân trang cũ

        // *** BƯỚC 2: (GIẢ LẬP GỌI BACKEND) LỌC DỮ LIỆU TỪ MOCK DATA ***
        // Sau này, bạn sẽ thay thế phần lọc này bằng lệnh fetch() gọi API backend
        // Ví dụ: const response = await fetch(`/api/products/search?q=${searchTerm}&category_id=${currentCategoryId}&sort_by=${sortOption}`);
        // const results = await response.json();
        // let filtered = results.products; // Lấy dữ liệu từ API

        // (Code hiện tại - Giả lập bằng mock data)
        let filtered = allProducts;
        if (currentCategoryId) {
            filtered = filtered.filter(p => p.category_id === currentCategoryId);
        } else if (searchTerm) {
            filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm));
        } else {
            filtered = []; // Không hiển thị gì nếu chưa chọn/tìm
        }

        // (Giả lập thời gian chờ của backend) - BẠN CÓ THỂ BỎ DÒNG NÀY KHI CÓ BACKEND THẬT
        await new Promise(resolve => setTimeout(resolve, 500)); // Chờ 0.5 giây

        // *** BƯỚC 3: SẮP XẾP KẾT QUẢ ***
        if (filtered.length > 0) {
            if (sortOption === 'price_asc') {
                filtered.sort((a, b) => a.price - b.price);
            } else if (sortOption === 'price_desc') {
                filtered.sort((a, b) => b.price - a.price);
            }
        }

        // *** BƯỚC 4: HIỂN THỊ KẾT QUẢ (HOẶC THÔNG BÁO KHÔNG TÌM THẤY) ***
        currentProducts = filtered;
        currentPage = 1;
        renderCurrentPage(); // Hàm này sẽ gọi displayProducts và setupPagination
    }
        
    // Hàm để render sản phẩm và các nút chuyển trang (không đổi)
    function renderCurrentPage() {
        displayProducts();
        setupPagination();
    }

    // Hàm để hiển thị danh sách sản phẩm của trang hiện tại (không đổi)
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

    // Hàm để tạo và quản lý các nút chuyển trang (không đổi)
    function setupPagination() {
        paginationControls.innerHTML = '';
        const pageCount = Math.ceil(currentProducts.length / itemsPerPage);

        if (pageCount <= 1) return;

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

    // Gắn sự kiện cho thanh tìm kiếm và dropdown sắp xếp
    searchButton.addEventListener('click', handleSearchClick);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearchClick();
        }
    });
    sortSelect.addEventListener('change', filterAndDisplayProducts); 

    // Bắt đầu chạy ứng dụng (chỉ tải data, không hiển thị ngay)
    fetchData();
});