document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('review-form');
    const formMessage = document.getElementById('review-form-message');

    if (reviewForm) {
        reviewForm.addEventListener('submit', async (event) => {
            event.preventDefault(); 

            const nameInput = document.getElementById('review-name');
            const ratingInput = document.getElementById('review-rating');
            const commentInput = document.getElementById('review-comment');
            
            const productSlug = reviewForm.dataset.productSlug || reviewForm.dataset.kitSlug || reviewForm.dataset.bootSlug; 

            if (!productSlug) {
                console.error('No product slug found in form data attributes');
                if (formMessage) {
                    formMessage.textContent = 'Error: Could not determine product identifier.';
                    formMessage.className = 'form-message error';
                }
                return;
            }

            const reviewData = {
                name: nameInput ? nameInput.value.trim() : '',
                rating: ratingInput ? ratingInput.value : '',
                comment: commentInput ? commentInput.value.trim() : ''
            };

            if (formMessage) {
                formMessage.textContent = '';
                formMessage.className = 'form-message';
            }

            if (!reviewData.name || !reviewData.rating || !reviewData.comment) {
                if (formMessage) {
                    formMessage.textContent = 'Please fill out all fields.';
                    formMessage.classList.add('error');
                }
                return;
            }
            
            if (reviewData.rating < 1 || reviewData.rating > 5) {
                if (formMessage) {
                    formMessage.textContent = 'Rating must be between 1 and 5.';
                    formMessage.classList.add('error');
                }
                return;
            }

            try {
                const response = await fetch(`/products/${productSlug}/reviews`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(reviewData),
                });

                const result = await response.json(); 

                if (!response.ok) {
                    throw new Error(result.message || `HTTP error! status: ${response.status}`);
                }

                window.location.reload();

            } catch (error) {
                console.error('Error submitting review:', error);
                if (formMessage) {
                    formMessage.textContent = `Error: ${error.message}`;
                    formMessage.classList.add('error');
                }
            }
        });
    }
});

function createReviewElement(review) {
    const div = document.createElement('div');
    div.classList.add('review-item');
    
    const reviewId = review._id || `new-${Date.now()}`;
    div.id = `review-${reviewId}`; 

    const reviewDate = new Date(review.date || review.createdAt || new Date()).toLocaleDateString('bg-BG', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    div.innerHTML = `
        <p><strong>${escapeHTML(review.name)}</strong> - Rating: ${escapeHTML(String(review.rating))}/5</p>
        <p class="review-comment">${escapeHTML(review.comment)}</p>
        <p class="review-date"><small>Reviewed on: ${reviewDate}</small></p>
    `;
    return div;
}

function escapeHTML(str) {
    if (str === undefined || str === null) {
        return '';
    }
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}