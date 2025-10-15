document.addEventListener('DOMContentLoaded', () => {
    const productDetailContainer = document.getElementById('product-detail-container');

    // Lấy ID sản phẩm từ URL
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId) {
        productDetailContainer.innerHTML = '<h1>Không tìm thấy ID sản phẩm.</h1>';
        return;
    }

    // Tải dữ liệu và tìm sản phẩm
    async function fetchProductDetails() {
        try {
            const response = await fetch('mock-data.json');
            const data = await response.json();
            
            // Dùng hàm find để tìm sản phẩm có ID khớp
            const product = data.products.find(p => p.id === productId);

            if (product) {
                displayProductDetails(product);
            } else {
                productDetailContainer.innerHTML = '<h1>Sản phẩm không tồn tại.</h1>';
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
            productDetailContainer.innerHTML = '<h1>Đã xảy ra lỗi khi tải thông tin.</h1>';
        }
    }

    // Hiển thị thông tin sản phẩm đã tìm thấy
    function displayProductDetails(product) {
        // Cập nhật tiêu đề trang
        document.title = product.name;

        productDetailContainer.innerHTML = `
            <div class="product-detail-image">
                <img src="${product.image_url}" alt="${product.name}">
            </div>
            <div class="product-detail-info">
                <h1 class="product-title">${product.name}</h1>
                <p class="product-platform-detail">Bán trên: <strong>${product.platform}</strong></p>
                <div class="product-price-detail">${product.price.toLocaleString('vi-VN')} ₫</div>
                <a href="${product.url}" target="_blank" class="buy-now-button">Đến nơi bán</a>
                <div class="product-description">
                    <h2>Mô tả sản phẩm</h2>
                    <p>Đây là mô tả mẫu cho sản phẩm. Thông tin chi tiết về thông số kỹ thuật, tính năng nổi bật, và chính sách bảo hành sẽ được cập nhật ở đây khi có dữ liệu thật từ backend.</p>
                </div>
            </div>
        `;
    }

    fetchProductDetails();
});