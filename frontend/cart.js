function createCartNode(product) {
    var div = document.createElement('div');
    div.innerHTML = `
        <div class="card text-black m-4">
            <div class="card-body d-flex justify-content-between font-weight-bold m-1">
                <span>${product.name}</span><span>$${product.price}</span>
            </div>
            
            <div class="card-body d-flex">
                <span class="card-body">Quantity</span>
                <input id="quantity" min="1" name="quantity" value="${product.quantity}" type="number" class="form-control form-control-sm" disabled/>
            </div>
        </div>`;
    return div;
}

function createCartNodes(products) {
    var productNodes = [];
    for (var i = 0; i < products.length; i++) {
        productNodes.push(createCartNode(products[i]));
    }
    return productNodes;
}

function emptyCartNode() {
    var div = document.createElement('div');
    div.innerHTML = `<h1 style="text-align: center;">Cart is empty</h1>`;
    return div;
}

function showCart(products) {
    const productNodes = createCartNodes(products);
    const productContainer = document.getElementById('cart');
    productContainer.replaceChildren(...productNodes);
    if (products.length === 0) {
        productContainer.appendChild(emptyCartNode());
    } else {
        createTotalNode(products);
        createAddressNode();
        createCartButtons();
    }
}

function createTotalNode(products) {
    var div = document.createElement('div');
    const total = calculateTotal(products);
    div.innerHTML = `
        <div class="card text-black m-4">
            <div class="card-body d-flex justify-content-between font-weight-bold m-1">
                <span>Total</span><span>$${total}</span>
            </div>
        </div>`;
    document.getElementById('cart').appendChild(div);
}

function calculateTotal(products) {
    let total = 0;
    for (const product of products) {
        total += product.price * product.quantity;
    }
    return total;
}

function createCartButtons() {
    var div = document.createElement('div');
    div.innerHTML = `
        <div style="text-align:center">
            <button class="btn btn-primary" onclick="checkout()">Checkout</button>
            <button class="btn btn-danger" onclick="emptyCart()">Empty Cart</button>
        </div>`;
    document.getElementById('cart').appendChild(div);
}

function createAddressNode() {
    var div = document.createElement('div');
    div.innerHTML = `
        <div class="card text-black m-4">
            <div class="card-body d-flex justify-content-between font-weight-bold m-1">
                <span>Address</span>
                <input id="address" name="address" type="text" class="form-control form-control-sm" required />
            </div>
        </div>`;
    document.getElementById('cart').appendChild(div);
}

function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const order = convertCartToOrder(cart);
    order.address = document.getElementById('address').value;
    order.userId = localStorage.getItem('userId');
    console.log('Checkout', order);
    sendOrder(order);
}

function emptyCart() {
    localStorage.removeItem('cart');
    initCart();
}

async function sendOrder(order) {
    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(order),
        });
        if (response.ok) {
            showSuccessAlert('Order sent successfully');
            localStorage.removeItem('cart');
            initCart();
        } else {
            console.error('Failed to send order', response);
            showFailedAlert('Failed to send order');
        }
    } catch (err) {
        console.error('Failed to send order', err);
        showFailedAlert('Failed to send order');
    }
}

function convertCartToOrder(cart) {
    const productIds = Object.keys(cart);
    const products = [];
    for (const productId of productIds) {
        products.push({ productId, quantity: cart[productId] });
    }
    return { products };
}

async function initCart() {
    if (!localStorage.getItem('cart')) {
        const cart = document.getElementById('cart');
        cart.replaceChildren(emptyCartNode());
    }
    const cart = JSON.parse(localStorage.getItem('cart'));
    const productIds = Object.keys(cart);
    console.log('Cart', cart, productIds);
    const products = [];
    for (const productId of productIds) {
        try {
            const response = await fetch(`/api/products/find/${productId}`);
            if (response.ok) {
                const product = await response.json();
                product.quantity = cart[productId];;
                products.push(product);
            } else {
                console.error('Failed to get product', productId);
            }
        } catch (err) {
            console.error('Failed to get product', productId, err);
        }
    }
    showCart(products);
    updateCartCountInNavbar();
}

initCart();
