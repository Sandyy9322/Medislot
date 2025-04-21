import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const apiurl = import.meta.env.VITE_BACKEND_URL;

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${apiurl}/api/blog/read`);
        setBlogs(response.data.reverse());
        setLoading(false);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleBlogClick = (blogId) => {
    navigate(`/blogs/${blogId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Latest Blogs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <div 
            key={blog._id} 
            className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            onClick={() => handleBlogClick(blog._id)}
          >
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col justify-between h-full">
              <div>
                <p className="text-sm text-gray-500 uppercase">{blog.category}</p>
                <h2 className="text-xl font-semibold text-gray-800 mt-1">{blog.title}</h2>
                <p className="text-gray-600 mt-2">
                  {blog.content.length > 150 ? blog.content.slice(0, 150) + "..." : blog.content}
                </p>
              </div>
              <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                <span>By {blog.author}</span>
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="mt-4">
                <span className="text-blue-500 hover:text-blue-700 text-sm">Read More</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;