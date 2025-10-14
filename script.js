// Chờ cho toàn bộ nội dung HTML được tải xong rồi mới chạy script
document.addEventListener('DOMContentLoaded', () => {
    
    // Khai báo các biến tham chiếu đến các phần tử HTML
    const categoryNav = document.getElementById('category-nav');
    const productList = document.getElementById('product-list');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    
    // Khai báo các biến trạng thái
    let allProducts = []; // Biến để lưu trữ tất cả sản phẩm
    let currentCategory = null; // Biến để theo dõi danh mục hiện tại

    // Hàm để lấy dữ liệu sản phẩm từ file JSON
    async function fetchData() {
        try {
            const response = await fetch('mock-data.json');
            const data = await response.json();
            allProducts = data.products;
            displayCategories(data.categories);
            displayProducts(allProducts); // Hiển thị tất cả sản phẩm lúc đầu
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
            productList.innerHTML = '<p>Không thể tải dữ liệu sản phẩm.</p>';
        }
    }

    // Hàm để hiển thị các nút danh mục
    function displayCategories(categories) {
        // Tạo và thêm nút "Tất cả sản phẩm"
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
        
        // Tạo và thêm các nút cho danh mục khác
        categories.forEach(category => {
            const button = document.createElement('button');
            button.textContent = category.name;
            button.classList.add('category-button');
            button.onclick = (event) => {
                document.querySelectorAll('.category-button').forEach(btn => btn.classList.remove('active'));
                event.currentTarget.classList.add('active');

                currentCategory = category.id;
                filterAndDisplayProducts();
            };
            categoryNav.appendChild(button);
        });
    }

    // Hàm để hiển thị danh sách sản phẩm ra giao diện
    function displayProducts(products) {
        productList.innerHTML = ''; // Xóa các sản phẩm cũ
        
        if (products.length === 0) {
            productList.innerHTML = '<p>Không tìm thấy sản phẩm nào.</p>';
            return;
        }

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            productCard.innerHTML = `
                <img src="${product.image_url}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-platform">${product.platform}</p>
                    <p class="product-price">${product.price.toLocaleString('vi-VN')} ₫</p>
                    <a href="${product.url}" target="_blank" class="buy-button">So sánh giá</a>
                </div>
            `;
            productList.appendChild(productCard);
        });
    }

    // Hàm lọc và hiển thị lại sản phẩm dựa trên danh mục và từ khóa
    function filterAndDisplayProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        let filteredProducts = allProducts;

        // Lọc theo danh mục đã chọn
        if (currentCategory) {
            filteredProducts = filteredProducts.filter(p => p.category_id === currentCategory);
        }

        // Lọc tiếp theo từ khóa tìm kiếm
        if (searchTerm) {
            filteredProducts = filteredProducts.filter(p => 
                p.name.toLowerCase().includes(searchTerm)
            );
        }
        
        displayProducts(filteredProducts);
    }

    // Gắn sự kiện cho thanh tìm kiếm
    searchButton.addEventListener('click', filterAndDisplayProducts);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            filterAndDisplayProducts();
        }
    });

    // Bắt đầu chạy ứng dụng bằng cách lấy dữ liệu
    fetchData();
});