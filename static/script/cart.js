let selectedSize = null;

function selectSize(size) {
  selectedSize = size;
  document.querySelectorAll('.size-button').forEach(btn => {
    btn.classList.remove('selected');
  });
  event.currentTarget.classList.add('selected');
}

function addToCart(id, name, price, category, slug) { 
    if (!selectedSize && category !== 'other') { 
         alert("Please select a size first");
         return;
    }

    let playerInfo = 'None';
    let playerPrice = 0;    
    let badgesInfo = 'None'; 
    let badgesPrice = 0;   

    const playerSelect = document.getElementById('playerNumber');
    if (playerSelect) { 
        const playerOption = playerSelect.options[playerSelect.selectedIndex];
        if (playerOption) { 
             playerInfo = playerOption.text;
             playerPrice = parseFloat(playerOption.value) || 0; 
        }
    }

    const badgesSelect = document.getElementById('badges');
    if (badgesSelect) { 
        const badgesOption = badgesSelect.options[badgesSelect.selectedIndex];
         if (badgesOption) { 
             badgesInfo = badgesOption.text;
             badgesPrice = parseFloat(badgesOption.value) || 0; 
         }
    }

    const basePrice = parseFloat(price);
    if (isNaN(basePrice)) {
        console.error("Invalid base price received in addToCart:", price);
        alert("Грешка: Невалидна цена на продукта.");
        return;
    }

    const totalPrice = basePrice + playerPrice + badgesPrice;

    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
        console.error("Error parsing cart:", e);
        localStorage.removeItem('cart');
        cart = [];
    }

    const existingIndex = cart.findIndex(item =>
        item.id === id &&
        item.size === selectedSize &&
        item.playerInfo === playerInfo &&
        item.badgesInfo === badgesInfo
    );

    if (existingIndex !== -1) {
        cart[existingIndex].quantity += 1;
    } else {
        const newItem = {
            id,
            name,
            size: selectedSize, 
            playerInfo, 
            badgesInfo, 
            basePrice,
            totalPrice,
            quantity: 1,
            category: category,
            slug: slug       
        };
        cart.push(newItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert("Item added to cart!");
}

function updateCartCount() {
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
  } catch (e) {
    console.error("Error parsing cart:", e);
    localStorage.removeItem('cart'); 
    cart = [];
  }
  
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  
  const countElement = document.getElementById('cart-count');
  if (countElement) {
    countElement.textContent = totalItems.toString();
  }
}

document.addEventListener('DOMContentLoaded', function() {
  updateCartCount();
});