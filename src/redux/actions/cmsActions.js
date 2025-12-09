
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

export const fetchCMSData = () => async (dispatch) => {
  dispatch({ type: FETCH_CMS_REQUEST });

  try {
    const response = await api.get(api.Urls.getCms, { merchantId: 1 });

    console.log("API RAW RESPONSE:", response);

    // response IS ALREADY an array (your screenshot proves it)
    if (Array.isArray(response)) {
      dispatch({
        type: FETCH_CMS_SUCCESS,
        payload: response,  // store whole array
      });
      return response;
    } else {
      dispatch({
        type: FETCH_CMS_FAILURE,
        error: "Invalid CMS format",
      });
    }

  } catch (error) {
    dispatch({
      type: FETCH_CMS_FAILURE,
      error: error.message || "Network error",
    });
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


export const addCMSData = (data) => async (dispatch) => {
  console.log(data, "datadatadataggg");
  dispatch({ type: ADD_CMS_REQUEST });


  try {
    const response = await api.post(api.Urls.addCms, { data });
    console.log(response, "response add csms");


    if (response.success) {
      dispatch({
        type: ADD_CMS_SUCCESS,
        payload: response.data,
      });
      return response.data;
    } else {
      dispatch({
        type: ADD_CMS_FAILURE,
        error: response.message || "Failed to add CMS data",
      });
    }
  } catch (error) {
    dispatch({
      type: ADD_CMS_FAILURE,
      error: error.message || "Network error",
    });
  }
};


