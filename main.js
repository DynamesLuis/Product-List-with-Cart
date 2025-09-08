const $dessertsContariner = document.querySelector(".desserts-container");
const $confirmBtn = document.querySelector(".confirm-btn");
const $newOrdenBtn = document.querySelector(".newOrden-btn");
const $overlay = document.querySelector(".overlay");
const $cartContainer = document.querySelector(".full-cart");
const $emptyCart = document.querySelector(".empty-cart");
const $cartSection = document.querySelector(".cart");
let products = [];
let cart = [];

main();

async function main() {
    await loadProducts();
    initEvents();
}

function initEvents() {
    $confirmBtn.addEventListener('click', showPopup);
    $newOrdenBtn.addEventListener('click', hidePopup);
    const $products = document.querySelectorAll(".product");
    $products.forEach($product => {
        const $addTocartBtn = $product.querySelector(".add-btn");
        $addTocartBtn.addEventListener('click', () => handleProductSelection($product, $addTocartBtn));
    })
}

function handleProductSelection($product, $addTocartBtn) {
    //colocar en estado active
    $product.classList.add("active");
    //ocultar boton add
    $addTocartBtn.style.display = "none";
    //mostrar increment y decrement
    const $countproduct = $product.querySelector(".count-product");
    $countproduct.style.display = "flex";
    //activar listener en increment y decrement
    const $decrementBtn = $countproduct.querySelector(".decrement-btn");
    const $incrementBtn = $countproduct.querySelector(".increment-btn");
    const $amountAdded = $countproduct.querySelector("p");
    $decrementBtn.addEventListener('click', () => decrementProduct($amountAdded, $product));
    $incrementBtn.addEventListener('click', () => incrementProduct($amountAdded, $product));
    //guardar en carrito
    addToCart($product);
}


function incrementProduct($amountAdded, $product) {
    let count = parseInt($amountAdded.textContent);
    count++;
    $amountAdded.textContent = count;

    const productName = $product.querySelector(".name-product").textContent;
    const productIndex = products.findIndex(product => product.name == productName);
    cart[productIndex].count = count;
    console.log(cart);
    renderCart();
}
function decrementProduct($amountAdded, $product) {
    let count = parseInt($amountAdded.textContent);
    if (count == 1) return;
    count--;
    $amountAdded.textContent = count;

    const productName = $product.querySelector(".name-product").textContent;
    const productIndex = products.findIndex(product => product.name == productName);
    cart[productIndex].count = count;
    renderCart();
}
function addToCart($product) {
    //obtener el nombre
    const productName = $product.querySelector(".name-product").textContent;
    //guardarlo en carproducts
    const productInfo = products.find(product => product.name == productName);
    const { name, price, image } = productInfo;
    const { thumbnail } = image;
    let count = 1;
    cart.push({ name, price, thumbnail, count });
    //renderizar
    renderCart();
}

function renderCart() {
    const $cartList = $cartContainer.querySelector(".list-cart");
    $cartList.innerHTML = "";
    cart.forEach(product => {
        const $liElement = document.createElement("li");
        $liElement.innerHTML = `<li>
                                <button class="delete-btn"></button>
                                <p class="li-name">${product.name}</p>
                                <p class="li-info">
                                    <span class="li-cantity">${product.count}x</span>
                                    <span class="li-price">@ $${product.price}</span>
                                    <span class="li-total">$${product.count * product.price}</span>
                                </p>
                            </li>`;
        $cartList.appendChild($liElement);
        $emptyCart.style.display = "none";
        $cartContainer.style.display = "block";
        renderCartTotal();
    })
}

function renderCartTotal() {
    const $productCount = $cartSection.querySelector(".product-count");
    $productCount.textContent = `(${cart.length})`;
    const totalAmount = cart.reduce(function (acc, obj) { return acc + obj.price * obj.count; }, 0);
    const $total = $cartSection.querySelector(".total");
    $total.textContent = `$${totalAmount}`;
}

async function loadProducts() {
    try {
        const response = await fetch("./data.json");
        const result = await response.json();
        result.forEach(product => {
            products.push(product);
            const $product = document.createElement("article");
            $product.classList.add("product");
            $product.innerHTML = `<img src="${product.image.mobile}" alt="${product.name}">
                                  <h3 class="category-product">${product.category}</h3>
                                  <h4 class="name-product">${product.name}</h4>
                                  <p class="price-product">$${product.price}</p>
                                  <div class="actions-product">
                                     <button class="add-btn"> <img src="./assets/images/icon-add-to-cart.svg" alt="ad-to-cart"> Add to Cart</button>
                                     <div class="count-product">
                                        <button class="decrement-btn"></button>
                                        <p>1</p>
                                        <button class="increment-btn"></button>
                                     </div>
                                  </div>`
            $dessertsContariner.appendChild($product);
        });

    } catch (error) {
        console.log.error("Error: " + error);
    }
}

function showPopup() {
    $overlay.classList.remove("hidden");
    setTimeout(() => {
        $overlay.classList.add("show");
    }, 10);
}

function hidePopup() {
    $overlay.classList.remove("show");
    setTimeout(() => {
        $overlay.classList.add("hidden");
    }, 300);
}