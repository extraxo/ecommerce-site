document.addEventListener("DOMContentLoaded",() =>{

    let itemGenerator = [
        ["/images/nikeball.png", "Premier League Club Elite", "$59.99", "ballpage.html"]
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