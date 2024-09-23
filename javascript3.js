let currentUserUsername = null;

async function registerUser() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
        alert("Please fill in both fields!");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert("Failed to register: " + errorData.message);
            return;
        }

        const data = await response.json();
        currentUserUsername = data.username;
        document.getElementById("registration").style.display = "none";
        document.getElementById("feed").style.display = "block";
        loadFeed();
    } catch (error) {
        alert("Error: Failed to connect to the server.");
    }
}


async function createPost() {
    const content = document.getElementById("postContent").value;
    const imageUpload = document.getElementById("imageUpload").files[0];

    if (!content) {
        alert("Please enter some content before posting!");
        return;
    }

    const formData = new FormData();
    formData.append("content", content);
    formData.append("authorUsername", currentUserUsername);
    if (imageUpload) {
        formData.append("image", imageUpload);
    }

    try {
        const response = await fetch("http://localhost:5000/api/posts/create", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert("Failed to create post: " + errorData.message);
            return;
        }

        document.getElementById("postContent").value = ""; // Clear the textarea
        loadFeed();
    } catch (error) {
        alert("Error: Failed to connect to the server.");
    }
}


async function loadFeed() {
    try {
        const response = await fetch(http://localhost:5000/api/posts/feed/${currentUserUsername});

        if (!response.ok) {
            const errorData = await response.json();
            alert("Failed to load feed: " + errorData.message);
            return;
        }

        const posts = await response.json();
        const postsContainer = document.getElementById("posts");
        postsContainer.innerHTML = ""; // Clear existing posts

        posts.forEach((post) => {
            const postDiv = document.createElement("div");
            postDiv.className = "post";
            postDiv.innerHTML = `
                <strong>${post.authorUsername}:</strong> ${post.content}
                ${
                    post.imageUrl
                        ? <img src="${post.imageUrl}" class="post-image" onclick="openModal('${post.imageUrl}')"/>
                        : ""
                }
                <div class="reactions">
                    <button onclick="reactToPost('${post.id}', 'thumbsUp')">👍 (${post.reactions.thumbsUp})</button>
                    <button onclick="reactToPost('${post.id}', 'heart')">❤️ (${post.reactions.heart})</button>
                    <button onclick="reactToPost('${post.id}', 'laugh')">😂 (${post.reactions.laugh})</button>
                </div>
                <div class="comments">
                    <h4>Comments</h4>
                    <div class="comments-list">
                        ${post.comments.map(comment => <p><strong>${comment.username}:</strong> ${comment.text}</p>).join("")}
                    </div>
                    <input type="text" placeholder="Add a comment..." id="comment_${post.id}" />
                    <button onclick="addComment('${post.id}')">Comment</button>
                </div>
            `;
            postsContainer.appendChild(postDiv);
        });
    } catch (error) {
        alert("Error: Failed to connect to the server.");
    }
}


async function reactToPost(postId, reactionType) {
    try {
        const response = await fetch("http://localhost:5000/api/posts/react", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId, reactionType }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert("Failed to react: " + errorData.message);
            return;
        }

        loadFeed(); // Refresh feed to update reactions
    } catch (error) {
        alert("Error: Failed to connect to the server.");
    }
}

// Add a comment to a post
async function addComment(postId) {
    const commentInput = document.getElementById(comment_${postId});
    const commentText = commentInput.value;

    if (!commentText) {
        alert("Please enter a comment!");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/posts/comment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                postId,
                commentText,
                commenterUsername: currentUserUsername,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert("Failed to add comment: " + errorData.message);
            return;
        }

        commentInput.value = ""; // Clear the comment input
        loadFeed(); // Refresh feed to update comments
    } catch (error) {
        alert("Error: Failed to connect to the server.");
    }
}


function openModal(imageUrl) {
    const modal = document.getElementById("imageModal");
    const fullImage = document.getElementById("fullImage");
    fullImage.src = imageUrl;
    modal.style.display = "block";
}


function closeModal() {
    const modal = document.getElementById("imageModal");
    modal.style.display = "none";
}

// Follow a user
async function followUser() {
    const followUsername = document.getElementById("followUsername").value;

    if (!followUsername) {
        alert("Please enter a username to follow!");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/follow", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                followerUsername: currentUserUsername,
                followeeUsername: followUsername,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert("Failed to follow: " + errorData.message);
            return;
        }

        alert("Successfully followed " + followUsername);
    } catch (error) {
        alert("Error: Failed to connect to the server.");
    }
}


async function unfollowUser() {
    const unfollowUsername = document.getElementById("followUsername").value;

    if (!unfollowUsername) {
        alert("Please enter a username to unfollow!");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/unfollow", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                followerUsername: currentUserUsername,
                followeeUsername: unfollowUsername,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert("Failed to unfollow: " + errorData.message);
            return;
        }

        alert("Successfully unfollowed " + unfollowUsername);
    } catch (error) {
        alert("Error: Failed to connect to the server.");
    }
}
