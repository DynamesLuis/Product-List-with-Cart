const $dessertsContariner = document.querySelector(".desserts-container");
const $confirmBtn = document.querySelector(".confirm-btn");
const $newOrdenBtn = document.querySelector(".newOrden-btn");
const $overlay = document.querySelector(".overlay");

initEvents();
loadProducts();


function initEvents() {
    $confirmBtn.addEventListener('click', showPopup);
    $newOrdenBtn.addEventListener('click', hidePopup);
}
function loadProducts() {
    try {
        fetch('./data.json')
            .then((response) => response.json())
            .then((data) => {
                data.forEach(product => {
                    const $product = document.createElement("article");
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