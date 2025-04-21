import Blog from '../models/blog.js' // ✅ ESM-style import

// GET: /api/blog/read
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 })
    res.json(blogs)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blogs', error: err.message })
  }
}

// POST: /api/blog/write
export const createBlog = async (req, res) => {
  try {
    const { title, content, author, image, category } = req.body
    if (!title || !content || !author || !image || !category) {
      return res.status(400).json({ message: 'Please fill all fields' })
    }

    const blog = new Blog({ title, content, author, image, category })
    const savedBlog = await blog.save()
    res.status(201).json(savedBlog)
  } catch (err) {
    res.status(500).json({ message: 'Error creating blog', error: err.message })
  }
}

// DELETE: /api/blog/delete/:id
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id)
    if (!blog) return res.status(404).json({ message: 'Blog not found' })
    res.json({ message: 'Blog deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Error deleting blog', error: err.message })
  }
}
