// src/redux/reducers/postReducer.js
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

const initialState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  filters: {
    status: '',
    category: '',
    search: '',
  },
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_POSTS_REQUEST:
    case FETCH_POST_REQUEST:
    case CREATE_POST_REQUEST:
    case UPDATE_POST_REQUEST:
    case DELETE_POST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_POSTS_SUCCESS:
      return {
        ...state,
        loading: false,
        posts: action.payload.data || [],
        total: action.payload.total || 0,
        page: action.payload.page || 1,
        totalPages: action.payload.totalPages || 1,
      };

    case FETCH_POST_SUCCESS:
      return {
        ...state,
        loading: false,
        currentPost: action.payload,
      };

    case CREATE_POST_SUCCESS:
      return {
        ...state,
        loading: false,
        posts: [action.payload, ...state.posts],
        total: state.total + 1,
      };

    case UPDATE_POST_SUCCESS:
      return {
        ...state,
        loading: false,
        posts: state.posts.map(post =>
          post.id === action.payload.id ? action.payload : post
        ),
        currentPost: action.payload,
      };

    case DELETE_POST_SUCCESS:
      return {
        ...state,
        loading: false,
        posts: state.posts.filter(post => post.id !== action.payload),
        total: Math.max(0, state.total - 1),
      };

    case FETCH_POSTS_FAILURE:
    case FETCH_POST_FAILURE:
    case CREATE_POST_FAILURE:
    case UPDATE_POST_FAILURE:
    case DELETE_POST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    // Additional actions for filters and pagination
    case 'SET_POSTS_PAGE':
      return {
        ...state,
        page: action.page,
      };

    case 'SET_POSTS_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.filters },
        page: 1,
      };

    case 'CLEAR_CURRENT_POST':
      return {
        ...state,
        currentPost: null,
      };

    default:
      return state;
  }
};

export default postReducer;