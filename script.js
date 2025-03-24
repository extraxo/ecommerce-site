window.onload = function () {
    const headerOne = document.querySelector('.h1');
    const headerTwo = document.querySelector('.h2');
    const lineElement = document.querySelector('.line');
    const centerElement = document.querySelector('.center');
    const shopNowButton = document.querySelector('.shop-now');
    const shopNowText = document.querySelector('.shop-now-text');
    
    headerOne.style.opacity = '1';
    headerOne.style.transform = 'translateY(0)';
    headerTwo.style.opacity = '1';
    headerTwo.style.transform = 'translateY(0)';
    lineElement.style.width = '100%';
    
    centerElement.style.width = '500px';
    centerElement.style.height = '500px';
    
    shopNowButton.style.width = '100px';
    shopNowButton.style.height = '100px';
    
    shopNowText.style.opacity = '0';
    
    setTimeout(() => {
        headerTwo.style.opacity = '1';
        headerTwo.style.transform = 'translateY(0)';
    }, 500);
    
    setTimeout(() => {
        shopNowText.style.opacity = '1';
        shopNowText.style.transform = 'translateY(0)';
    }, 1000);
    
    let i = 0;
    let images = [
        'images/1.jpg',
        'images/2.jpg',
        'images/3.jpg',
        'images/4.jpg',
        'images/5.jpg',
        'images/6.jpg'
    ];
    
    const bg1 = document.getElementById('background');
    const bg2 = document.getElementById('background-next');
    
    function mainPageBackground() {
        let nextImage = images[i];
        
        bg2.style.backgroundImage = `url(${nextImage})`;
        bg2.style.transform = 'scale(1)'; 
        bg2.style.opacity = '1'; 
        
        setTimeout(() => {
            bg2.style.transform = 'scale(1.2)'; 
        }, 100);
        
        setTimeout(() => {
            bg1.style.backgroundImage = `url(${nextImage})`;
            bg1.style.transform = 'scale(1)'; 
            bg2.style.opacity = '0'; 
        }, 2000);
        
        i = (i + 1) % images.length;
    }
    
    mainPageBackground();
    setInterval(mainPageBackground, 5000);
};


function enterSite() {
    window.location.href = 'mainPage.html';
}