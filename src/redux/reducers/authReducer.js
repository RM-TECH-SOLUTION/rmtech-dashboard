// src/redux/reducers/authReducer.js
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILURE
} from '../constants/actionTypes';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  merchantId: localStorage.getItem('merchantId') || '1',
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('token'),
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
    case GET_PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('merchantId', action.payload.user.merchantId || '1');
      
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        merchantId: action.payload.user.merchantId || '1',
        isAuthenticated: true,
        error: null,
      };

    case LOGIN_FAILURE:
    case REGISTER_FAILURE:
    case GET_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
        isAuthenticated: false,
      };

    case REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };

    case GET_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
        error: null,
      };

    case LOGOUT:
      localStorage.clear();
      return {
        ...initialState,
        user: null,
        token: null,
        isAuthenticated: false,
      };

    default:
      return state;
  }
};

export default authReducer;