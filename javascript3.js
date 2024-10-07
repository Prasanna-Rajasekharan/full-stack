let currentUser = null;
let users = JSON.parse(localStorage.getItem('users')) || [];
let posts = JSON.parse(localStorage.getItem('posts')) || [];
const following = new Set();

const authTitle = document.getElementById('form-title');
const authBtn = document.getElementById('auth-btn');
const authError = document.getElementById('auth-error');
const authToggleText = document.getElementById('auth-toggle-text');
const toggleLink = document.getElementById('toggle-link');
const confirmPasswordInput = document.getElementById('auth-confirm-password');

// Toggle between Login and Register
let isLogin = true;

toggleLink.addEventListener('click', function () {
    if (isLogin) {
        authTitle.textContent = 'Register';
        authBtn.textContent = 'Register';
        confirmPasswordInput.classList.remove('hidden');
        authToggleText.innerHTML = 'Already have an account? <a href="#">Login here</a>';
        isLogin = false;
    } else {
        authTitle.textContent = 'Login';
        authBtn.textContent = 'Login';
        confirmPasswordInput.classList.add('hidden');
        authToggleText.innerHTML = 'New user? <a href="#">Register here</a>';
        isLogin = true;
    }
});

// Registration and Login functionality in one form
document.getElementById('auth-btn').addEventListener('click', function () {
    const username = document.getElementById('auth-username').value.trim();
    const password = document.getElementById('auth-password').value.trim();
    const confirmPassword = document.getElementById('auth-confirm-password').value.trim();

    if (!username || !password) {
        authError.textContent = 'Username and Password are required.';
        authError.classList.remove('hidden');
        return;
    }

    if (isLogin) {
        // Login logic
        const user = users.find(user => user.username === username && user.password === password);

        if (user) {
            currentUser = username;
            loadFollowing();
            document.getElementById('user-username').textContent = username;
            document.getElementById('auth-form').classList.add('hidden');
            document.getElementById('user-dashboard').classList.remove('hidden');
            document.getElementById('feed').classList.remove('hidden');
            document.getElementById('logout-btn').classList.remove('hidden');
            displayPosts();
            authError.classList.add('hidden');
        } else {
            authError.textContent = 'Invalid username or password';
            authError.classList.remove('hidden');
        }
    } else {
        // Registration logic
        if (users.some(user => user.username === username)) {
            authError.textContent = 'Username already exists';
            authError.classList.remove('hidden');
            return;
        }

        if (password !== confirmPassword) {
            authError.textContent = 'Passwords do not match';
            authError.classList.remove('hidden');
            return;
        }

        // Save the new user
        users.push({ username: username, password: password });
        localStorage.setItem('users', JSON.stringify(users));

        // Automatically switch to login after registration
        authTitle.textContent = 'Login';
        authBtn.textContent = 'Login';
        confirmPasswordInput.classList.add('hidden');
        authToggleText.innerHTML = 'New user? <a href="#">Register here</a>';
        isLogin = true;

        authError.textContent = 'Registration successful! Please log in.';
        authError.classList.remove('hidden');
    }
});

// Load following for the current user
function loadFollowing() {
    const userFollowing = JSON.parse(localStorage.getItem(`following_${currentUser}`)) || [];
    userFollowing.forEach(user => following.add(user));
}

// Display Following List
function displayFollowing() {
    const followingList = document.getElementById('following-list');
    followingList.innerHTML = '';

    following.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user;
        followingList.appendChild(li);
    });
}

// Post Functionality
document.getElementById('post-btn').addEventListener('click', function() {
    const postContent = document.getElementById('post-content').value.trim();
    const mediaInput = document.getElementById('media-input');
    const mediaFile = mediaInput.files[0];

    if (postContent || mediaFile) {
        const post = {
            content: postContent,
            user: currentUser,
            media: mediaFile ? URL.createObjectURL(mediaFile) : null,
            mediaType: mediaFile ? mediaFile.type : null,
            reactions: {
                likes: [],
                dislikes: [],
                laughs: [],
                cries: []
            },
            comments: []
        };
        posts.push(post);
        localStorage.setItem('posts', JSON.stringify(posts));
        displayPosts();

        document.getElementById('post-content').value = '';
        mediaInput.value = '';
        document.getElementById('post-error').classList.add('hidden');
    } else {
        document.getElementById('post-error').classList.remove('hidden');
    }
});

// Display Posts Functionality
function displayPosts() {
    const postList = document.getElementById('post-list');
    postList.innerHTML = '';

    posts.forEach((post, index) => {
        if (following.has(post.user) || post.user === currentUser) {
            const li = document.createElement('li');
            let mediaHTML = '';

            if (post.media) {
                if (post.mediaType.startsWith('image/')) {
                    mediaHTML = `<img src="${post.media}" style="max-width: 100%; height: auto;" />`;
                } else if (post.mediaType.startsWith('video/')) {
                    mediaHTML = `<video controls style="max-width: 100%; height: auto;"><source src="${post.media}" type="${post.mediaType}">Your browser does not support the video tag.</video>`;
                }
            }

            li.innerHTML = `
                <p>${post.content}</p>
                ${mediaHTML}
                <p>Posted by: ${post.user}</p>
                <div class="reaction-buttons">
                    <button class="like-btn" data-index="${index}">❤️</button>
                    <button class="dislike-btn" data-index="${index}">💔</button>
                    <button class="laugh-btn" data-index="${index}">😂</button>
                    <button class="cry-btn" data-index="${index}">😭</button>
                </div>
                <div>
                    <span class="like-count">${post.reactions.likes.length}</span> Likes
                    <span class="dislike-count">${post.reactions.dislikes.length}</span> Dislikes
                    <span class="laugh-count">${post.reactions.laughs.length}</span> Laughs
                    <span class="cry-count">${post.reactions.cries.length}</span> Cries
                </div>
                <div class="comments-section">
                    <h4>Comments</h4>
                    <ul class="comment-list">
                        ${post.comments.map(comment => `<li>${comment.user}: ${comment.text}</li>`).join('')}
                    </ul>
                    <textarea class="comment-input" placeholder="Write a comment..."></textarea>
                    <button class="comment-btn" data-index="${index}">Comment</button>
                </div>
            `;
            postList.appendChild(li);
        }
    });

    // Add event listeners for reactions
    document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', function() {
            reactToPost(this.dataset.index, 'likes');
        });
    });

    document.querySelectorAll('.dislike-btn').forEach(button => {
        button.addEventListener('click', function() {
            reactToPost(this.dataset.index, 'dislikes');
        });
    });

    document.querySelectorAll('.laugh-btn').forEach(button => {
        button.addEventListener('click', function() {
            reactToPost(this.dataset.index, 'laughs');
        });
    });

    document.querySelectorAll('.cry-btn').forEach(button => {
        button.addEventListener('click', function() {
            reactToPost(this.dataset.index, 'cries');
        });
    });

    // Add event listeners for comments
    document.querySelectorAll('.comment-btn').forEach(button => {
        button.addEventListener('click', function() {
            addCommentToPost(this.dataset.index);
        });
    });
}

// Reaction to post functionality
function reactToPost(postIndex, reactionType) {
    const post = posts[postIndex];

    // Ensure the current user can react only once per post
    const otherReactions = ['likes', 'dislikes', 'laughs', 'cries'].filter(type => type !== reactionType);

    if (!post.reactions[reactionType].includes(currentUser)) {
        // Remove the user from any other reaction they may have given
        otherReactions.forEach(reaction => {
            const userIndex = post.reactions[reaction].indexOf(currentUser);
            if (userIndex !== -1) {
                post.reactions[reaction].splice(userIndex, 1);
            }
        });

        // Add user reaction to the chosen type
        post.reactions[reactionType].push(currentUser);
        localStorage.setItem('posts', JSON.stringify(posts));
        displayPosts();
    }
}

// Add comment to post functionality
function addCommentToPost(postIndex) {
    const commentInput = document.querySelectorAll('.comment-input')[postIndex];
    const commentText = commentInput.value.trim();

    if (commentText) {
        posts[postIndex].comments.push({ user: currentUser, text: commentText });
        localStorage.setItem('posts', JSON.stringify(posts));
        displayPosts();
    }
}

// Follow User Functionality
document.getElementById('follow-btn').addEventListener('click', function() {
    const followUsername = document.getElementById('follow-username').value.trim();

    if (followUsername && users.some(user => user.username === followUsername) && followUsername !== currentUser && !following.has(followUsername)) {
        following.add(followUsername);
        localStorage.setItem(`following_${currentUser}`, JSON.stringify([...following]));
        displayFollowing();
        document.getElementById('follow-error').classList.add('hidden');
        document.getElementById('follow-username').value = '';
    } else {
        document.getElementById('follow-error').classList.remove('hidden');
    }
});

// Logout functionality
document.getElementById('logout-btn').addEventListener('click', function() {
    currentUser = null;
    document.getElementById('auth-form').classList.remove('hidden');
    document.getElementById('user-dashboard').classList.add('hidden');
    document.getElementById('feed').classList.add('hidden');
    document.getElementById('logout-btn').classList.add('hidden');
});
