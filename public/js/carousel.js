document.addEventListener("DOMContentLoaded", () => {
    const carousels = document.querySelectorAll(".products__carousel");

    carousels.forEach(carousel => {
        const productContainer = carousel.querySelector(".products__grid-container");
        const prevButton = carousel.querySelector(".products__carousel-btn--prev");
        const nextButton = carousel.querySelector(".products__carousel-btn--next");

        if (!productContainer || !prevButton || !nextButton) {
            return;
        }

        const cards = productContainer.querySelectorAll(".product-card");
        if (cards.length === 0) {
            return;
        }

        const cardCount = cards.length;
        let cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(cards[0]).marginRight);
        let visibleCards = Math.floor(carousel.offsetWidth / cardWidth);
        let currentIndex = 0;
        let totalPages = Math.ceil(cardCount / visibleCards);

        const pointNavigator = carousel.querySelector(".point-navigator");

        if (pointNavigator) {
            for (let i = 0; i < totalPages; i++) {
                const dot = document.createElement("button");
                dot.addEventListener("click", () => {
                    currentIndex = i * visibleCards;
                    updateCarousel();
                });
                pointNavigator.appendChild(dot);
            }
        }

        const updatePointNavigator = () => {
            if (!pointNavigator) return;
            const dots = pointNavigator.querySelectorAll("button");
            dots.forEach((dot, i) => {
                if (i === Math.floor(currentIndex / visibleCards)) {
                    dot.classList.add("active");
                } else {
                    dot.classList.remove("active");
                }
            });
        };

        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;

        productContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            startPos = e.clientX;
            prevTranslate = currentTranslate;
            productContainer.style.cursor = 'grabbing';
        });

        productContainer.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const currentPosition = e.clientX;
            currentTranslate = prevTranslate + currentPosition - startPos;
            productContainer.style.transform = `translateX(${currentTranslate}px)`;
        });

        const endDrag = () => {
            isDragging = false;
            productContainer.style.cursor = 'grab';

            // Calculate the target index based on the final position
            const targetIndex = Math.round(-currentTranslate / cardWidth);

            // Ensure targetIndex is within valid bounds
            currentIndex = Math.max(0, Math.min(cardCount - visibleCards, targetIndex));

            updateCarousel(); // Update carousel and point navigator
        };

        productContainer.addEventListener('mouseup', endDrag);
        productContainer.addEventListener('mouseleave', () => {
            if (isDragging) {
                endDrag();
            }
        });

        const handleNext = () => {
            if (currentIndex < cardCount - visibleCards) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateCarousel();
        };

        const handlePrev = () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = cardCount - visibleCards;
            }
            updateCarousel();
        };

        const updateCarousel = () => {
            productContainer.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            updatePointNavigator();
        };

        nextButton.addEventListener("click", handleNext);
        prevButton.addEventListener("click", handlePrev);

        window.addEventListener("resize", () => {
            cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(cards[0]).marginRight);
            visibleCards = Math.floor(carousel.offsetWidth / cardWidth);
            totalPages = Math.ceil(cardCount / visibleCards);

            updateCarousel();
        });

        updateCarousel();
    });
});