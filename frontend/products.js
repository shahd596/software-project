function createProductNode(product) {
    var div = document.createElement('div');
    div.innerHTML = `
        <div class="card text-black m-4">
            <div class="card-body d-flex justify-content-between font-weight-bold m-1">
                <span>${product.name}</span><span>$${product.price}</span>
            </div>
            
            <div class="card-body d-flex">
                <span class="card-body">Quantity</span>
                <button data-mdb-button-init data-mdb-ripple-init class="btn btn-link px-2"
                    onclick="this.parentNode.querySelector('input[type=number]').stepDown()">
                    <i class="bi bi-dash-circle"></i>
                </button>

                <input id="quantity" min="1" name="quantity" value="1" type="number" class="form-control form-control-sm" />

                <button data-mdb-button-init data-mdb-ripple-init class="btn btn-link px-2"
                    onclick="this.parentNode.querySelector('input[type=number]').stepUp()">
                    <i class="bi bi-plus-circle"></i>
                </button>
            </div>
            <button class="btn btn-primary" onclick="addToCart('${product._id}', this.parentNode.querySelector('input[type=number]'))">Add to Cart</button>
            ${isAdmin() ? `<button class="btn btn-danger" onclick="deleteProduct('${product._id}')">Delete</button>` : ''}
        </div>`;
    return div;
}

function isAdmin() {
    return localStorage.getItem('isAdmin') === 'true';
}

function showCreateProducButtonIfAdmin() {
    if (isAdmin()) {
        const createProductButton = document.getElementById('create-product');
        createProductButton.style.display = 'block';
    }

}

function createProductNodes(products) {
    var productNodes = [];
    for (var i = 0; i < products.length; i++) {
        productNodes.push(createProductNode(products[i]));
    }
    return productNodes;
}

function showProducts(products) {
    const productNodes = createProductNodes(products);
    const productContainer = document.getElementById('products');
    productContainer.replaceChildren(...productNodes);
}

async function getProducts() {
    try {
        const response = await fetch('/api/products');
        if (response.ok) {
            const products = await response.json();
            console.log(products);
            showProducts(products);
        } else {
            console.error('Failed to get products');
        }
    } catch (err) {
        console.error('Failed to get products', err);
    }
}

function addToCart(productId, quantityInput) {
    const quantity = quantityInput.value;
    console.log('Add to cart', productId, quantity);
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify({}));
    }
    const cart = JSON.parse(localStorage.getItem('cart'));
    if (cart[productId]) {
        cart[productId] += parseInt(quantity);
    } else {
        cart[productId] = parseInt(quantity);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCountInNavbar();
    showSuccessAlert('Added to cart');
}

async function deleteProduct(productId) {
    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (response.ok) {
            showSuccessAlert('Product deleted');
            await getProducts();
        } else {
            console.error('Failed to delete product');
            showFailedAlert('Failed to delete product');
        }
    } catch (err) {
        console.error('Failed to delete product', err);
        showFailedAlert('Failed to delete product');
    }
}

getProducts();
showCreateProducButtonIfAdmin();
