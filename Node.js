const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Cloudinary config
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECRET 
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'travel_journal',
    allowed_formats: ['jpg', 'png'],
  },
});

const upload = multer({ storage });

// Mongoose schema
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  location: String,
  imageUrl: String,
  isPublic: Boolean,
  createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);

// Routes
app.get('/posts', async (req, res) => {
  const posts = await Post.find({ isPublic: true }).sort({ createdAt: -1 });
  res.json(posts);
});

app.post('/posts', upload.single('image'), async (req, res) => {
  const { title, content, location, isPublic } = req.body;
  const imageUrl = req.file?.path;

  const post = new Post({ title, content, location, imageUrl, isPublic });
  await post.save();
  res.status(201).json(post);
});

app.put('/posts/:id', async (req, res) => {
  const { id } = req.params;
  const updatedPost = await Post.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updatedPost);
});

app.listen(5000, () => console.log('Server running on port 5000'));
