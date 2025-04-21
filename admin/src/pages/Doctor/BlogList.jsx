"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

function BlogList() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const API_URL = process.env.VITE_BACKEND_URL
        const response = await fetch(`${API_URL}/api/blog/read`)
        const data = await response.json()
        setBlogs(data.reverse())
        setLoading(false)
      } catch (err) {
        console.error(err)
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {blogs.map((blog) => (
        <div key={blog._id} className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={blog.image || "/placeholder.svg?height=200&width=400"}
              alt={blog.title}
              className="h-full w-full object-cover transition-transform hover:scale-105"
              onError={(e) => {
                e.target.src = "/placeholder.svg?height=200&width=400"
              }}
            />
          </div>
          <div className="p-4">
            <div className="mb-2">
              <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {blog.category}
              </span>
            </div>
            <h3 className="text-xl font-bold">{blog.title}</h3>
            <p className="mt-2 line-clamp-3 text-muted-foreground">{blog.content}</p>
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>By {blog.author}</span>
              <span>{new Date(blog.date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default BlogList
