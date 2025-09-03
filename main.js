const $dessertsContariner = document.querySelector(".desserts-container");

loadProducts();

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