let currentUser = null;
let users = JSON.parse(localStorage.getItem('users')) || [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || {};

// Initialize total cost variable
let totalCost = 0;

// Data for menus and food images
const menus = {
    hotel1: [
        'Zinger Burger - Rs.200', 
        'Hot Wings - Rs.150', 
        'French Fries - Rs.100', 
        'Chicken Popcorn - Rs.180', 
        'Crispy Strips - Rs.220'
    ],
    hotel2: [
        'Chicken Sandwich - Rs.250', 
        'Shrimp Basket - Rs.300', 
        'Mashed Potatoes - Rs.80', 
        'Spicy Tenders - Rs.200', 
        'Cajun Fries - Rs.120'
    ],
    hotel3: [
        'Veggie Delight - Rs.150', 
        'Sub Wrap - Rs.200', 
        'Salad Bowl - Rs.120', 
        'Chicken Teriyaki Sub - Rs.250', 
        'Tuna Sub - Rs.220'
    ],
    hotel4: [
        'Pepperoni Pizza - Rs.350', 
        'Cheese Burst Pizza - Rs.400', 
        'Garlic Bread - Rs.100', 
        'Veggie Supreme Pizza - Rs.300', 
        'BBQ Chicken Wings - Rs.180'
    ],
    hotel5: [
        'Margherita - Rs.250', 
        'Farmhouse Pizza - Rs.350', 
        'Chicken Wings - Rs.180', 
        'Cheesy Breadsticks - Rs.150', 
        'Paneer Pizza - Rs.280'
    ],
    hotel6: [
        'Idli - Rs.50', 
        'Dosa - Rs.80', 
        'Vada - Rs.40', 
        'Sambar Rice - Rs.90', 
        'Masala Dosa - Rs.100'
    ]
};

const foodImages = {
    hotel1: [
        'https://example.com/zinger.jpg', 
        'https://example.com/wings.jpg', 
        'https://example.com/fries.jpg', 
        'https://example.com/popcorn.jpg', 
        'https://example.com/strips.jpg'
    ],
    hotel2: [
        'https://example.com/sandwich.jpg', 
        'https://example.com/shrimp.jpg', 
        'https://example.com/potatoes.jpg', 
        'https://example.com/tenders.jpg', 
        'https://example.com/fries.jpg'
    ],
    hotel3: [
        'https://example.com/veggie-delight.jpg', 
        'https://example.com/sub-wrap.jpg', 
        'https://example.com/salad-bowl.jpg', 
        'https://example.com/teriyaki.jpg', 
        'https://example.com/tuna.jpg'
    ],
    hotel4: [
        'https://example.com/pepperoni.jpg', 
        'https://example.com/cheese-burst.jpg', 
        'https://example.com/garlic-bread.jpg', 
        'https://example.com/veggie-supreme.jpg', 
        'https://example.com/bbq-wings.jpg'
    ],
    hotel5: [
        'https://example.com/margherita.jpg', 
        'https://example.com/farmhouse.jpg', 
        'https://example.com/chicken-wings.jpg', 
        'https://example.com/cheesy-breadsticks.jpg', 
        'https://example.com/paneer-pizza.jpg'
    ],
    hotel6: [
        'https://example.com/idli.jpg', 
        'https://example.com/dosa.jpg', 
        'https://example.com/vada.jpg', 
        'https://example.com/sambar-rice.jpg', 
        'https://example.com/masala-dosa.jpg'
    ]
};

// Authentication and registration functions
function loginUser(username, password) {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        currentUser = user;
        document.getElementById('auth-form').classList.add('hidden');
        document.getElementById('user-dashboard').classList.remove('hidden');
        document.getElementById('user-username').textContent = currentUser.username;
    } else {
        alert('Invalid login');
    }
}

function registerUser(username, password) {
    if (users.some(u => u.username === username)) {
        alert('Username already exists!');
    } else {
        const newUser = { username, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        currentUser = newUser;
        alert('Registration successful');
        loginUser(username, password);
    }
}

// Show food items for the selected hotel with increment and decrement functionality
function showFoodItems(hotel) {
    document.getElementById('user-dashboard').classList.add('hidden');
    const foodMenu = document.getElementById('food-menu');
    foodMenu.classList.remove('hidden');
    document.getElementById('menu-title').textContent = `Menu for ${hotel.charAt(0).toUpperCase() + hotel.slice(1)}`;

    const menuItems = document.getElementById('menu-items');
    menuItems.innerHTML = '';

    menus[hotel].forEach((foodItem, index) => {
        const foodDiv = document.createElement('div');
        foodDiv.classList.add('food-item');
        foodDiv.innerHTML = `
            <img src="${foodImages[hotel][index]}" alt="${foodItem}" />
            <h4>${foodItem}</h4>
            <div>
                <button onclick="decrementItem(${index})">-</button>
                <span id="quantity-${index}">1</span>
                <button onclick="incrementItem(${index})">+</button>
            </div>
            <button onclick="addToCart('${foodItem}', ${index})">Add to Cart</button>
        `;
        menuItems.appendChild(foodDiv);
    });
}

function incrementItem(index) {
    const quantitySpan = document.getElementById(`quantity-${index}`);
    let quantity = parseInt(quantitySpan.textContent);
    quantity++;
    quantitySpan.textContent = quantity;
}

function decrementItem(index) {
    const quantitySpan = document.getElementById(`quantity-${index}`);
    let quantity = parseInt(quantitySpan.textContent);
    if (quantity > 1) {
        quantity--;
        quantitySpan.textContent = quantity;
    }
}

function addToCart(item, index) {
    const quantity = parseInt(document.getElementById(`quantity-${index}`).textContent);
    for (let i = 0; i < quantity; i++) {
        cart.push(item);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${quantity}x ${item} added to cart!`);
}

// View Cart and update the total cost
function viewCart() {
    document.getElementById('food-menu').classList.add('hidden');
    const cartPage = document.getElementById('cart-page');
    cartPage.classList.remove('hidden');
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';

    totalCost = 0;
    cart.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = item;
        cartItems.appendChild(listItem);
        
        // Extracting price from item string
        const price = parseInt(item.split('Rs.')[1].trim());
        if (!isNaN(price)) {
            totalCost += price; 
        }
    });

    document.getElementById('cart-total').textContent = `Rs. ${totalCost}`;
}

// Proceed to checkout page
function proceedToCheckout() {
    document.getElementById('cart-page').classList.add('hidden');
    document.getElementById('payment-page').classList.remove('hidden');

    const summaryItems = document.getElementById('summary-items');
    summaryItems.innerHTML = '';

    cart.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = item;
        summaryItems.appendChild(listItem);
    });

    document.getElementById('summary-total').textContent = `Rs. ${totalCost}`;
}

// Complete order and save it to history
function completeOrder() {
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;

    if (!name || !address || !phone) {
        alert('Please fill in all fields.');
        return;
    }

    // Check if the current user has an existing order history
    if (!orderHistory[currentUser.username]) {
        orderHistory[currentUser.username] = [];
    }

    const orderDetails = {
        items: cart.slice(),
        date: new Date().toLocaleString(),  // Add date and time of the order
        totalCost: totalCost,
        customerDetails: {
            name: name,
            address: address,
            phone: phone
        }
    };

    // Save the order to the user's order history
    orderHistory[currentUser.username].push(orderDetails);
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

    alert('Order placed successfully!');

    // Clear the cart after the order is placed
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));

    // Show the updated order history and navigate to the order history page
    showOrderHistory();
}

// Show order history for the user
function showOrderHistory() {
    const orderHistoryList = document.getElementById('order-history');
    orderHistoryList.innerHTML = '';

    // Check if the user has any orders in the history
    if (orderHistory[currentUser.username]) {
        orderHistory[currentUser.username].forEach((order, index) => {
            const orderItem = document.createElement('li');
            orderItem.textContent = `Order ${index + 1} (on ${order.date}): ${order.items.join(', ')} - Total: Rs. ${order.totalCost}`;
            orderHistoryList.appendChild(orderItem);
        });
    } else {
        orderHistoryList.textContent = 'No order history yet.';
    }

    // Hide payment page and show order history
    document.getElementById('payment-page').classList.add('hidden');
    document.getElementById('user-dashboard').classList.add('hidden');
    document.getElementById('order-history-page').classList.remove('hidden');
}

// Navigation helpers
function goBackToHotels() {
    document.getElementById('food-menu').classList.add('hidden');
    document.getElementById('user-dashboard').classList.remove('hidden');
}

function goBackToMenu() {
    document.getElementById('cart-page').classList.add('hidden');
    document.getElementById('food-menu').classList.remove('hidden');
}

function goBackToCart() {
    document.getElementById('payment-page').classList.add('hidden');
    document.getElementById('cart-page').classList.remove('hidden');
}

// Authentication toggle between login and register
document.getElementById('toggle-link').addEventListener('click', function (e) {
    e.preventDefault();
    const confirmPasswordInput = document.getElementById('auth-confirm-password');
    const authFormTitle = document.getElementById('form-title');
    const authButton = document.getElementById('auth-btn');
    if (confirmPasswordInput.classList.contains('hidden')) {
        confirmPasswordInput.classList.remove('hidden');
        authFormTitle.textContent = 'Register';
        authButton.textContent = 'Register';
    } else {
        confirmPasswordInput.classList.add('hidden');
        authFormTitle.textContent = 'Login';
        authButton.textContent = 'Login';
    }
});

// Login or register button click event
document.getElementById('auth-btn').addEventListener('click', function () {
    const username = document.getElementById('auth-username').value;
    const password = document.getElementById('auth-password').value;
    const confirmPassword = document.getElementById('auth-confirm-password').value;
    if (document.getElementById('auth-confirm-password').classList.contains('hidden')) {
        loginUser(username, password);
    } else {
        if (password === confirmPassword) {
            registerUser(username, password);
        } else {
            alert('Passwords do not match');
        }
    }
});

// Logout functionality
document.getElementById('logout-btn').addEventListener('click', function () {
    currentUser = null;
    document.getElementById('user-dashboard').classList.add('hidden');
    document.getElementById('auth-form').classList.remove('hidden');
});
