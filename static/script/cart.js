let selectedSize = null;

function selectSize(size) {
  selectedSize = size;
  document.querySelectorAll('.size-button').forEach(btn => {
    btn.classList.remove('selected');
  });
  event.currentTarget.classList.add('selected');
}

function addToCart(id, name, price) {
  if (!selectedSize) {
    alert("Please select a size first");
    return;
  }
  
  const playerSelect = document.getElementById('playerNumber');
  const playerOption = playerSelect.options[playerSelect.selectedIndex];
  const playerInfo = playerOption.text;
  const playerPrice = parseFloat(playerOption.value);
  
  const badgesSelect = document.getElementById('badges');
  const badgesOption = badgesSelect.options[badgesSelect.selectedIndex];
  const badgesInfo = badgesOption.text;
  const badgesPrice = parseFloat(badgesOption.value);
  
  const basePrice = parseFloat(price);
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
    cart.push({
      id,
      name,
      size: selectedSize,
      playerInfo,
      badgesInfo,
      basePrice,
      totalPrice,
      quantity: 1
    });
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