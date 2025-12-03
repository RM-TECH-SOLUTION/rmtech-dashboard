
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useForm } from 'react-hook-form';
import { postsAPI } from '../Api/apiClient';

const CreatePost = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('draft');

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const postData = {
        ...data,
        content,
        status,
        featuredImage: featuredImage?.url || '',
        createdAt: new Date().toISOString(),
        author: JSON.parse(localStorage.getItem('user'))?.name || 'Admin'
      };
      
      await postsAPI.create(postData);
      alert('Post created successfully!');
      navigate('/posts');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // In real implementation, upload to cloud storage
      const reader = new FileReader();
      reader.onloadend = () => {
        setFeaturedImage({
          file,
          url: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
        <p className="text-gray-600">Create and publish new content for your website</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Post Title */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Post Title *
          </label>
          <input
            type="text"
            {...register('title', { required: 'Title is required' })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter post title"
          />
          {errors.title && (
            <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Content Editor */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Content *
          </label>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={quillModules}
            className="h-96 mb-12"
          />
          {!content && (
            <p className="mt-2 text-sm text-red-600">Content is required</p>
          )}
        </div>

        {/* Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Excerpt */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Excerpt
              </label>
              <textarea
                {...register('excerpt')}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Short description of the post"
              />
            </div>

            {/* SEO Fields */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    {...register('metaTitle')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    {...register('metaDescription')}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug
                  </label>
                  <input
                    type="text"
                    {...register('slug')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="url-friendly-slug"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-8">
            {/* Status & Actions */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Publish</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/posts')}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create Post'}
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Featured Image</h3>
              <div className="space-y-4">
                {featuredImage ? (
                  <div className="relative">
                    <img
                      src={featuredImage.url}
                      alt="Featured"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setFeaturedImage(null)}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="block">
                    <div className="flex items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                      <div className="text-center">
                        <div className="text-gray-400 mb-2">Click to upload image</div>
                        <div className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</div>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Categories & Tags */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Categories & Tags</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categories
                  </label>
                  <select
                    {...register('category')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="">Select category</option>
                    <option value="technology">Technology</option>
                    <option value="business">Business</option>
                    <option value="design">Design</option>
                    <option value="development">Development</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    {...register('tags')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="react, javascript, web"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;