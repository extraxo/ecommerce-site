document.addEventListener('DOMContentLoaded', () => {

    window.playerIndex = 0;
    let currentEditingBaseId = null;

    function addPlayerField(playerData = null) {
        const container = document.getElementById('playersContainer');
        if (!container) { console.error("playersContainer not found"); return; }
        const div = document.createElement('div');
        div.classList.add('player-entry');
        const currentIndex = window.playerIndex++;
        div.innerHTML = `
            <input type="text" name="players[${currentIndex}][name]" placeholder="Player Name" value="${playerData?.name || ''}" required>
            <input type="number" name="players[${currentIndex}][number]" placeholder="Number" value="${playerData?.number || ''}" required>
            <input type="number" name="players[${currentIndex}][additionalPrice]" placeholder="Additional Price" step="0.01" value="${playerData?.additionalPrice}" required>
            <button type="button" onclick="this.parentElement.remove()">Remove</button>
        `;
        const addButton = container.querySelector('button[onclick="addPlayerField()"]');
         if (addButton) 
            { 
                container.insertBefore(div, addButton); 
            } 
         else 
         { 
            container.appendChild(div); 
        }
    }

    window.addPlayerField = addPlayerField; 

    const categorySelect = document.getElementById("category-select-id");
    if (categorySelect) {
         categorySelect.addEventListener("change", function () {
            document.querySelectorAll('.category-fields').forEach(el => el.classList.add('hidden'));
            const kitFields = document.getElementById('kitFields');
            const bootFields = document.getElementById('bootFields');

            if (this.value === 'kits' && kitFields) {
                kitFields.classList.remove('hidden');
            } else if (this.value === 'boots' && bootFields) {
                bootFields.classList.remove('hidden');
            }
        });
    } else {
        console.error("Category select dropdown (#category-select-id) not found");
    }

    const productForm = document.getElementById('product-form');
    const formTitle = document.getElementById('form-title');
    const submitButton = document.getElementById('form-submit');
    const editProductIdInput = document.getElementById('edit-product-id');
    const cancelEditButton = document.getElementById('cancel-edit-button');
    const imageInput = document.getElementById('image-input-id');

    if (!productForm || !formTitle || !submitButton || !editProductIdInput || !imageInput || !categorySelect) {
        console.error("One or more essential form elements could not be found. Check HTML IDs carefully.");
    }

    function resetForm() {
        if (!productForm) return;
        productForm.reset();
        if(formTitle) formTitle.textContent = 'Add New Product';
        if(submitButton) submitButton.textContent = 'Add Product';
        if(editProductIdInput) editProductIdInput.value = '';
        currentEditingBaseId = null;
        if(cancelEditButton) cancelEditButton.style.display = 'none';
        if(imageInput) imageInput.value = '';
        document.querySelectorAll('#playersContainer .player-entry').forEach(entry => entry.remove());
        document.querySelectorAll('.category-fields').forEach(el => el.classList.add('hidden'));
        playerIndex = 0;
        if(productForm) productForm.noValidate = false;
        if(imageInput) imageInput.required = true;
    }

    function populateForm(productData, category, baseId) {
        if (!productForm) return;
        resetForm();

        currentEditingBaseId = baseId;

        if(formTitle) formTitle.textContent = 'Edit Product';
        if(submitButton) submitButton.textContent = 'Update Product';
        if(editProductIdInput) editProductIdInput.value = productData._id;
        if(cancelEditButton) cancelEditButton.style.display = 'inline-block';
        if(productForm) productForm.noValidate = true;
        if(imageInput) imageInput.required = false;

        const nameInput = productForm.querySelector('input[name="name"]');
        if(nameInput) nameInput.value = productData.name || '';
        const subtitleInput = productForm.querySelector('input[name="subtitle"]');
        if(subtitleInput) subtitleInput.value = productData.subtitle || '';
        const slugInput = productForm.querySelector('input[name="slug"]');
        if(slugInput) slugInput.value = productData.slug || '';
        const descTextarea = productForm.querySelector('textarea[name="description"]');
        if(descTextarea) descTextarea.value = productData.description || '';
        const priceInput = productForm.querySelector('input[name="price"]');
        if(priceInput) priceInput.value = productData.price || '';

        const detailsTextarea = productForm.querySelector('textarea[name="detailedDescription"]');
         if(detailsTextarea) detailsTextarea.value = Array.isArray(productData.details) ? productData.details.join('\n') : (productData.details || '');
        const benefitsTextarea = productForm.querySelector('textarea[name="benefits"]');
         if(benefitsTextarea) benefitsTextarea.value = Array.isArray(productData.benefits) ? productData.benefits.join(', ') : (productData.benefits || '');

        const categorySelectInput = document.getElementById('category-select-id');
        if (categorySelectInput) {
            categorySelectInput.value = category;
            const event = new Event('change', { bubbles: true });
            categorySelectInput.dispatchEvent(event);
        }

        if (category === 'kits') {
             const playersContainer = document.getElementById('playersContainer');
            if (playersContainer) {
                document.querySelectorAll('#playersContainer .player-entry').forEach(entry => entry.remove());
                playerIndex = 0;
                if (productData.players && Array.isArray(productData.players)) {
                    productData.players.forEach(player => addPlayerField(player));
                }
            }
            const badgeCheckbox = productForm.querySelector('input[name="badgeAvailable"]');
            const badgePriceInput = productForm.querySelector('input[name="badgeAdditionalPrice"]');
            if (productData.badgeOptions) {
                if(badgeCheckbox) badgeCheckbox.checked = productData.badgeOptions.available || false;
                if(badgePriceInput) badgePriceInput.value = productData.badgeOptions.additionalPrice || 0;
            } else {
                if(badgeCheckbox) badgeCheckbox.checked = false;
                if(badgePriceInput) badgePriceInput.value = '';
            }
        }
    }

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            const baseProductId = event.target.dataset.id;
            const category = event.target.dataset.category;
            if (!baseProductId || !category) { return; }
            try {
                const response = await fetch(`/admin/edit/${baseProductId}?category=${category}`);
                if (!response.ok) {
                     const errorText = await response.text(); 
                    throw new Error(`HTTP error! status: ${response.status} - ${errorText || response.statusText}`);
                 }
                const productData = await response.json(); 
                populateForm(productData, category, baseProductId);
                if(productForm) productForm.scrollIntoView({ behavior: 'smooth' });
            } catch (error) {
                 console.error('Error fetching or populating product data:', error);
                 alert(`Failed to load product data for editing. ${error.message}`);
             }
        });
    });

    if (productForm) {
         productForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const isEditing = !!currentEditingBaseId;
            const url = isEditing ? `/admin/update/${currentEditingBaseId}` : '/admin/newproduct';
            const method = isEditing ? 'PATCH' : 'POST';

            if(submitButton) { }

            let response;
            try {
                const formData = new FormData(productForm);
                response = await fetch(url, { method: method, body: formData });

                let responseData;
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    responseData = await response.json();
                } else {
                    responseData = await response.text(); 
                }
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status} - ${responseData?.message || responseData || response.statusText}`);
                }

                alert(responseData.message || "Operation successful!"); 
                window.location.href = '/admin';

            } catch (error) {
                console.error('Error submitting form:', error);
                alert(`Error submitting form: ${error.message}`);
             }
             finally {
                if(submitButton){
                     submitButton.disabled = false;
                    submitButton.textContent = isEditing ? 'Update Product' : 'Add Product';
                }
             }
        });
    } else {
        console.error("Product form (#product-form) not found, submit listener not attached.");
    }

}); 
