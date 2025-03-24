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
    document.addEventListener("DOMContentLoaded",() =>{

        let itemGenerator = [
            ["images/fcbkit.png", "F.C Barcelona 2024/25 Home Kit", "$99.99", "fcbkitpage.html"],
            ["images/interkit.png", "Inter Milan 2024/25 Home Kit", "$99.99", "interkitpage.html"],
            ["images/rmkit.avif", "Real Madrid 2024/25 Home Kit", "$99.99", "rmkitpage.html"],
            ["images/phantomboot.png", "Nike United Mercurial Superfly 10 Academy", "$259.99", "boots1page.html"],
            ["images/f50.avif", "Adidas F50 Elite Firm Ground Cleats", "$159.99", "boots2page.html"],
            ["images/nikeball.png", "Premier League Club Elite", "$59.99", "ballpage.html"],
        ];

        let container = document.querySelector(".product-list");
    
        itemGenerator.forEach(item => {
            let itemData = document.createElement("div");
            itemData.className = "product-item";
    
            let img = document.createElement("img");
            img.width = 500;
            img.height = 500;
            img.src = item[0];
            img.onclick = function() {
                window.location.href = item[3];
            };
    
            let name = document.createElement("h3");
            name.textContent = item[1];
            name.onclick = () => {
                window.location.href = item[3];
            };
    
            let price = document.createElement("p");
            price.textContent = item[2];
    
            itemData.appendChild(img);
            itemData.appendChild(name);
            itemData.appendChild(price);
    
            container.appendChild(itemData);
        });
    });
    
    startAutoSlide();
    
    
