function displayCartItems() {
    const cartContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');

    if (!cartContainer || !totalPriceElement) {
        console.error("Cart container or total price element not found.");
        return;
    }

    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
        console.error("Error parsing cart from localStorage:", e);
        localStorage.removeItem('cart'); 
        cart = [];
    }

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty</p>';
        totalPriceElement.textContent = '0.00'; 
        return;
    }

    let totalPrice = 0;
    let cartHTML = '<div class="cart-items-list">';

    cart.forEach((item, index) => {
        const quantity = item.quantity || 1;
        const itemTotal = item.totalPrice * quantity;
        totalPrice += itemTotal;

        cartHTML += `
            <div class="cart-item">
              <div class="cart-item-details">
                <h3>${item.name || 'Unnamed Item'}</h3>
                <p>Size: ${item.size || 'N/A'}</p>
                <p>Player: ${item.playerInfo || 'None'}</p>
                <p>Badges: ${item.badgesInfo || 'None'}</p>
                <p>Price: $${item.totalPrice ? item.totalPrice.toFixed(2) : 'N/A'} × ${quantity}</p>
                <p>Item Total: $${itemTotal.toFixed(2)}</p>
              </div>
              <div class="cart-item-actions">
                <button onclick="removeCartItem(${index})">Remove</button>
              </div>
            </div>
        `;
    });

    cartHTML += '</div>';
    cartContainer.innerHTML = cartHTML;
    totalPriceElement.textContent = totalPrice.toFixed(2); 
}

function removeCartItem(index) {
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
        console.error("Error parsing cart:", e);
        localStorage.removeItem('cart');
        return; 
    }

    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1); 
        localStorage.setItem('cart', JSON.stringify(cart)); 

        
        displayCartItems();
        updateCartCount();
    } else {
        console.error("Invalid index provided to removeCartItem:", index);
    }
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
    displayCartItems();
    updateCartCount();

    const orderForm = document.getElementById('order-form');
    const messageDiv = document.getElementById('order-message'); 

    if (orderForm) {
        orderForm.addEventListener('submit', async function(event) {
            event.preventDefault(); 

            if (!messageDiv) {
                 console.error("Message div (#order-message) not found.");
                 alert("An internal error occurred. Cannot display order status."); 
                 return;
            }
            messageDiv.textContent = ''; 
            messageDiv.style.color = 'inherit'; 

            const name = document.getElementById('customer-name')?.value.trim();
            const surname = document.getElementById('customer-surname')?.value.trim();
            const email = document.getElementById('customer-email')?.value.trim();
            const address = document.getElementById('customer-address')?.value.trim();

            if (!name || !surname || !email || !address) {
                messageDiv.textContent = "Please fill out all customer fields.";
                messageDiv.style.color = 'red';
                return; 
            }
            if (!/\S+@\S+\.\S+/.test(email)) {
                 messageDiv.textContent = "Please enter a valid email address.";
                 messageDiv.style.color = 'red';
                 return; 
            }

            let cart = [];
            try {
                cart = JSON.parse(localStorage.getItem('cart')) || [];
            } catch (e) {
                console.error("Error parsing cart for submission:", e);
                messageDiv.textContent = "Error reading cart data.";
                messageDiv.style.color = 'red';
                return; 
            }

            if (cart.length === 0) {
                messageDiv.textContent = "Your cart is empty. Add items before placing an order.";
                messageDiv.style.color = 'red';
                return; 
            }

            const totalPriceElement = document.getElementById('total-price');
            const totalAmount = parseFloat(totalPriceElement?.textContent || '0'); 
            if (isNaN(totalAmount) || totalAmount <= 0) { 
                 messageDiv.textContent = "Error reading total price or cart is empty.";
                 messageDiv.style.color = 'red';
                 console.error("Could not parse total price or it was invalid:", totalPriceElement?.textContent);
                 return; 
            }

            const orderData = {
                customer: { name, surname, email, address },
                items: cart, 
                totalAmount: totalAmount
            };

            try {
                messageDiv.textContent = 'Placing order...'; 
                messageDiv.style.color = 'blue'; 

                
                const response = await fetch('/admin/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData),
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || `Server error: ${response.statusText}`);
                }

                messageDiv.textContent = result.message || `Order placed successfully! Order ID: ${result.orderId}`;
                messageDiv.style.color = 'green';

                localStorage.removeItem('cart');

                displayCartItems();
                orderForm.reset(); 
                updateCartCount();


            } catch (error) {
                console.error('Error placing order:', error);
                messageDiv.textContent = `Failed to place order: ${error.message}`;
                messageDiv.style.color = 'red'; 
            }

        }); 
    } else {
        console.warn("Order form (#order-form) not found on this page.");
    } 

}); 