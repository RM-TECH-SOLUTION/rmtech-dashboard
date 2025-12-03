// src/redux/reducers/mediaReducer.js
import {
  FETCH_MEDIA_REQUEST,
  FETCH_MEDIA_SUCCESS,
  FETCH_MEDIA_FAILURE,
  UPLOAD_MEDIA_REQUEST,
  UPLOAD_MEDIA_SUCCESS,
  UPLOAD_MEDIA_FAILURE,
  DELETE_MEDIA_REQUEST,
  DELETE_MEDIA_SUCCESS,
  DELETE_MEDIA_FAILURE
} from '../constants/actionTypes';

const initialState = {
  media: [],
  loading: false,
  uploading: false,
  error: null,
  total: 0,
  filters: {
    type: '',
    search: '',
  },
};

const mediaReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_MEDIA_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_MEDIA_SUCCESS:
      return {
        ...state,
        loading: false,
        media: action.payload.data || [],
        total: action.payload.total || 0,
      };

    case FETCH_MEDIA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case UPLOAD_MEDIA_REQUEST:
      return {
        ...state,
        uploading: true,
        error: null,
      };

    case UPLOAD_MEDIA_SUCCESS:
      return {
        ...state,
        uploading: false,
        media: [action.payload, ...state.media],
        total: state.total + 1,
      };

    case UPLOAD_MEDIA_FAILURE:
      return {
        ...state,
        uploading: false,
        error: action.error,
      };

    case DELETE_MEDIA_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case DELETE_MEDIA_SUCCESS:
      return {
        ...state,
        loading: false,
        media: state.media.filter(item => item.id !== action.payload),
        total: Math.max(0, state.total - 1),
      };

    case DELETE_MEDIA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    default:
      return state;
  }
};

export default mediaReducer;