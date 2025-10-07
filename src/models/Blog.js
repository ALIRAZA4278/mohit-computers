
import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Blog content is required']
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    default: 'Admin'
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Tech Guides', 'Reviews', 'News', 'Buying Guide'],
    default: 'Tech Guides'
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  tags: [{
    type: String,
    trim: true
  }],
  excerpt: {
    type: String,
    maxlength: [500, 'Excerpt cannot be more than 500 characters']
  },
  featuredImage: {
    type: String, // URL to the uploaded image (replaces 'image' field)
    default: ''
  },
  images: [{
    type: String // Array of image URLs for gallery
  }],
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate slug from title before saving
BlogSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);