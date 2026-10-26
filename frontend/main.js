const apiUrl = "http://localhost:5000/api";
const menuList = document.getElementById("menuList");
const result = document.getElementById("result");
let products = [];

function showResult(data) {
  result.textContent = JSON.stringify(data, null, 2);
}

document
  .getElementById("loadMenuButton")
  .addEventListener("click", async () => {
    try {
      const response = await fetch(`${apiUrl}/products`);
      products = await response.json();

      if (!response.ok) {
        throw new Error(products.message || "Помилка завантаження меню");
      }

      menuList.innerHTML = "";

      products.forEach((product) => {
        const item = document.createElement("li");
        item.textContent = `${product.name} — ${product.price} грн`;
        menuList.appendChild(item);
      });

      showResult(products);
    } catch (error) {
      showResult({ error: error.message });
    }
  });

document
  .getElementById("orderForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    if (products.length < 2) {
      showResult({ error: "Завантажте меню з щонайменше двома товарами." });
      return;
    }

    const items = products.slice(0, 2).map((product) => ({
      product: product._id,
      quantity: 1,
      price: product.price,
    }));

    const order = {
      customerName: document.getElementById("customerName").value,
      pickupTime: document.getElementById("pickupTime").value,
      items,
      totalPrice: items.reduce((sum, item) => sum + item.price, 0),
    };

    try {
      const response = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Помилка створення замовлення");
      }

      showResult(data);
    } catch (error) {
      showResult({ error: error.message });
    }
  });
