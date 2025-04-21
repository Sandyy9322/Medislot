"use client"

import { useState, useEffect } from "react"
import { Loader2, Trash } from "lucide-react"
import { useToast } from "../../components/ui/useToast"

function BlogManagement() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("add")
  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
    author: "",
    image: "",
    category: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    setLoading(true)
    try {
      const API_URL = import.meta.env.VITE_BACKEND_URL
      const response = await fetch(`${API_URL}/api/blog/read`)
      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json()
      setBlogs(data)
    } catch (error) {
      console.error("Error fetching blogs:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch blogs. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const addBlog = async () => {
    // Validate form
    if (!newBlog.title || !newBlog.content || !newBlog.author || !newBlog.image || !newBlog.category) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill all fields",
      })
      return
    }

    setSubmitting(true)
    try {
      const API_URL = import.meta.env.VITE_BACKEND_URL
      const token = localStorage.getItem("token")

      const response = await fetch(`${API_URL}/api/blog/write`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBlog),
      })

      if (!response.ok) {
        throw new Error("Failed to add blog")
      }

      const data = await response.json()
      setBlogs([data, ...blogs])
      setNewBlog({ title: "", content: "", author: "", image: "", category: "" })

      toast({
        title: "Success",
        description: "Blog post added successfully",
      })
    } catch (error) {
      console.error("Error adding blog:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add blog. Please try again.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const deleteBlog = async (id) => {
    try {
      const API_URL = import.meta.env.VITE_BACKEND_URL
      const token = localStorage.getItem("token")

      const response = await fetch(`${API_URL}/api/blog/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete blog")
      }

      setBlogs(blogs.filter((blog) => blog._id !== id))

      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting blog:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete blog. Please try again.",
      })
    }
  }

  return (
    <div className="min-h-screen pt-10 bg-[#f9faff] pl-16">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-6">Blog Management</h2>

        <div className="w-full border-b">
          <div className="flex w-full">
            <button
              className={`px-6 py-3 text-base font-medium ${
                activeTab === "add" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"
              }`}
              onClick={() => setActiveTab("add")}
            >
              Add New Blog
            </button>
            <button
              className={`px-6 py-3 text-base font-medium ${
                activeTab === "manage" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"
              }`}
              onClick={() => setActiveTab("manage")}
            >
              Manage Blogs
            </button>
          </div>
        </div>

        <div className="mt-6">
          {activeTab === "add" && (
            <div>
              <h3 className="text-xl font-medium mb-6">Create New Blog Post</h3>
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    id="title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Blog Title"
                    value={newBlog.title}
                    onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    id="content"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[150px]"
                    placeholder="Blog Content"
                    value={newBlog.content}
                    onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                      Author
                    </label>
                    <input
                      id="author"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Author Name"
                      value={newBlog.author}
                      onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      id="category"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white"
                      value={newBlog.category}
                      onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                      required
                    >
                      <option value="">Select category</option>
                      <option value="Health_Tips">Health Tips</option>
                      <option value="Disease_Awareness">Disease Awareness</option>
                      <option value="Nutrition_Diet">Nutrition & Diet</option>
                      <option value="Mental_Health">Mental Health</option>
                      <option value="Skin_Hair_Care">Skin & Hair Care</option>
                      <option value="Technology_in_Healthcare">Technology in Healthcare</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    id="image"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Image URL"
                    value={newBlog.image}
                    onChange={(e) => setNewBlog({ ...newBlog, image: e.target.value })}
                    required
                  />
                </div>

                <div className="pt-4">
                  <button
                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={addBlog}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
                        Adding Blog...
                      </>
                    ) : (
                      "Add Blog"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "manage" && (
            <div>
              <h3 className="text-xl font-medium mb-6">Manage Existing Blogs</h3>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : blogs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No blogs found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {blogs.map((blog) => (
                    <div key={blog._id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <div className="h-16 w-16 overflow-hidden rounded-md">
                            <img
                              src={blog.image || "/placeholder.svg?height=64&width=64"}
                              alt={blog.title}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.src = "/placeholder.svg?height=64&width=64"
                              }}
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">{blog.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-1">{blog.content}</p>
                            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                              <span>By {blog.author}</span>
                              <span>•</span>
                              <span>Category: {blog.category}</span>
                              
                             
                            </div>
                          </div>
                        </div>
                        <button
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                          onClick={() => deleteBlog(blog._id)}
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BlogManagement