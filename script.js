// Chờ cho toàn bộ nội dung HTML được tải xong rồi mới chạy script
document.addEventListener('DOMContentLoaded', () => {
    
    const categoryNav = document.getElementById('category-nav');
    const productList = document.getElementById('product-list');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    
    let allProducts = []; // Biến để lưu trữ tất cả sản phẩm
    let currentCategory = null; // Biến để theo dõi danh mục hiện tại
    // DÁN ĐOẠN NÀY VÀO TRONG SỰ KIỆN DOMContentLoaded, TRƯỚC fetchData()

    // --- Logic cho Modal Đăng nhập ---
    const loginButton = document.querySelector('.login-button');
    const loginModal = document.getElementById('login-modal');
    const closeModalButton = loginModal.querySelector('.close-button');

    // Mở modal khi bấm nút Đăng nhập
    loginButton.addEventListener('click', (event) => {
        event.preventDefault(); // Ngăn thẻ <a> chuyển trang
        loginModal.classList.remove('hidden');
    });

    // Đóng modal khi bấm nút X
    closeModalButton.addEventListener('click', () => {
        loginModal.classList.add('hidden');
    });

    // Đóng modal khi bấm ra ngoài vùng form
    loginModal.addEventListener('click', (event) => {
        // Chỉ đóng nếu click vào chính lớp overlay màu đen
        if (event.target === loginModal) {
            loginModal.classList.add('hidden');
        }
    });
    // Hàm để lấy dữ liệu từ file JSON giả
    async function fetchData() {
        try {
            const response = await fetch('mock-data.json');
            const data = await response.json();
            allProducts = data.products; // Lưu sản phẩm vào biến
            displayCategories(data.categories);
            displayProducts(allProducts); // Hiển thị tất cả sản phẩm lúc đầu
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
            productList.innerHTML = '<p>Không thể tải dữ liệu sản phẩm.</p>';
        }
    }

    // Hàm để hiển thị các danh mục

function displayCategories(categories) {
    // Thêm nút "Tất cả sản phẩm"
    const allButton = document.createElement('button');
    allButton.textContent = 'Tất cả sản phẩm';
    allButton.classList.add('category-button', 'active'); // Mặc định active lúc đầu
    allButton.onclick = (event) => {
        // Xóa class 'active' khỏi tất cả các nút
        document.querySelectorAll('.category-button').forEach(btn => btn.classList.remove('active'));
        // Thêm class 'active' cho nút vừa bấm
        event.currentTarget.classList.add('active');
        
        currentCategory = null;
        filterAndDisplayProducts();
    };
    categoryNav.appendChild(allButton);
    
    // Hiển thị các danh mục khác
    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category.name;
        button.classList.add('category-button');
        button.onclick = (event) => {
            // Xóa class 'active' khỏi tất cả các nút
            document.querySelectorAll('.category-button').forEach(btn => btn.classList.remove('active'));
            // Thêm class 'active' cho nút vừa bấm
            event.currentTarget.classList.add('active');

            currentCategory = category.id;
            filterAndDisplayProducts();
        };
        categoryNav.appendChild(button);
    });
}

    // Hàm để hiển thị sản phẩm ra màn hình
    // DÁN ĐOẠN CODE NÀY VÀO SCRIPT.JS
function displayProducts(products) {
    productList.innerHTML = ''; // Xóa các sản phẩm cũ
    
    if (products.length === 0) {
        productList.innerHTML = '<p>Không tìm thấy sản phẩm nào.</p>';
        return;
    }

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // DÒNG NÀY LÀ QUAN TRỌNG NHẤT
        productCard.innerHTML = `
            <img src="${product.image_url}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-platform">${product.platform}</p>
                <p class="product-price">${product.price.toLocaleString('vi-VN')} ₫</p>
                <a href="${product.url}" target="_blank" class="buy-button">Đến nơi bán</a>
            </div>
        `;
        productList.appendChild(productCard);
    });
}

    // Hàm lọc và hiển thị sản phẩm dựa trên từ khóa tìm kiếm và danh mục
    function filterAndDisplayProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        
        let filteredProducts = allProducts;

        // Lọc theo danh mục
        if (currentCategory) {
            filteredProducts = filteredProducts.filter(p => p.category_id === currentCategory);
        }

        // Lọc theo từ khóa tìm kiếm
        if (searchTerm) {
            filteredProducts = filteredProducts.filter(p => 
                p.name.toLowerCase().includes(searchTerm)
            );
        }
        
        displayProducts(filteredProducts);
    }

    // Gắn sự kiện cho nút tìm kiếm và ô input
    searchButton.addEventListener('click', filterAndDisplayProducts);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            filterAndDisplayProducts();
        }
    });

    // Bắt đầu chạy ứng dụng
    fetchData();
});
