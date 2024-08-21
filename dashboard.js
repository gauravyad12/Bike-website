// Check if user is logged in
if (localStorage.getItem('loggedIn') !== 'true') {
    window.location.href = 'login.html';
}

// Update username
document.getElementById('username').textContent = localStorage.getItem('username') || 'User';

// Navigation functionality
document.querySelectorAll('.sidebar-menu a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector('.sidebar-menu a.active').classList.remove('active');
        this.classList.add('active');
        document.querySelector('.dashboard-section.active').classList.remove('active');
        document.getElementById(this.dataset.section).classList.add('active');
    });
});

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('username');
    window.location.href = 'index.html';
});

// Simulate fetching user data
function fetchUserData() {
    // In a real application, you would fetch this data from a server
    return {
        totalOrders: 15,
        totalSpent: 2345.67,
        favoriteProduct: 'Mountain Bike Pro',
        recentActivity: [
            { action: 'Placed an order', date: '2023-06-01' },
            { action: 'Updated profile', date: '2023-05-28' },
            { action: 'Viewed Mountain Bike Pro', date: '2023-05-25' }
        ],
        orders: [
            { id: '001', date: '2023-06-01', total: 799.99, status: 'Processing' },
            { id: '002', date: '2023-05-15', total: 549.99, status: 'Shipped' },
            { id: '003', date: '2023-04-30', total: 999.99, status: 'Delivered' }
        ]
    };
}

// Populate dashboard with user data
const userData = fetchUserData();
document.getElementById('totalOrders').textContent = userData.totalOrders;
document.getElementById('totalSpent').textContent = `$${userData.totalSpent.toFixed(2)}`;
document.getElementById('favoriteProduct').textContent = userData.favoriteProduct;

// Populate recent activity
const activityList = document.getElementById('activityList');
userData.recentActivity.forEach(activity => {
    const li = document.createElement('li');
    li.textContent = `${activity.action} on ${activity.date}`;
    activityList.appendChild(li);
});

// Populate orders table
const ordersTableBody = document.querySelector('#ordersTable tbody');
userData.orders.forEach(order => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${order.id}</td>
        <td>${order.date}</td>
        <td>$${order.total.toFixed(2)}</td>
        <td>${order.status}</td>
        <td>
            <button class="btn btn-small btn-primary view-order" data-id="${order.id}">View</button>
            ${order.status === 'Processing' ? `<button class="btn btn-small btn-success confirm-order" data-id="${order.id}">Confirm</button>` : ''}
        </td>
    `;
    ordersTableBody.appendChild(row);
});

// Add event listeners for view and confirm buttons
document.querySelectorAll('.view-order').forEach(btn => {
    btn.addEventListener('click', () => showOrderDetails(btn.dataset.id));
});
document.querySelectorAll('.confirm-order').forEach(btn => {
    btn.addEventListener('click', () => confirmOrder(btn.dataset.id));
});

// Handle profile form submission
document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // In a real application, you would send this data to a server
    alert('Profile updated successfully!');
});

// Handle settings form submission
document.getElementById('settingsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // In a real application, you would send this data to a server
    alert('Settings saved successfully!');
});

// Theme switcher
document.getElementById('theme').addEventListener('change', function() {
    document.body.classList.toggle('dark-theme', this.value === 'dark');
});

// Initialize theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
    document.getElementById('theme').value = 'dark';
}

// Save theme preference
document.getElementById('theme').addEventListener('change', function() {
    localStorage.setItem('theme', this.value);
});

// Simulate fetching order items data
function fetchOrderItems() {
    // In a real application, you would fetch this data from a server
    return [
        { id: 1, name: 'Mountain Bike Pro', price: 999.99, image: 'image/mountain-bike.jpg' },
        { id: 2, name: 'Road Bike Elite', price: 1299.99, image: 'image/road-bike.jpg' },
        { id: 3, name: 'Bike Helmet', price: 79.99, image: 'image/bike-helmet.jpg' },
        { id: 4, name: 'Cycling Shoes', price: 149.99, image: 'image/cycling-shoes.jpg' },
        { id: 5, name: 'Bike Light Set', price: 29.99, image: 'image/bike-light.jpg' }
    ];
}

// Populate order items
function populateOrderItems(items = fetchOrderItems()) {
    const orderItemsContainer = document.querySelector('.order-items-container');
    orderItemsContainer.innerHTML = ''; // Clear existing content

    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('order-item');
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="order-item-image">
            <div class="order-item-details">
                <h3>${item.name}</h3>
                <p>Price: $${item.price.toFixed(2)}</p>
                <button class="btn btn-small btn-primary add-to-cart" data-id="${item.id}">Add to Cart</button>
            </div>
        `;
        orderItemsContainer.appendChild(itemElement);

        itemElement.querySelector('.add-to-cart').addEventListener('click', () => addToCart(item));
    });
}

// Call populateOrderItems when the Order Items section is shown
document.querySelector('.sidebar-menu a[data-section="orderItems"]').addEventListener('click', populateOrderItems);

// Add to cart functionality
function addToCart(item) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

// Call updateCartCount when the page loads
document.addEventListener('DOMContentLoaded', updateCartCount);

// Search functionality
function searchOrderItems(query) {
    const orderItems = fetchOrderItems();
    return orderItems.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase())
    );
}

document.getElementById('searchInput').addEventListener('input', function() {
    const query = this.value;
    const filteredItems = searchOrderItems(query);
    populateOrderItems(filteredItems);
});

// Sort order items
function sortOrderItems(items, sortBy) {
    return items.sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
    });
}

document.getElementById('sortSelect').addEventListener('change', function() {
    const sortBy = this.value;
    const orderItems = fetchOrderItems();
    const sortedItems = sortOrderItems(orderItems, sortBy);
    populateOrderItems(sortedItems);
});

// Simulate order confirmation
function confirmOrder(orderId) {
    // In a real application, you would send this to a server
    const order = userData.orders.find(o => o.id === orderId);
    if (order) {
        order.status = 'Confirmed';
        order.trackingNumber = 'TRK' + Math.random().toString(36).substr(2, 9).toUpperCase();
        order.trackingHistory = [
            { date: new Date().toISOString(), status: 'Order Confirmed' },
            { date: new Date(Date.now() + 86400000).toISOString(), status: 'Processing' }
        ];
        updateOrdersTable();
        showOrderDetails(orderId);
    }
}

// Show order details
function showOrderDetails(orderId) {
    const order = userData.orders.find(o => o.id === orderId);
    if (order) {
        const orderInfo = document.getElementById('orderInfo');
        orderInfo.innerHTML = `
            <h3>Order #${order.id}</h3>
            <p>Date: ${order.date}</p>
            <p>Total: $${order.total.toFixed(2)}</p>
            <p>Status: ${order.status}</p>
            ${order.trackingNumber ? `<p>Tracking Number: ${order.trackingNumber}</p>` : ''}
        `;

        const trackingList = document.getElementById('trackingList');
        trackingList.innerHTML = '';
        if (order.trackingHistory) {
            order.trackingHistory.forEach(event => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span class="tracking-date">${new Date(event.date).toLocaleDateString()}</span>
                    <span class="tracking-status">${event.status}</span>
                `;
                trackingList.appendChild(li);
            });
        }

        // Switch to the order details section
        showSection('orderDetails');
    }
}

// Update orders table
function updateOrdersTable() {
    const ordersTableBody = document.querySelector('#ordersTable tbody');
    ordersTableBody.innerHTML = '';
    userData.orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.date}</td>
            <td>$${order.total.toFixed(2)}</td>
            <td>${order.status}</td>
            <td>
                <button class="btn btn-small btn-primary view-order" data-id="${order.id}">View</button>
                ${order.status === 'Processing' ? `<button class="btn btn-small btn-success confirm-order" data-id="${order.id}">Confirm</button>` : ''}
            </td>
        `;
        ordersTableBody.appendChild(row);
    });

    // Add event listeners for view and confirm buttons
    document.querySelectorAll('.view-order').forEach(btn => {
        btn.addEventListener('click', () => showOrderDetails(btn.dataset.id));
    });
    document.querySelectorAll('.confirm-order').forEach(btn => {
        btn.addEventListener('click', () => confirmOrder(btn.dataset.id));
    });
}

// Helper function to show a specific section
function showSection(sectionId) {
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

// Update the initial orders table population
updateOrdersTable();

// Add this function to your existing dashboard.js file
function loadUserProfile() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    const profileSection = document.getElementById('profile');
    
    if (profileSection) {
        profileSection.innerHTML = `
            <h2>Your Profile</h2>
            <p><strong>Name:</strong> ${userData.name || 'Not set'}</p>
            <p><strong>Email:</strong> ${userData.email || 'Not set'}</p>
            <p><strong>Phone:</strong> ${userData.phone || 'Not set'}</p>
            <a href="profile-edit.html" class="btn btn-primary">Edit Profile</a>
        `;
    }

    // Update user avatar if it exists in the dashboard header
    const userAvatar = document.querySelector('.header-user img');
    if (userAvatar && userData.profilePhoto) {
        userAvatar.src = userData.profilePhoto;
    }

    // Update username if it exists in the dashboard header
    const username = document.getElementById('username');
    if (username && userData.name) {
        username.textContent = userData.name;
    }
}

// Call this function when the dashboard loads
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    loadUserProfile();
});

// Add these functions to your existing dashboard.js file

function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('userSettings')) || {};
    document.getElementById('theme').value = settings.theme || 'light';
    document.getElementById('language').value = settings.language || 'en';
    document.getElementById('emailNotifications').checked = settings.emailNotifications || false;
    document.getElementById('pushNotifications').checked = settings.pushNotifications || false;
    document.getElementById('profileVisibility').checked = settings.profileVisibility || false;
    document.getElementById('darkMode').checked = settings.darkMode || false;

    applyTheme(settings.theme);
    applyDarkMode(settings.darkMode);
}

function saveSettings(event) {
    event.preventDefault();
    const settings = {
        theme: document.getElementById('theme').value,
        language: document.getElementById('language').value,
        emailNotifications: document.getElementById('emailNotifications').checked,
        pushNotifications: document.getElementById('pushNotifications').checked,
        profileVisibility: document.getElementById('profileVisibility').checked,
        darkMode: document.getElementById('darkMode').checked
    };
    localStorage.setItem('userSettings', JSON.stringify(settings));
    alert('Settings saved successfully!');
    applyTheme(settings.theme);
    applyDarkMode(settings.darkMode);
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else if (theme === 'light') {
        document.body.classList.remove('dark-theme');
    } else if (theme === 'auto') {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }
}

function applyDarkMode(isDarkMode) {
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

// Update the existing DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    loadUserProfile();
    loadSettings();

    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', saveSettings);
    }

    // Listen for system theme changes if auto theme is selected
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addListener(function() {
            const settings = JSON.parse(localStorage.getItem('userSettings')) || {};
            if (settings.theme === 'auto') {
                applyTheme('auto');
            }
        });
    }

    // Add event listener for dark mode toggle
    const darkModeToggle = document.getElementById('darkMode');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', function() {
            applyDarkMode(this.checked);
        });
    }
});