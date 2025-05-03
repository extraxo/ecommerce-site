document.addEventListener("DOMContentLoaded", () => {
    function selectSize(size) {
        document.querySelectorAll('.size-button').forEach(button => {
            button.classList.toggle('selected', button.textContent === size);
        });
    }

    document.querySelectorAll('.size-button').forEach(button => {
        button.addEventListener("click", () => selectSize(button.textContent));
    });

    const dropdown = document.getElementById('playerNumber');
    const badgeDropdown = document.getElementById("badges");
    const basePriceElement = document.getElementById("base-price");
    const totalPriceElement = document.getElementById("total-price");
    const addToCartButton = document.getElementById('add-to-cart');

    function getBasePrice() {
        return parseFloat(basePriceElement.innerText.replace("$", "")) || 0;
    }

    function updatePrice() {
        let basePrice = getBasePrice();
        let playerCost = parseFloat(dropdown.value) || 0;
        let badgeCost = parseFloat(badgeDropdown.value) || 0;
        let finalPrice = basePrice + playerCost + badgeCost;
        totalPriceElement.innerText = `Total Price: ${finalPrice.toFixed(2)}$`;
    }

    dropdown.addEventListener("change", updatePrice);
    badgeDropdown.addEventListener("change", updatePrice);

});
