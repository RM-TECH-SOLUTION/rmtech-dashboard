
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useForm } from 'react-hook-form';
import { postsAPI } from '../Api/apiClient';
import 'react-quill/dist/quill.snow.css';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      // In real app, fetch from API
      const mockPost = {
        id,
        title: 'Getting Started with React CMS',
        excerpt: 'Learn how to build a modern CMS with React',
        content: '<p>This is a sample post content.</p>',
        category: 'technology',
        tags: 'react, cms, web',
        metaTitle: 'React CMS Guide',
        metaDescription: 'Complete guide to building CMS with React',
        slug: 'getting-started-react-cms',
        featuredImage: 'https://via.placeholder.com/800x400'
      };
      setPost(mockPost);
      setContent(mockPost.content);
      setFeaturedImage({ url: mockPost.featuredImage });
      
      // Set form values
      Object.keys(mockPost).forEach(key => {
        if (key !== 'content' && key !== 'featuredImage') {
          setValue(key, mockPost[key]);
        }
      });
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const postData = {
        ...data,
        content,
        updatedAt: new Date().toISOString()
      };
      
      await postsAPI.update(id, postData);
      alert('Post updated successfully!');
      navigate('/posts');
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  if (!post) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading post...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
        <p className="text-gray-600">Edit and update your post content</p>
      </div>

      {/* Similar form structure as CreatePost with pre-filled values */}
      {/* You can reuse most of CreatePost logic with edit mode */}
      {/* Add delete button */}
      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={() => navigate('/posts')}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={async () => {
              if (window.confirm('Are you sure you want to delete this post?')) {
                try {
                  await postsAPI.delete(id);
                  alert('Post deleted successfully!');
                  navigate('/posts');
                } catch (error) {
                  alert('Failed to delete post');
                }
              }
            }}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete Post
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Post'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPost;