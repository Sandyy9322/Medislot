import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const apiurl = import.meta.env.VITE_BACKEND_URL;

const BlogDetail = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { blogId } = useParams();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        // Get all blogs and find the one we want
        const response = await axios.get(`${apiurl}/api/blog/read`);
        const blogs = response.data;
        
        // Find the blog with matching ID
        const foundBlog = blogs.find(blog => blog._id === blogId);
        
        if (foundBlog) {
          setBlog(foundBlog);
        } else {
          setError("Blog post not found");
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Failed to load blog. Please try again later.");
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-red-500 text-center">{error}</div>
        <div className="mt-4 text-center">
          <Link to="/blogs" className="text-blue-500 hover:text-blue-700">
            Return to blogs
          </Link>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">Blog not found</div>
        <div className="mt-4 text-center">
          <Link to="/blogs" className="text-blue-500 hover:text-blue-700">
            Return to blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/blogs" className="text-blue-500 hover:text-blue-700 flex items-center">
          ← Back to blogs
        </Link>
      </div>
      
      <article className="bg-white shadow-lg rounded-xl overflow-hidden p-6">
        <div className="mb-6">
          <span className="text-sm text-gray-500 uppercase">{blog.category}</span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">{blog.title}</h1>
          
          <div className="flex items-center mt-4 text-sm text-gray-600">
            <span>By {blog.author}</span>
            <span className="mx-2">•</span>
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {blog.image && (
          <div className="mb-8">
           <img
  src={blog.image}
  alt={blog.title}
  className="w-full h-64 rounded-lg object-cover"
/>

          </div>
        )}

        <div className="prose max-w-none">
          {/* Split content by paragraphs and render */}
          {blog.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;