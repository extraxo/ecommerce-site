const slider = document.querySelector('.slider');
const sliderImages = document.querySelectorAll('.slider img');
const prevBtn = document.querySelector('#prevBtn');
const nextBtn = document.querySelector('#nextBtn');
const dots = document.querySelectorAll('.dot');

    let counter = 1;
    const size = sliderImages[0].clientWidth;
    
    slider.style.transform = 'translateX(' + (-size * counter) + 'px)';

    function updateDots() {
        dots.forEach(dot => dot.classList.remove('active'));
        dots[counter - 1].classList.add('active');
    }

    function nextSlide(){
        if(counter >= sliderImages.length - 1) return;
        slider.style.transition = 'transform 0.4s ease-in-out';
        counter++;
        slider.style.transform = 'translateX(' + (-size * counter) + 'px)';
        updateDots();
    }

    function prevSlide(){
        if(counter <= 0) return;
        slider.style.transition = 'transform 0.4s ease-in-out';
        counter--;
        slider.style.transform = 'translateX(' + (-size * counter) + 'px)';
        updateDots();
    }
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            nextSlide();
        }, 3000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    nextBtn.addEventListener("click", () => {
        stopAutoSlide();
        nextSlide();
        startAutoSlide();
    });

    prevBtn.addEventListener("click", () => {
        stopAutoSlide();
        prevSlide();
        startAutoSlide();
    });
    
    slider.addEventListener('transitionend', () => {
        if(sliderImages[counter].id === 'last2'){
            slider.style.transition = 'none';
            counter = sliderImages.length - 2;
            slider.style.transform = 'translateX(' + (-size * counter) + 'px)';
        }
        if(sliderImages[counter].id === 'first2'){
            slider.style.transition = 'none';
            counter = sliderImages.length - counter;
            slider.style.transform = 'translateX(' + (-size * counter) + 'px)';
        }
        updateDots();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoSlide();
            counter = index + 1;
            slider.style.transition = 'transform 0.4s ease-in-out';
            slider.style.transform = `translateX(${-size * counter}px)`;
            updateDots();
            startAutoSlide();
        });
    });

    function currentSlide(index) {
        let dots = document.querySelectorAll(".dot");
        dots.forEach(dot => dot.classList.remove("active"));
        dots[index - 1].classList.add("active");
    }
    
    
    startAutoSlide();
    
    
