// src/redux/actions/postActions.js
import {
  FETCH_POSTS_REQUEST,
  FETCH_POSTS_SUCCESS,
  FETCH_POSTS_FAILURE,
  FETCH_POST_REQUEST,
  FETCH_POST_SUCCESS,
  FETCH_POST_FAILURE,
  CREATE_POST_REQUEST,
  CREATE_POST_SUCCESS,
  CREATE_POST_FAILURE,
  UPDATE_POST_REQUEST,
  UPDATE_POST_SUCCESS,
  UPDATE_POST_FAILURE,
  DELETE_POST_REQUEST,
  DELETE_POST_SUCCESS,
  DELETE_POST_FAILURE
} from '../constants/actionTypes';
import api from '../../services/api';

// Fetch all posts
export const fetchPosts = (params = {}) => async (dispatch, getState) => {
  dispatch({ type: FETCH_POSTS_REQUEST });
  
  try {
    const merchantId = getState().auth.merchantId;
    const response = await api.get('/posts.php', {
      params: { merchantId, ...params }
    });
    
    if (response.success) {
      dispatch({
        type: FETCH_POSTS_SUCCESS,
        payload: response.data,
      });
      return response.data;
    } else {
      dispatch({
        type: FETCH_POSTS_FAILURE,
        error: response.message || 'Failed to fetch posts',
      });
      throw new Error(response.message || 'Failed to fetch posts');
    }
  } catch (error) {
    dispatch({
      type: FETCH_POSTS_FAILURE,
      error: error.message || 'Network error',
    });
    throw error;
  }
};

// Fetch single post by ID
export const fetchPostById = (id) => async (dispatch, getState) => {
  dispatch({ type: FETCH_POST_REQUEST });
  
  try {
    const merchantId = getState().auth.merchantId;
    const response = await api.get(`/posts.php?id=${id}`, {
      params: { merchantId }
    });
    
    if (response.success) {
      dispatch({
        type: FETCH_POST_SUCCESS,
        payload: response.data,
      });
      return response.data;
    } else {
      dispatch({
        type: FETCH_POST_FAILURE,
        error: response.message || 'Failed to fetch post',
      });
      throw new Error(response.message || 'Failed to fetch post');
    }
  } catch (error) {
    dispatch({
      type: FETCH_POST_FAILURE,
      error: error.message || 'Network error',
    });
    throw error;
  }
};

// Create new post
export const createPost = (postData) => async (dispatch, getState) => {
  dispatch({ type: CREATE_POST_REQUEST });
  
  try {
    const state = getState();
    const merchantId = state.auth.merchantId;
    const userId = state.auth.user?.id;
    
    const response = await api.post('/posts.php', {
      merchantId,
      authorId: userId,
      ...postData
    });
    
    if (response.success) {
      dispatch({
        type: CREATE_POST_SUCCESS,
        payload: response.data,
      });
      return response.data;
    } else {
      dispatch({
        type: CREATE_POST_FAILURE,
        error: response.message || 'Failed to create post',
      });
      throw new Error(response.message || 'Failed to create post');
    }
  } catch (error) {
    dispatch({
      type: CREATE_POST_FAILURE,
      error: error.message || 'Network error',
    });
    throw error;
  }
};

// Update post
export const updatePost = (id, postData) => async (dispatch, getState) => {
  dispatch({ type: UPDATE_POST_REQUEST });
  
  try {
    const merchantId = getState().auth.merchantId;
    const response = await api.put(`/posts.php?id=${id}`, {
      merchantId,
      ...postData
    });
    
    if (response.success) {
      dispatch({
        type: UPDATE_POST_SUCCESS,
        payload: response.data,
      });
      return response.data;
    } else {
      dispatch({
        type: UPDATE_POST_FAILURE,
        error: response.message || 'Failed to update post',
      });
      throw new Error(response.message || 'Failed to update post');
    }
  } catch (error) {
    dispatch({
      type: UPDATE_POST_FAILURE,
      error: error.message || 'Network error',
    });
    throw error;
  }
};

// Delete post
export const deletePost = (id) => async (dispatch, getState) => {
  dispatch({ type: DELETE_POST_REQUEST });
  
  try {
    const merchantId = getState().auth.merchantId;
    const response = await api.delete(`/posts.php?id=${id}`, {
      params: { merchantId }
    });
    
    if (response.success) {
      dispatch({
        type: DELETE_POST_SUCCESS,
        payload: id,
      });
      return response.data;
    } else {
      dispatch({
        type: DELETE_POST_FAILURE,
        error: response.message || 'Failed to delete post',
      });
      throw new Error(response.message || 'Failed to delete post');
    }
  } catch (error) {
    dispatch({
      type: DELETE_POST_FAILURE,
      error: error.message || 'Network error',
    });
    throw error;
  }
};

// Helper actions
export const setPostsPage = (page) => ({
  type: 'SET_POSTS_PAGE',
  page,
});

export const setPostsFilters = (filters) => ({
  type: 'SET_POSTS_FILTERS',
  filters,
});

export const clearCurrentPost = () => ({
  type: 'CLEAR_CURRENT_POST',
});