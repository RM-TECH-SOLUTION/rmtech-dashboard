// src/redux/actions/cmsActions.js
import {
  FETCH_CMS_REQUEST,
  FETCH_CMS_SUCCESS,
  FETCH_CMS_FAILURE,
  UPDATE_CMS_REQUEST,
  UPDATE_CMS_SUCCESS,
  UPDATE_CMS_FAILURE
} from '../constants/actionTypes';
import api from '../../services/api';

// Fetch CMS data
export const fetchCMSData = (cmsName) => async (dispatch, getState) => {
  dispatch({ type: FETCH_CMS_REQUEST, cmsName });
  
  try {
    const merchantId = getState().auth.merchantId;
    const response = await api.get('/cms.php', {
      params: { merchantId, cmsName }
    });
    
    if (response.success) {
      dispatch({
        type: FETCH_CMS_SUCCESS,
        cmsName,
        payload: response.data,
      });
      return response.data;
    } else {
      dispatch({
        type: FETCH_CMS_FAILURE,
        cmsName,
        error: response.message || 'Failed to fetch CMS data',
      });
      throw new Error(response.message || 'Failed to fetch CMS data');
    }
  } catch (error) {
    dispatch({
      type: FETCH_CMS_FAILURE,
      cmsName,
      error: error.message || 'Network error',
    });
    throw error;
  }
};

// Update CMS data
export const updateCMSData = (cmsName, data) => async (dispatch, getState) => {
  dispatch({ type: UPDATE_CMS_REQUEST, cmsName });
  
  try {
    const merchantId = getState().auth.merchantId;
    const response = await api.post('/cms.php', {
      merchantId,
      cmsName,
      ...data
    });
    
    if (response.success) {
      dispatch({
        type: UPDATE_CMS_SUCCESS,
        cmsName,
        payload: response.data,
      });
      return response.data;
    } else {
      dispatch({
        type: UPDATE_CMS_FAILURE,
        cmsName,
        error: response.message || 'Failed to update CMS data',
      });
      throw new Error(response.message || 'Failed to update CMS data');
    }
  } catch (error) {
    dispatch({
      type: UPDATE_CMS_FAILURE,
      cmsName,
      error: error.message || 'Network error',
    });
    throw error;
  }
};