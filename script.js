console.log("SCRIPT JS LOADED");
function shopNow() {
    window.location.href = "shop.html";
}


// ======================================
// ADD TO CART
// ======================================
function addToCart(button) {

    const productCard = button.closest(".product-card");

    if (!productCard) {
        alert("Product not found!");
        return;
    }

    const nameElement = productCard.querySelector("h3");
    const priceElement = productCard.querySelector(".price");
    const imageElement = productCard.querySelector("img");

    if (!nameElement || !priceElement) {
        alert("Product details missing!");
        return;
    }

    const name = nameElement.innerText.trim();

    const price =
        parseFloat(
            priceElement.innerText.replace(/[^\d.]/g, "")
        ) || 0;

    const image =
        imageElement
            ? imageElement.getAttribute("src")
            : "";

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    const existing =
        cart.find(product => product.name === name);

    if (existing) {

        existing.quantity =
            (parseInt(existing.quantity) || 1) + 1;

    } else {

        cart.push({
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    alert("Added to Cart! 🛒");
}


// ======================================
// BUY NOW
// ======================================
function buyNow(button) {

    const productCard =
        button.closest(".product-card");

    if (!productCard) {
        alert("Product not found!");
        return;
    }

    const nameElement =
        productCard.querySelector("h3");

    const priceElement =
        productCard.querySelector(".price");

    const imageElement =
        productCard.querySelector("img");

    if (!nameElement || !priceElement) {
        alert("Product details missing!");
        return;
    }

    const product = {

        name: nameElement.innerText.trim(),

        price:
            parseFloat(
                priceElement.innerText.replace(/[^\d.]/g, "")
            ) || 0,

        image:
            imageElement
                ? imageElement.getAttribute("src")
                : "",

        quantity: 1
    };

    localStorage.setItem(
        "buyNowProduct",
        JSON.stringify(product)
    );

    window.location.href = "checkout.html";
}


// ======================================
// DISPLAY CART
// ======================================
function displayCart() {

    const cartContainer =
        document.getElementById("cartItems");

    if (!cartContainer) {
        return;
    }

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    cartContainer.innerHTML = "";

    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <div class="empty-cart">

                <h2>Your Cart is Empty 🛒</h2>

                <p>Add some products to your cart.</p>

                <button onclick="shopNow()">
                    Shop Now
                </button>

            </div>
        `;

        updateCartTotal();
        return;
    }

    cart.forEach(function (product, index) {

        const price =
            parseFloat(product.price) || 0;

        const quantity =
            parseInt(product.quantity) || 1;

        const subtotal =
            price * quantity;

        const cartItem =
            document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.name}"
                class="cart-product-image"
            >

            <div class="cart-product-details">

                <h3>${product.name}</h3>

                <p>
                    Price: ₹${price}
                </p>

                <div class="quantity-control">

                    <button
                        onclick="decreaseQuantity(${index})">
                        -
                    </button>

                    <span>
                        ${quantity}
                    </span>

                    <button
                        onclick="increaseQuantity(${index})">
                        +
                    </button>

                </div>

                <p>
                    Total: ₹${subtotal}
                </p>

                <button
                    class="remove-btn"
                    onclick="removeFromCart(${index})">

                    Remove

                </button>

            </div>
        `;

        cartContainer.appendChild(cartItem);
    });

    updateCartTotal();
}


// ======================================
// INCREASE QUANTITY
// ======================================
function increaseQuantity(index) {

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    if (!cart[index]) {
        return;
    }

    cart[index].quantity =
        (parseInt(cart[index].quantity) || 1) + 1;

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    displayCart();
    updateCartCount();
}


// ======================================
// DECREASE QUANTITY
// ======================================
function decreaseQuantity(index) {

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    if (!cart[index]) {
        return;
    }

    let quantity =
        parseInt(cart[index].quantity) || 1;

    if (quantity > 1) {

        quantity--;

        cart[index].quantity = quantity;

    } else {

        cart.splice(index, 1);
    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    displayCart();
    updateCartCount();
}


// ======================================
// REMOVE FROM CART
// ======================================
function removeFromCart(index) {

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    if (index < 0 || index >= cart.length) {
        return;
    }

    cart.splice(index, 1);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    displayCart();
    updateCartCount();
}


// ======================================
// UPDATE CART TOTAL
// ======================================
function updateCartTotal() {

    const totalElement =
        document.getElementById("cartTotal");

    if (!totalElement) {
        return;
    }

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    let total = 0;

    cart.forEach(function (product) {

        const price =
            parseFloat(product.price) || 0;

        const quantity =
            parseInt(product.quantity) || 1;

        total += price * quantity;
    });

    totalElement.innerText =
        "₹" + total;
}


// ======================================
// UPDATE CART COUNT
// ======================================
function updateCartCount() {

    const countElement =
        document.getElementById("cartCount");

    if (!countElement) {
        return;
    }

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    let count = 0;

    cart.forEach(function (product) {

        count +=
            parseInt(product.quantity) || 1;

    });

    countElement.innerText = count;
}


// ======================================
// GO TO CART
// ======================================
function goToCart() {

    window.location.href = "cart.html";
}


// ======================================
// CHECKOUT FROM CART
// ======================================
function checkout() {

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;
    }

    // Remove old Buy Now product
    localStorage.removeItem("buyNowProduct");

    window.location.href =
        "checkout.html";
}


// ======================================
// DISPLAY CHECKOUT
// ======================================
function displayCheckout() {

    const checkoutContainer =
        document.getElementById("checkoutItems");

    if (!checkoutContainer) {
        return;
    }

    const buyNowProduct =
        JSON.parse(
            localStorage.getItem("buyNowProduct")
        );

    const cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];

    checkoutContainer.innerHTML = "";

    let products = [];

    if (buyNowProduct) {

        products = [buyNowProduct];

    } else {

        products = cart;
    }

    // EMPTY
    if (products.length === 0) {

        checkoutContainer.innerHTML = `
            <p>Your cart is empty.</p>
        `;

        const totalElement =
            document.getElementById("checkoutTotal");

        if (totalElement) {
            totalElement.innerText = "₹0";
        }

        return;
    }

    let total = 0;

    products.forEach(function (product) {

        const price =
            parseFloat(product.price) || 0;

        const quantity =
            parseInt(product.quantity) || 1;

        const subtotal =
            price * quantity;

        total += subtotal;

        checkoutContainer.innerHTML += `

            <div class="checkout-item">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    width="100"
                >

                <div>

                    <h3>
                        ${product.name}
                    </h3>

                    <p>
                        Price: ₹${price}
                    </p>

                    <p>
                        Quantity: ${quantity}
                    </p>

                    <p>
                        Subtotal: ₹${subtotal}
                    </p>

                </div>

            </div>
        `;
    });

    const totalElement =
        document.getElementById("checkoutTotal");

    if (totalElement) {

        totalElement.innerText =
            "₹" + total;
    }
}


// ======================================
// SHOW UPI
// ======================================
function showUPI() {

    const upiSection =
        document.getElementById("upiSection");

    if (upiSection) {
        upiSection.style.display = "block";
    }
}


// ======================================
// HIDE UPI
// ======================================
function hideUPI() {

    const upiSection =
        document.getElementById("upiSection");

    if (upiSection) {
        upiSection.style.display = "none";
    }
}


// ======================================
// PLACE ORDER
// ======================================
function placeOrder() {
       alert("order confired");

    const nameElement =
        document.getElementById("customerName");

    const phoneElement =
        document.getElementById("customerPhone");

    const addressElement =
        document.getElementById("customerAddress");

    // Check fields
    if (!nameElement || !phoneElement || !addressElement) {
        alert("Customer details fields missing!");
        return;
    }

    const name = nameElement.value.trim();
    const phone = phoneElement.value.trim();
    const address = addressElement.value.trim();

    // Validate details
    if (name === "" || phone === "" || address === "") {
        alert("Please fill all details.");
        return;
    }

    // Validate phone
    if (!/^\d{10}$/.test(phone)) {
        alert("Please enter a valid 10 digit phone number.");
        return;
    }

    // Payment method
    const paymentElement =
        document.querySelector(
            'input[name="paymentMethod"]:checked'
        );

    const paymentMethod =
        paymentElement
            ? paymentElement.value
            : "Cash on Delivery";

    // Get Buy Now product
    const buyNowProduct =
        JSON.parse(
            localStorage.getItem("buyNowProduct")
        );

    // Get Cart
    const cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];

    let products = [];

    if (buyNowProduct) {
        products = [buyNowProduct];
    } else {
        products = cart;
    }

    // Check products
    if (products.length === 0) {
        alert("No products to order!");
        return;
    }

    // Calculate total
    let total = 0;

    products.forEach(function (product) {

        const price =
            parseFloat(product.price) || 0;

        const quantity =
            parseInt(product.quantity) || 1;

        total += price * quantity;
    });

    // Send order to backend
    fetch("http://localhost:3000/api/orders", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            customer_name: name,
            phone: phone,
            address: address,
            payment_method: paymentMethod,
            total_amount: total,
            products:products

        })

    })

    .then(response => response.json())

    .then(data => {

        if (data.error) {

            alert("Order failed!");

            return;
        }

        // Create order for success page
        const order = {

            orderId:
                "FM" + data.orderId,

            customerName:
                name,

            phone:
                phone,

            address:
                address,

            products:
                products,

            totalAmount:
                total,

            paymentMethod:
                paymentMethod,

            status:
                "Confirmed",

            date:
                new Date().toLocaleString()
        };

        // Save order locally
        localStorage.setItem(
            "order",
            JSON.stringify(order)
        );

        localStorage.setItem(
            "orderTotal",
            total.toString()
        );

        // Clear cart
        localStorage.removeItem("cart");

        localStorage.removeItem(
            "buyNowProduct"
        );

        // Go to success page
        window.location.href =
            "order-success.html";
    })

    .catch(error => {

        alert(
            "Error:"+error.message);
       console.log("Backend order error:",error );
    });
}

// ======================================
// CLEAR CART
// ======================================
function clearCart() {

    localStorage.removeItem("cart");

    localStorage.removeItem(
        "buyNowProduct"
    );

    displayCart();

    updateCartCount();

    alert("Cart cleared!");
}


// ======================================
// ADD TO WISHLIST
// ======================================
function addToWishlist(button) {

    let productCard =
        button.closest(".product-card");

    if (!productCard) {
        return;
    }

    let name =
        productCard
            .querySelector("h3")
            .innerText
            .trim();

    let price =
        productCard
            .querySelector(".price")
            .innerText
            .trim();

    let image =
        productCard
            .querySelector("img")
            .getAttribute("src");

    let wishlist =
        JSON.parse(
            localStorage.getItem("wishlist")
        ) || [];


    let exists =
        wishlist.some(
            product => product.name === name
        );


    if (!exists) {

        wishlist.push({

            name: name,

            price: price,

            image: image
        });


        localStorage.setItem(
            "wishlist",
            JSON.stringify(wishlist)
        );


        alert(
            name +
            " added to Wishlist ❤️"
        );

    } else {

        alert(
            "Already in Wishlist ❤️"
        );
    }
}


// ======================================
// DISPLAY WISHLIST
// ======================================
function displayWishlist() {

    let container =
        document.getElementById(
            "wishlistContainer"
        );

    if (!container) {
        return;
    }

    let wishlist =
        JSON.parse(
            localStorage.getItem("wishlist")
        ) || [];


    container.innerHTML = "";


    if (wishlist.length === 0) {

        container.innerHTML =
            "<h2>Your Wishlist is Empty ❤️</h2>";

        return;
    }


    wishlist.forEach(
        (product, index) => {

            container.innerHTML += `

                <div class="wishlist-item">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                    <div>

                        <h3>
                            ${product.name}
                        </h3>

                        <p class="price">
                            ${product.price}
                        </p>

                        <button
                            onclick="wishlistToCart(${index})">

                            Add to Cart 🛒

                        </button>

                        <button
                            onclick="removeFromWishlist(${index})">

                            Remove ❌

                        </button>

                    </div>

                </div>
            `;
        }
    );
}


// ======================================
// WISHLIST → CART
// ======================================
function wishlistToCart(index) {

    let wishlist =
        JSON.parse(
            localStorage.getItem("wishlist")
        ) || [];

    let cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    let product =
        wishlist[index];


    if (!product) {
        return;
    }


    // Convert wishlist price to number
    let price =
        parseFloat(
            String(product.price)
                .replace(/[^\d.]/g, "")
        ) || 0;


    let existing =
        cart.find(
            item => item.name === product.name
        );


    if (existing) {

        existing.quantity =
            (parseInt(existing.quantity) || 1) + 1;

    } else {

        cart.push({

            name:
                product.name,

            price:
                price,

            image:
                product.image,

            quantity:
                1
        });
    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    alert(
        product.name +
        " added to Cart 🛒"
    );

    displayWishlist();
}


// ======================================
// REMOVE FROM WISHLIST
// ======================================
function removeFromWishlist(index) {

    let wishlist =
        JSON.parse(
            localStorage.getItem("wishlist")
        ) || [];


    if (
        index < 0 ||
        index >= wishlist.length
    ) {
        return;
    }


    wishlist.splice(index, 1);


    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );


    displayWishlist();
}


// ======================================
// PAGE LOAD
// ======================================
document.addEventListener(
    "DOMContentLoaded",
    function () {

        displayCart();

        displayCheckout();

        displayWishlist();

        updateCartCount();
        loadProductsFromBackend();

    }
);
// ======================================
// LOAD PRODUCTS FROM BACKEND
// ======================================
function loadProductsFromBackend() {

    const container =
        document.getElementById("productsContainer");

    if (!container) {
        return;
    }

    fetch("http://localhost:3000/api/products")
        .then(response => response.json())
        .then(products => {

            container.innerHTML = "";

            products.forEach(product => {

                container.innerHTML += `

                    <div class="product-card">

                        <img
                            src="http://localhost:3000/${product.image}"
                            alt="${product.name}"
                        >

                        <h3>
                            ${product.name}
                        </h3>

                        <p>
                            Fresh and quality product
                        </p>

                        <p class="price">
                            ₹${product.price}
                        </p>

                        <button
                            class="cart-btn"
                            onclick="addToCart(this)">

                            Add to Cart

                        </button>

                    </div>
                `;
            });

            // 🔍 SEARCH AFTER PRODUCTS ARE LOADED
            const searchText =
                localStorage.getItem("searchProduct");

            if (searchText) {

                const search =
                    searchText.toLowerCase();

                const productCards =
                    container.querySelectorAll(
                        ".product-card"
                    );

                productCards.forEach(function(card) {

                    const name =
                        card.querySelector("h3")
                            .innerText
                            .toLowerCase();

                    if (name.includes(search)) {

                        card.style.display = "";

                    } else {

                        card.style.display = "none";

                    }

                });

                localStorage.removeItem(
                    "searchProduct"
                );
            }

        })
        .catch(error => {

            console.log(
                "Backend connection error:",
                error
            );

        });
}
// =====================================
// HOME PAGE SEARCH
// =====================================

function searchProduct() {

    const input =
        document.getElementById("searchInput");

    const searchText =
        input.value.trim();

    if (searchText === "") {
        alert("Please enter a product name.");
        return;
    }

    localStorage.setItem(
        "searchProduct",
        searchText
    );

    window.location.href = "shop.html";
}


// =====================================
// SHOP PAGE SEARCH RESULT
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const searchText =
            localStorage.getItem("searchProduct");

        if (!searchText) {
            return;
        }

        const products =
            document.querySelectorAll(
                ".product-card"
            );

        products.forEach(
            function (product) {

                const nameElement =
                    product.querySelector("h3");

                if (!nameElement) {
                    return;
                }

                const productName =
                    nameElement.innerText
                        .toLowerCase();

                if (
                    productName.includes(
                        searchText.toLowerCase()
                    )
                ) {

                    product.style.display =
                        "";

                } else {

                    product.style.display =
                        "none";
                }

            }
        );

        localStorage.removeItem(
            "searchProduct"
        );
    }
);