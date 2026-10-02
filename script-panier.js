document.addEventListener("DOMContentLoaded", () => {

    // Charger panier depuis localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const cartBody = document.getElementById("cartBody");
    const totalPrice = document.getElementById("totalPrice");

    // Convertit un texte comme "1 234,56 TND" ou "1200 TND" en Number 1234.56 ou 1200
    function parsePrice(text) {
        if (!text) return 0;
        // Remplacer virgule par point, garder chiffres, points et espaces
        text = String(text).trim().replace(',', '.');
        // Trouver la partie numérique (ex : "1 234.56" ou "1200")
        const m = text.match(/[\d\s.]+/);
        if (!m) return 0;
        // Supprimer les espaces (séparateurs de milliers) puis parseFloat
        const num = parseFloat(m[0].replace(/\s+/g, ''));
        return isNaN(num) ? 0 : num;
    }

    // 🔄 Fonction : met à jour l'affichage
    function updateCart() {
        cartBody.innerHTML = "";
        let total = 0;

        if (cart.length === 0) {
            cartBody.innerHTML = "<tr><td colspan='5'></td></tr>";
            totalPrice.textContent = "0.000 TND";
            return;
        }

        cart.forEach((item, i) => {
            const row = `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.price.toFixed(3)} TND</td>
                    <td>
                        <button onclick="changeQty(${i}, -1)">-</button>
                        ${item.quantity}
                        <button onclick="changeQty(${i}, 1)">+</button>
                    </td>
                    <td>${(item.price * item.quantity).toFixed(3)} TND</td>
                    <td>
                        <button onclick="removeItem(${i})">X</button>
                    </td>
                </tr>
            `;
            cartBody.innerHTML += row;
            total += item.price * item.quantity;
        });

        totalPrice.textContent = total.toFixed(3) + " TND";
    }

    // ➕ Ajouter au panier (boutons .add-to-cart)
    document.querySelectorAll(".add-to-cart").forEach(btn => {
        btn.addEventListener("click", () => {
            const card = btn.closest(".product-card");
            const name = card.querySelector("h3").textContent;
            const priceText = card.querySelector(".price").textContent;
            const price = parsePrice(priceText);

            const item = cart.find(p => p.name === name);

            if (item) item.quantity++;
            else cart.push({ name, price, quantity: 1 });

            localStorage.setItem("cart", JSON.stringify(cart));
            updateCart();
        });
    });

    // 📌 Changer quantité
    window.changeQty = (index, value) => {
        cart[index].quantity += value;
        if (cart[index].quantity <= 0) cart.splice(index, 1);

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCart();
    };

    // ❌ Supprimer un article
    window.removeItem = (index) => {
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCart();
    };

    // 🗑 Vider tout le panier
    document.getElementById("clearCart").onclick = () => {
        cart = [];
        localStorage.removeItem("cart");
        updateCart();
    };

    // ✔ Valider la commande
    document.getElementById("validateCart").onclick = () => {
        if (cart.length === 0) return;
        cart = [];
        localStorage.removeItem("cart");
        updateCart();
    };

    // Affichage au chargement
    updateCart();
});