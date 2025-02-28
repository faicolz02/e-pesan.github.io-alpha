// Menu Data
const menu = {
  fav: [
    { name: "Nasi Goreng Kampung", price: 7.50, image: "images/kampung.jpg" },
    { name: "Nasi Goreng USA", price: 12.00, image: "images/goreng-usa.jpg" },
  ],
  rice: [
    { name: "Nasi Goreng Ayam", price: 8.50, image: "images/ng_ayam.jpg" },
    { name: "Nasi Goreng Pataya", price: 8.00, image: "images/pataya.jpg" },
  ],
  noodles: [
    { name: "Goreng", price: 6.50, image: "images/Kopi.jpg" },
    { name: "Kungfu", price: 8.00, image: "images/Kopi.jpg" },
  ],
    other: [
      {
        name: "Nasi Tomyam", Price: 8.00, image: "images/Nasi_Tomyam.jpg"
      }
    ],
  drinks : [
    {
      name: "Lemonade", price: 3.99, image: "images/lemonade.jpg",
      name: "Teh ais", price: 2.50, image: "images/teh-beng.jpg"
    }
  ]
};

let cart = [];

// Initialize Menu
function loadMenu(category = "all") {
  const container = document.getElementById("menu-container");
  container.innerHTML = "";

  const items =
    category === "all"
      ? [...menu.appetizers, ...menu.mains, ...menu.drinks]
      : menu[category];

  items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "menu-item";
    div.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>$${item.price.toFixed(2)}</p>
            <button onclick="addToCart('${item.name}', ${
      item.price
    })">Add to Cart</button>
        `;
    container.appendChild(div);
  });
}

// Cart Functions
function addToCart(name, price) {
  cart.push({ name, price });
  updateCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const totalElement = document.getElementById("total");
  cartItems.innerHTML = "";

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
            ${item.name} - $${item.price.toFixed(2)}
            <button onclick="removeFromCart(${index})" class="remove-btn">❌</button>
        `;
    cartItems.appendChild(div);
  });

  totalElement.textContent = cart
    .reduce((sum, item) => sum + item.price, 0)
    .toFixed(2);
}

// Category Filtering
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const category = btn.dataset.category;
        loadMenu(category);
    });
});

// Order Type Handling
const urlParams = new URLSearchParams(window.location.search);
const tableNumber = urlParams.get('table');

if (tableNumber) {
    document.getElementById('order-type-header').textContent = Dine-In (Table, ${tableNumber});
    document.getElementById('dinein-fields').style.display = 'block';
    document.getElementById('display-table-number').textContent = tableNumber;
} else {
    document.getElementById('order-type-header').textContent = "Takeaway Order";
    document.getElementById('takeaway-fields').style.display = 'block';
}

// Form Submission
document.getElementById('order-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const orderData = {
        type: tableNumber ? 'dine-in' : 'takeaway',
        table: tableNumber || 'N/A',
        items: cart.map(item => `${item.name} - $${item.price.toFixed(2)}`).join(', '),
        total: document.getElementById('total').textContent,
        ...(tableNumber ? {} : {
            name: document.querySelector('[name="name"]').value,
            phone: document.querySelector('[name="phone"]').value,
            pickupTime: document.querySelector('[name="pickup-time"]').value
        })
    };

    // Replace with your Google Script URL
    await fetch('https://script.google.com/macros/s/AKfycbwzpAbUokA5IiiZqY4zENLQITJALR9kJQTRS7NQOWE/exec', {
        method: 'POST',
        body: JSON.stringify(orderData)
    });

    alert('Order placed successfully!');
    window.location.reload();
});

// Initial Load
loadMenu();