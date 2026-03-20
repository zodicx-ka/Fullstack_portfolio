// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate on Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
    
    // Initialize Bootstrap Tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize Bootstrap Toasts
    var toastElList = [].slice.call(document.querySelectorAll('.toast'));
    var toastList = toastElList.map(function(toastEl) {
        return new bootstrap.Toast(toastEl, {
            autohide: true,
            delay: 3000
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const nav = document.getElementById('mainNav');
        if (window.scrollY > 100) {
            nav.classList.add('navbar-scrolled');
        } else {
            nav.classList.remove('navbar-scrolled');
        }
    });
    
    // Load todos from localStorage
    loadTodos();

    // Register AJAX contact form listener
    const form = document.getElementById('ajaxContactForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});

// ========== HTML SECTION - AJAX FORM SUBMISSION ==========

async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Check form validity
    if (!e.target.checkValidity()) {
        e.target.classList.add('was-validated');
        return;
    }
    
    // Show loading state
    const submitBtn = document.getElementById('submitFormBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const formResponse = document.getElementById('formResponse');
    
    btnText.classList.add('d-none');
    btnLoading.classList.remove('d-none');
    submitBtn.disabled = true;
    
    // Collect form data
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('emailAddress').value,
        phone: document.getElementById('phoneNumber').value,
        subject: document.getElementById('messageSubject').value,
        message: document.getElementById('messageContent').value,
        timestamp: new Date().toISOString()
    };
    
    try {
        // Simulate API call (replace with actual Formspree/Getform endpoint)
        const response = await fakeApiCall(formData);
        
        // Show success message
        formResponse.className = 'alert alert-success mt-3';
        formResponse.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            Thank you ${formData.firstName}! Your message has been sent successfully.
            <br><small>This is a simulation - in production, this would send to a real API.</small>
        `;
        formResponse.classList.remove('d-none');
        
        // Reset form
        e.target.reset();
        e.target.classList.remove('was-validated');
        
        // Show toast notification
        showToast('Message Sent!', 'success');
        
    } catch (error) {
        // Show error message
        formResponse.className = 'alert alert-danger mt-3';
        formResponse.innerHTML = `
            <i class="fas fa-exclamation-circle me-2"></i>
            ${error.message}
        `;
        formResponse.classList.remove('d-none');
        
        showToast('Error sending message', 'error');
    } finally {
        // Reset button state
        btnText.classList.remove('d-none');
        btnLoading.classList.add('d-none');
        submitBtn.disabled = false;
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            formResponse.classList.add('d-none');
        }, 5000);
    }
}

// Simulate API call (replace with actual fetch to Formspree)
function fakeApiCall(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate 90% success rate
            if (Math.random() < 0.9) {
                resolve({ success: true, data });
            } else {
                reject(new Error('Network error. Please try again.'));
            }
        }, 1500);
    });
}

// ========== CSS SECTION - TAB SWITCHING ==========
document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all tabs and contents
            const parent = this.closest('.showcase-tabs').parentElement;
            parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            parent.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId + '-tab').classList.add('active');
        });
    });
});

// ========== CSS SECTION - THEME SWITCHER ==========
document.addEventListener('DOMContentLoaded', function() {
    const themeBtns = document.querySelectorAll('.theme-btn');
    
    themeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');

            // Remove any previously active theme btn highlight
            themeBtns.forEach(b => b.classList.remove('theme-btn-active'));
            this.classList.add('theme-btn-active');

            // Apply theme to root - CSS variables handle everything else
            if (theme === 'light') {
                document.documentElement.removeAttribute('data-theme');
            } else {
                document.documentElement.setAttribute('data-theme', theme);
            }

            showToast(`${theme.charAt(0).toUpperCase() + theme.slice(1)} theme activated`, 'info');
        });
    });
});

// ========== BOOTSTRAP SECTION - SHOPPING CART ==========
let cartItems = [];

document.addEventListener('DOMContentLoaded', function() {
    // Add to cart buttons
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const product = this.getAttribute('data-product');
            const price = parseFloat(this.getAttribute('data-price'));
            
            addToCart(product, price);
        });
    });
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
    
    // Clear completed button
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');
    if (clearCompletedBtn) {
        clearCompletedBtn.addEventListener('click', clearCompletedTodos);
    }
});

function addToCart(product, price) {
    cartItems.push({
        product,
        price,
        id: Date.now()
    });
    
    updateCartDisplay();
    showToast(`${product} added to cart!`, 'success');
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cartCount) {
        cartCount.textContent = cartItems.length;
    }
    
    if (cartTotal) {
        const total = cartItems.reduce((sum, item) => sum + item.price, 0);
        cartTotal.textContent = total.toFixed(2);
    }
}

function handleCheckout() {
    if (cartItems.length === 0) {
        showToast('Your cart is empty!', 'warning');
        return;
    }
    
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);
    showToast(`Checkout successful! Total: $${total.toFixed(2)}`, 'success');
    
    // Clear cart
    cartItems = [];
    updateCartDisplay();
}

// ========== JAVASCRIPT SECTION - WEATHER API ==========
document.addEventListener('DOMContentLoaded', function() {
    const getWeatherBtn = document.getElementById('getWeatherBtn');
    const cityInput = document.getElementById('cityInput');
    
    if (getWeatherBtn) {
        getWeatherBtn.addEventListener('click', getWeather);
    }
    
    if (cityInput) {
        cityInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                getWeather();
            }
        });
    }
});

async function getWeather() {
    const city = document.getElementById('cityInput').value.trim();
    
    if (!city) {
        showToast('Please enter a city name', 'warning');
        return;
    }
    
    // Show loading
    document.getElementById('weatherLoading').classList.remove('d-none');
    document.getElementById('weatherResult').classList.add('d-none');
    document.getElementById('weatherError').classList.add('d-none');
    
    try {
        // Using OpenWeatherMap API (you'll need to sign up for a free API key)
        // For demo purposes, we'll simulate the API call with fake data
        // Replace with actual API call in production
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate successful response
        const weatherData = {
            name: city,
            main: {
                temp: Math.floor(Math.random() * 30) + 5,
                humidity: Math.floor(Math.random() * 50) + 30,
                pressure: Math.floor(Math.random() * 20) + 1000
            },
            weather: [{
                description: ['clear sky', 'few clouds', 'scattered clouds', 'broken clouds', 'shower rain', 'rain', 'thunderstorm', 'snow', 'mist'][Math.floor(Math.random() * 9)],
                icon: '01d'
            }],
            wind: {
                speed: Math.floor(Math.random() * 10) + 1
            }
        };
        
        displayWeather(weatherData);
        
    } catch (error) {
        document.getElementById('weatherError').classList.remove('d-none');
        document.getElementById('weatherError').textContent = 'Error fetching weather data. Please try again.';
    } finally {
        document.getElementById('weatherLoading').classList.add('d-none');
    }
}

function displayWeather(data) {
    document.getElementById('cityName').textContent = data.name;
    document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `Wind: ${data.wind.speed} m/s`;
    document.getElementById('pressure').textContent = `Pressure: ${data.main.pressure} hPa`;
    document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    
    document.getElementById('weatherResult').classList.remove('d-none');
}

// ========== JAVASCRIPT SECTION - ADVANCED TODO ==========
let todos = [];

function loadTodos() {
    try {
        const savedTodos = localStorage.getItem('advancedTodos');
        if (savedTodos) {
            todos = JSON.parse(savedTodos);
        }
    } catch (error) {
        console.error('Error loading todos:', error);
        todos = [];
    }
    
    renderTodos();
}

function saveTodos() {
    localStorage.setItem('advancedTodos', JSON.stringify(todos));
}

document.addEventListener('DOMContentLoaded', function() {
    const addBtn = document.getElementById('advancedAddTodo');
    const input = document.getElementById('advancedTodoInput');
    const priority = document.getElementById('todoPriority');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    if (addBtn) {
        addBtn.addEventListener('click', addTodo);
    }
    
    if (input) {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTodo();
            }
        });
    }
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderTodos(this.getAttribute('data-filter'));
        });
    });
});

function addTodo() {
    const input = document.getElementById('advancedTodoInput');
    const priority = document.getElementById('todoPriority');
    
    const text = input.value.trim();
    
    if (!text) {
        showToast('Please enter a task', 'warning');
        return;
    }
    
    const newTodo = {
        id: Date.now(),
        text: text,
        priority: priority.value,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    todos.push(newTodo);
    saveTodos();
    
    input.value = '';
    renderTodos();
    
    showToast('Task added successfully!', 'success');
}

function renderTodos(filter = 'all') {
    const todoList = document.getElementById('advancedTodoList');
    const todoCount = document.getElementById('todoCount');
    
    if (!todoList) return;
    
    let filteredTodos = todos;
    
    if (filter === 'active') {
        filteredTodos = todos.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    }
    
    todoList.innerHTML = '';
    
    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = todo.completed ? 'completed' : '';
        
        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} data-id="${todo.id}">
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <span class="todo-priority priority-${todo.priority}">${todo.priority}</span>
            <i class="fas fa-trash todo-delete" data-id="${todo.id}"></i>
        `;
        
        // Add event listeners
        const checkbox = li.querySelector('.todo-checkbox');
        checkbox.addEventListener('change', toggleTodo);
        
        const deleteBtn = li.querySelector('.todo-delete');
        deleteBtn.addEventListener('click', deleteTodo);
        
        todoList.appendChild(li);
    });
    
    // Update count
    const activeCount = todos.filter(t => !t.completed).length;
    if (todoCount) {
        todoCount.textContent = activeCount;
    }
}

function toggleTodo(e) {
    const id = parseInt(e.target.getAttribute('data-id'));
    const todo = todos.find(t => t.id === id);
    
    if (todo) {
        todo.completed = e.target.checked;
        saveTodos();
        
        // Re-render with current filter
        const activeFilter = document.querySelector('.filter-btn.active');
        renderTodos(activeFilter ? activeFilter.getAttribute('data-filter') : 'all');
        
        if (todo.completed) {
            showToast('Task completed! 🎉', 'success');
        }
    }
}

function deleteTodo(e) {
    const id = parseInt(e.target.getAttribute('data-id'));
    todos = todos.filter(t => t.id !== id);
    saveTodos();
    
    const activeFilter = document.querySelector('.filter-btn.active');
    renderTodos(activeFilter ? activeFilter.getAttribute('data-filter') : 'all');
    
    showToast('Task deleted', 'info');
}

function clearCompletedTodos() {
    const completedTodos = todos.filter(t => t.completed);
    
    if (completedTodos.length === 0) {
        showToast('No completed tasks to clear', 'info');
        return;
    }
    
    todos = todos.filter(t => !t.completed);
    saveTodos();
    
    const activeFilter = document.querySelector('.filter-btn.active');
    renderTodos(activeFilter ? activeFilter.getAttribute('data-filter') : 'all');
    
    showToast(`Cleared ${completedTodos.length} completed tasks`, 'success');
}

// Escape HTML to prevent XSS
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ========== UTILITY FUNCTIONS ==========
function showToast(message, type = 'info') {
    const toastEl = document.getElementById('cartToast'); // Reusing cart toast for all notifications
    
    if (!toastEl) return;
    
    const toastHeader = toastEl.querySelector('.toast-header');
    const toastBody = document.getElementById('toastMessage');
    
    // Customize based on type
    if (type === 'success') {
        toastHeader.className = 'toast-header bg-success text-white';
        toastHeader.innerHTML = '<i class="fas fa-check-circle me-2"></i><strong class="me-auto">Success</strong><small>just now</small>';
    } else if (type === 'error') {
        toastHeader.className = 'toast-header bg-danger text-white';
        toastHeader.innerHTML = '<i class="fas fa-exclamation-circle me-2"></i><strong class="me-auto">Error</strong><small>just now</small>';
    } else if (type === 'warning') {
        toastHeader.className = 'toast-header bg-warning text-dark';
        toastHeader.innerHTML = '<i class="fas fa-exclamation-triangle me-2"></i><strong class="me-auto">Warning</strong><small>just now</small>';
    } else {
        toastHeader.className = 'toast-header bg-purple text-white';
        toastHeader.innerHTML = '<i class="fas fa-info-circle me-2"></i><strong class="me-auto">Info</strong><small>just now</small>';
    }
    
    toastBody.textContent = message;
    
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

// ========== COPY CODE SNIPPETS ==========
document.addEventListener('DOMContentLoaded', function() {
    const copyButtons = document.querySelectorAll('.copy-code');
    
    copyButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const codeId = this.getAttribute('data-code');
            const codeElement = document.getElementById(codeId);
            
            if (codeElement) {
                const code = codeElement.textContent;
                
                navigator.clipboard.writeText(code).then(() => {
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check me-1"></i>Copied!';
                    
                    setTimeout(() => {
                        this.innerHTML = originalText;
                    }, 2000);
                    
                    showToast('Code copied to clipboard!', 'success');
                }).catch(err => {
                    showToast('Failed to copy code', 'error');
                });
            }
        });
    });
});

// ========== ACTIVE NAVIGATION HIGHLIGHT ==========
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// ========== SCROLL TO TOP BUTTON ==========
document.addEventListener('DOMContentLoaded', function() {
    const toTopBtn = document.getElementById('toTop');
    
    if (toTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                toTopBtn.style.display = 'block';
            } else {
                toTopBtn.style.display = 'none';
            }
        });
        
        toTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});