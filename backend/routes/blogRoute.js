import express from 'express'
import * as blogController from '../controllers/blogController.js' // ✅ Correct way to import named exports
import authDoctor from '../middleware/authDoctor.js'

const router = express.Router()

// Public
router.get('/read', blogController.getAllBlogs)

// Protected
// router.post('/write', authDoctor, blogController.createBlog)

router.post('/write',  blogController.createBlog)
router.delete('/delete/:id', blogController.deleteBlog)

export default router
