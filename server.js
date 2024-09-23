const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const uploadDir = path.join(__dirname, "public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, ${Date.now()}_${file.originalname});
  },
});
const upload = multer({ storage: storage });

const users = [];
const posts = [];


function findUserByUsername(username) {
  return users.find((user) => user.username === username);
}


app.post("/api/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const existingUser = findUserByUsername(username);
  if (existingUser) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const userId = user_${Date.now()};
  const newUser = {
    id: userId,
    username,
    password,
    following: [],
  };

  users.push(newUser);
  res.json(newUser);
});


app.post("/api/follow", (req, res) => {
  const { followerUsername, followeeUsername } = req.body;

  const follower = findUserByUsername(followerUsername);
  const followee = findUserByUsername(followeeUsername);

  if (!follower || !followee) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!follower.following.includes(followee.id)) {
    follower.following.push(followee.id);
  }

  res.json({ message: "Followed successfully" });
});

// Unfollow a user
app.post("/api/unfollow", (req, res) => {
  const { followerUsername, followeeUsername } = req.body;

  const follower = findUserByUsername(followerUsername);
  const followee = findUserByUsername(followeeUsername);

  if (!follower || !followee) {
    return res.status(404).json({ message: "User not found" });
  }

  follower.following = follower.following.filter((id) => id !== followee.id);

  res.json({ message: "Unfollowed successfully" });
});


app.post("/api/posts/create", upload.single("image"), (req, res) => {
  const { content, authorUsername } = req.body;
  const imageUrl = req.file ? /uploads/${req.file.filename} : null;

  if (!content || !authorUsername) {
    return res.status(400).json({ message: "Content and author username are required" });
  }

  const author = findUserByUsername(authorUsername);
  if (!author) {
    return res.status(404).json({ message: "Author not found" });
  }

  const newPost = {
    id: post_${Date.now()},
    content,
    authorId: author.id,
    authorUsername,
    imageUrl,
    createdAt: new Date(),
    reactions: {
      thumbsUp: 0,
      heart: 0,
      laugh: 0,
    },
    comments: [], // Initialize comments array
  };

  posts.push(newPost);
  res.json(newPost);
});


app.post("/api/posts/comment", (req, res) => {
  const { postId, commentText, commenterUsername } = req.body;
  const post = posts.find((p) => p.id === postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const commenter = findUserByUsername(commenterUsername);
  if (!commenter) {
    return res.status(404).json({ message: "Commenter not found" });
  }

  const newComment = {
    id: comment_${Date.now()},
    text: commentText,
    username: commenter.username,
    createdAt: new Date(),
  };

  post.comments.push(newComment);
  res.json(post);
});


app.get("/api/posts/feed/:username", (req, res) => {
  const { username } = req.params;
  const user = findUserByUsername(username);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const userFeed = posts.filter(
    (post) =>
      user.following.includes(post.authorId) || post.authorId === user.id
  );

  res.json(userFeed);
});


app.post("/api/posts/react", (req, res) => {
  const { postId, reactionType } = req.body;
  const post = posts.find((p) => p.id === postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (!["thumbsUp", "heart", "laugh"].includes(reactionType)) {
    return res.status(400).json({ message: "Invalid reaction type" });
  }

  post.reactions[reactionType]++;
  res.json(post);
});


app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
