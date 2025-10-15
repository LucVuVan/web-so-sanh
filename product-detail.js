document.addEventListener('DOMContentLoaded', () => {
    const productDetailContainer = document.getElementById('product-detail-container');
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId) {
        productDetailContainer.innerHTML = '<h1>Không tìm thấy ID sản phẩm.</h1>';
        return;
    }

    async function fetchProductData() {
        try {
            const response = await fetch('mock-data.json');
            const data = await response.json();
            const product = data.products.find(p => p.id === productId);

            if (product) {
                displayProductDetails(product);

                const relatedProducts = data.products.filter(p => 
                    p.category_id === product.category_id && p.id !== product.id
                ).slice(0, 5);

                displayRelatedProducts(relatedProducts);
            } else {
                productDetailContainer.innerHTML = '<h1>Sản phẩm không tồn tại.</h1>';
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
            productDetailContainer.innerHTML = '<h1>Đã xảy ra lỗi khi tải thông tin.</h1>';
        }
    }

    function displayProductDetails(product) {
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
            </div>`;
    }

    function displayRelatedProducts(products) {
        const relatedListContainer = document.getElementById('related-products-list');
        const relatedSection = document.querySelector('.related-products-section');

        if (products.length === 0) {
            relatedSection.style.display = 'none';
            return;
        }

        relatedListContainer.innerHTML = '';
        products.forEach(product => {
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
            relatedListContainer.appendChild(productCard);
        });
    }

    fetchProductData();
});