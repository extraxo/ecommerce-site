document.addEventListener("DOMContentLoaded", () => {
    const cartCount = document.getElementById("cart-count");

    function updateCartCount() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cartCount.textContent = cart.length;
    }

    updateCartCount();
});
