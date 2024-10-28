document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('reviewForm');
    const productList = document.getElementById('productList');

    function saveReview(productName, reviewText) {
        return new Promise((resolve, reject) => {
            try {
                const reviews = JSON.parse(localStorage.getItem('reviews')) || {};
                if (!reviews[productName]) {
                    reviews[productName] = [];
                }
                reviews[productName].push(reviewText);
                localStorage.setItem('reviews', JSON.stringify(reviews));
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    function createReviewHTML(product, reviews) {
        const reviewItems = reviews.map((review, index) => `
            <li>
                ${review}
                <button class="delete-button" data-product="${product}" data-index="${index}">Удалить</button>
            </li>
        `).join('');

        return `
            <div>
                <h2 class="product-title">${product}</h2>
                <ul>${reviewItems}</ul>
            </div>
        `;
    }

    async function displayReviews() {
        const reviews = JSON.parse(localStorage.getItem('reviews')) || {};
        productList.innerHTML = Object.entries(reviews).map(([product, reviews]) => createReviewHTML(product, reviews)).join('');
    }

    function deleteReview(productName, index) {
        return new Promise((resolve) => {
            const reviews = JSON.parse(localStorage.getItem('reviews'));
            reviews[productName].splice(index, 1);
            if (reviews[productName].length === 0) {
                delete reviews[productName];
            }
            localStorage.setItem('reviews', JSON.stringify(reviews));
            resolve();
        });
    }

    if (reviewForm) {
        reviewForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const productName = document.getElementById('productName').value;
            const reviewText = document.getElementById('reviewText').value;

            try {
                await saveReview(productName, reviewText);
                reviewForm.reset();
                alert('Отзыв добавлен!');
                await displayReviews(); 
            } catch (error) {
                console.error('Ошибка при сохранении отзыва:', error);
            }
        });
    }

    productList.addEventListener('click', async (event) => {
        if (event.target.classList.contains('delete-button')) {
            const productName = event.target.getAttribute('data-product');
            const index = event.target.getAttribute('data-index');

            await deleteReview(productName, index);
            await displayReviews();
        }
    });

    displayReviews().catch(error => {
        console.error('Ошибка при отображении отзывов:', error);
    });
});
