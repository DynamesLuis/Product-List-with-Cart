const $dessertsContariner = document.querySelector(".desserts-container");
const $confirmBtn = document.querySelector(".confirm-btn");
const $newOrdenBtn = document.querySelector(".newOrden-btn");
const $overlay = document.querySelector(".overlay");
const $cartContainer = document.querySelector(".full-cart");
const $emptyCart = document.querySelector(".empty-cart");
const $cartSection = document.querySelector(".cart");
const $productCount = $cartSection.querySelector(".product-count");

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
    console.log(cart[productIndex]); // cuando aumentas o disminuyes sin orden se pierde cual track del producto
    //si se hace en orden si se mantiene porque primero agregas, se mantiene track de ese producto y luego aumentas 
    //o decrementas
    //buscar una forma de obtener otra vez a que botón pertenece ese ese botón
    cart[productIndex].count = count;
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
        const $deleteBtn = $liElement.querySelector(".delete-btn");
        $deleteBtn.addEventListener("click", () => deleteFromCart($liElement));
        $emptyCart.style.display = "none";
        $cartContainer.style.display = "block";
        renderCartTotal();
    })
}

function deleteFromCart($liElement) {
    const productName = $liElement.querySelector(".li-name").textContent;
    const index = cart.findIndex(element => element.name == productName);
    console.log(index);
    
    if (index > -1) { // only splice array when item is found
        cart.splice(index, 1); // 2nd parameter means remove one item only
    }
    console.log(cart);
    
    renderCart();
    //set inactive the product
}

function renderCartTotal() {

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
    const $miniList = document.querySelector(".mini-list");
    cart.forEach(product => {
        const $liElement = document.createElement("li");
        $liElement.innerHTML = `<li>
                                    <img src="${product.thumbnail}" alt="">
                                    <div>
                                        <p class="name-product">${product.name}</p>
                                        <p class="prices">
                                            <span class="product-amount">${product.count}x</span>
                                            <span class="product-price">@ ${product.price}</span>
                                        </p>
                                    </div>
                                    <p class="total-product">$${product.count * product.price}</p>
                                </li>`
        $miniList.appendChild($liElement);
    });
    const $productCount = $overlay.querySelector(".popup .total");
    const totalAmount = cart.reduce(function (acc, obj) { return acc + obj.price * obj.count; }, 0);
    $productCount.textContent = `$${totalAmount}`;
}

function hidePopup() {
    $overlay.classList.remove("show");
    setTimeout(() => {
        $overlay.classList.add("hidden");
    }, 300);
    const $miniList = document.querySelector(".mini-list");
    $miniList.innerHTML = "";
    cart = [];
    //ocultar cart
    $cartContainer.style.display = "none";
    //mostrar empty 
    $emptyCart.style.display = "flex";
    $productCount.textContent = "(0)";
    //reiniciar products active and buttons
    const $products = document.querySelectorAll(".product");
    $products.forEach($product => {
        $product.classList.remove("active");
        const $addTocartBtn = $product.querySelector(".add-btn");
        $addTocartBtn.style.display = "flex";
        //mostrar increment y decrement
        const $countproduct = $product.querySelector(".count-product");
        const $amountAdded = $countproduct.querySelector("p");
        $amountAdded.textContent = "1";
        $countproduct.style.display = "none";
    })

}