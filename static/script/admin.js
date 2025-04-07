document.addEventListener("DOMContentLoaded", function () {
    const addItemForm = document.getElementById('addItemForm');
    if (addItemForm) {
        addItemForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const formData = {
                title: document.getElementById('title').value.trim(),
                author: document.getElementById('author').value.trim(),
                price: parseFloat(document.getElementById('price').value),
                image: document.getElementById('image').value.trim(),
                shortDescription: document.getElementById('shortDescription').value.trim(),
                fullDescription: document.getElementById('fullDescription').value.trim()
            };

            // Validate form data
            if (!formData.title || !formData.author || !formData.price || 
                !formData.image || !formData.shortDescription || !formData.fullDescription) {
                alert('Please fill in all required fields');
                return;
            }

            if (isNaN(formData.price) || formData.price <= 0) {
                alert('Please enter a valid positive price');
                return;
            }

            try {
                let response;
                const productId = this.dataset.productId;

                if (productId) { // Update existing product
                    response = await fetch(`/api/admin/products/${productId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    });
                } else { // Add new product
                    response = await fetch('/api/admin/products', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    });
                }

                const data = await response.json();

                if (response.ok) {
                    alert(productId ? 'Product updated successfully' : 'Product added successfully');
                    this.reset();
                    this.dataset.productId = '';
                    this.querySelector('input[type="submit"]').value = 'Add Product';
                    loadItems();
                } else {
                    alert(data.message || 'Error saving product');
                    console.error('Server response:', data);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error saving product. Please check the console for details.');
            }
        });
    }
    // Load items when page loads
    loadItems();
});
async function loadItems() {
    try {
        const response = await fetch('/api/admin/products');
        const items = await response.json();

        const itemsList = document.getElementById('itemsList');
        if (!itemsList) {
            console.error('Items list container not found');
            return;
        }

        itemsList.innerHTML = '';

        if (items && Array.isArray(items)) {
            items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'admin-item';
                itemDiv.innerHTML = `
                    <h3>${item.title}</h3>
                    <p>Author: ${item.author}</p>
                    <p>Price: $${item.price}</p>
                    <button class="edit-btn" data-id="${item._id}">Edit</button>
                    <button class="delete-btn" data-id="${item._id}">Delete</button>
                `;
                itemsList.appendChild(itemDiv);
            });

            // Add event listeners for edit buttons
            document.querySelectorAll('.edit-btn').forEach(button => {
                button.addEventListener('click', async function () {
                    const productId = this.dataset.id;
                    const item = items.find(i => i._id === productId);

                    if (item) {
                        document.getElementById('title').value = item.title;
                        document.getElementById('author').value = item.author;
                        document.getElementById('price').value = item.price;
                        document.getElementById('image').value = item.image;
                        document.getElementById('shortDescription').value = item.shortDescription;
                        document.getElementById('fullDescription').value = item.fullDescription;

                        addItemForm.dataset.productId = productId;
                        addItemForm.querySelector('input[type="submit"]').value = 'Update Product';
                    }
                });
            });

            // Add event listeners for delete buttons
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', async function () {
                    if (confirm('Are you sure you want to delete this product?')) {
                        const productId = this.dataset.id;

                        try {
                            const response = await fetch(`/api/admin/products/${productId}`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            });

                            const data = await response.json();

                            if (response.ok) {
                                alert('Product deleted successfully');
                                loadItems(); // Refresh the list
                            } else {
                                alert(data.message || 'Error deleting product');
                            }
                        } catch (error) {
                            console.error('Error deleting product:', error);
                            alert('Error deleting product. Please try again.');
                        }
                    }
                });
            });
        }
    } catch (error) {
        console.error('Error loading items:', error);
        alert('Error loading items. Please try again.');
    }
}

