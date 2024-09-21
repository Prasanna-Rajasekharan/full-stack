const loginForm = document.getElementById('login-form'); 
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('login-btn');
const loginError = document.getElementById('login-error');
const userDashboard = document.getElementById('user-dashboard');
const userUsername = document.getElementById('user-username'); 
const postContent = document.getElementById('post-content'); 
const postButton = document.getElementById('post-btn');
const postList = document.getElementById('post-list');
let currentUser = null;

// Hardcoded user credentials (for demonstration)
const users = {
    "user1": "password1",
    "user2": "password2"
};

// Event listener for login button 
loginButton.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    // Validate the username and password
    if (users[username] && users[username] === password) {
        currentUser = username; 
        loginForm.style.display = 'none'; 
        userDashboard.style.display = 'block'; 
        userUsername.textContent = username;
        loadPosts();
    } else {
        loginError.style.display = 'block';
    }
});

// Event listener for post button 
postButton.addEventListener('click', () => {
    const content = postContent.value.trim();
    if (content !== '') {
        const post = {
            username: currentUser,
            content:
