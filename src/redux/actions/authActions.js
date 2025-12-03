
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
import api from '../../services/api';

// Login action
export const login = (credentials) => async (dispatch, getState) => {
  dispatch({ type: LOGIN_REQUEST });
  
  try {
    const response = await api.post('/auth.php', credentials);
    
    if (response.success) {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: response.data,
      });
      return response.data;
    } else {
      dispatch({
        type: LOGIN_FAILURE,
        error: response.message || 'Login failed',
      });
      throw new Error(response.message || 'Login failed');
    }
  } catch (error) {
    dispatch({
      type: LOGIN_FAILURE,
      error: error.message || 'Network error',
    });
    throw error;
  }
};

// Register action
export const register = (userData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  
  try {
    const response = await api.post('/auth.php?action=register', userData);
    
    if (response.success) {
      dispatch({ type: REGISTER_SUCCESS });
      return response.data;
    } else {
      dispatch({
        type: REGISTER_FAILURE,
        error: response.message || 'Registration failed',
      });
      throw new Error(response.message || 'Registration failed');
    }
  } catch (error) {
    dispatch({
      type: REGISTER_FAILURE,
      error: error.message || 'Network error',
    });
    throw error;
  }
};

// Logout action
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};

// Get profile action
export const getProfile = () => async (dispatch, getState) => {
  dispatch({ type: GET_PROFILE_REQUEST });
  
  try {
    const token = getState().auth.token;
    const response = await api.get('/auth.php?action=profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.success) {
      dispatch({
        type: GET_PROFILE_SUCCESS,
        payload: response.data,
      });
      return response.data;
    } else {
      dispatch({
        type: GET_PROFILE_FAILURE,
        error: response.message || 'Failed to fetch profile',
      });
      throw new Error(response.message || 'Failed to fetch profile');
    }
  } catch (error) {
    dispatch({
      type: GET_PROFILE_FAILURE,
      error: error.message || 'Network error',
    });
    throw error;
  }
};