
import {
  FETCH_CMS_REQUEST,
  FETCH_CMS_SUCCESS,
  FETCH_CMS_FAILURE,
  UPDATE_CMS_REQUEST,
  UPDATE_CMS_SUCCESS,
  UPDATE_CMS_FAILURE,
  ADD_CMS_FAILURE,
  ADD_CMS_REQUEST,
  ADD_CMS_SUCCESS
} from '../constants/actionTypes';
import api from '../../services/api';

export const fetchCMSData = (cmsName) => async (dispatch, getState) => {
  dispatch({ type: FETCH_CMS_REQUEST, cmsName });
  
  try {
    const response = await api.get(api.Urls.getCms, {
    merchantId: 1,
    modelSlug: "homepage",
    modelName: "Homepage"
    });
    console.log('CMS Response:', response);
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


export const updateCMSData = (cmsName, data) => async (dispatch, getState) => {
  dispatch({ type: UPDATE_CMS_REQUEST, cmsName });
  
  try {
    const merchantId = getState().auth.merchantId;
    const response = await api.post(api.Urls.updateCms, {
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


export const addCMSData = (cmsName, data) => async (dispatch, getState) => {
  dispatch({ type: ADD_CMS_REQUEST, cmsName });
  
  try {
    const merchantId = getState().auth.merchantId;
    const response = await api.post(api.Urls.updateCms, {
      merchantId,
      cmsName,
      ...data
    });
    
    if (response.success) {
      dispatch({
        type: ADD_CMS_SUCCESS,
        cmsName,
        payload: response.data,
      });
      return response.data;
    } else {
      dispatch({
        type: ADD_CMS_FAILURE,
        cmsName,
        error: response.message || 'Failed to update CMS data',
      });
      throw new Error(response.message || 'Failed to update CMS data');
    }
  } catch (error) {
    dispatch({
      type: ADD_CMS_FAILURE,
      cmsName,
      error: error.message || 'Network error',
    });
    throw error;
  }
};