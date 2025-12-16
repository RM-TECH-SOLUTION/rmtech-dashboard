
import {
  FETCH_CMS_REQUEST,
  FETCH_CMS_SUCCESS,
  FETCH_CMS_FAILURE,
  UPDATE_CMS_REQUEST,
  UPDATE_CMS_SUCCESS,
  UPDATE_CMS_FAILURE,
  ADD_CMS_FAILURE,
  ADD_CMS_REQUEST,
  ADD_CMS_SUCCESS,
  DELETE_CMS_REQUEST,
  DELETE_CMS_SUCCESS,
  DELETE_CMS_FAILURE,
  DELETE_MODEL_REQUEST,
  DELETE_MODEL_SUCCESS,
  DELETE_MODEL_FAILURE,
  UPLOADCMSIMAGE_CMS_REQUEST,
  UPLOADCMSIMAGE_CMS_SUCCESS,
  UPLOADCMSIMAGE_CMS_FAILURE,
  CREATE_MERCHANT_REQUEST,
  CREATE_MERCHANT_SUCCESS,
  CREATE_MERCHANT_FAILURE,
  MERCHANT_LOGIN_REQUEST,
  MERCHANT_LOGIN_SUCCESS,
  MERCHANT_LOGIN_FAILURE,
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



export const updateCMSData = (data) => async (dispatch) => {
  dispatch({ type: UPDATE_CMS_REQUEST });

  try {
    const merchantId = 1;

    const response = await api.post(api.Urls.updateCms, {
      merchantId,
      ...data,  // include the CMS fields to update
    });


    // API success check
    if (response?.success) {
      dispatch({
        type: UPDATE_CMS_SUCCESS,
        payload: response.data || [],   // backend should return updated CMS
      });
       dispatch(fetchCMSData())

      return response.data;
    } else {
      dispatch({
        type: UPDATE_CMS_FAILURE,
        error: response.message || "Failed to update CMS data",
      });

      throw new Error(response.message || "Failed to update CMS data");
    }
  } catch (error) {
    dispatch({
      type: UPDATE_CMS_FAILURE,
      error: error.message || "Network error",
    });

    throw error;
  }
};

export const createMerchant = (data) => async (dispatch) => {
  dispatch({ type: CREATE_MERCHANT_REQUEST });

  try {
    const response = await api.post(api.Urls.createMerchant, data);

    if (response?.success) {
      dispatch({
        type: CREATE_MERCHANT_SUCCESS,
        payload: response, // ✅ ONLY merchant data
      });

      return response;
    } else {
      dispatch({
        type: CREATE_MERCHANT_FAILURE,
        error: response.message || "Failed to create merchant",
      });
      throw new Error(response.message || "Failed to create merchant");
    }
  } catch (error) {
    dispatch({
      type: CREATE_MERCHANT_FAILURE,
      error: error.message || "Network error",
    });
    throw error;
  }
};

export const merchantLogin = (data) => async (dispatch) => {
  dispatch({ type: MERCHANT_LOGIN_REQUEST });

  try {
    const response = await api.post(api.Urls.merchantLogin, data);

    if (response?.success) {
      dispatch({
        type: MERCHANT_LOGIN_SUCCESS,
        payload: response,
      });

      return response; // ✅ resolve success
    } else {
      dispatch({
        type: MERCHANT_LOGIN_FAILURE,
        error: response.message || "Merchant not found",
      });
      alert(response.message)

      return response; // ✅ RETURN, DO NOT THROW
    }
  } catch (error) {
    dispatch({
      type: MERCHANT_LOGIN_FAILURE,
      error: error.message || "Network error",
    });

    return {
      success: false,
      message: error.message || "Network error",
    };
  }
};




export const uploadCmsImage = (formData) => async (dispatch) => {
  dispatch({ type: UPLOADCMSIMAGE_CMS_REQUEST });

  try {
    const res = await fetch(
  "https://api.rmtechsolution.com/uploadCmsImage.php",
  {
    method: "POST",
    body: formData,
  }
);

    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.message || "Image upload failed");
    }

    dispatch({
      type: UPLOADCMSIMAGE_CMS_SUCCESS,
      payload: json,
    });

    return json;
  } catch (error) {
    dispatch({
      type: UPLOADCMSIMAGE_CMS_FAILURE,
      error: error.message,
    });
    throw error;
  }
};


export const deleteCms = (data) => async (dispatch) => {
  dispatch({ type: DELETE_CMS_REQUEST });

  try {
    const response = await api.post(api.Urls.deleteCms, {
      ...data, 
    });

    console.log(response?.message,"deleteCmshhh");
    

    if (response?.success) {
      dispatch({
        type: DELETE_CMS_SUCCESS,
        payload: response || [],  
      });
       alert(response.message)
        dispatch(fetchCMSData())
      return response;
    } else {
      dispatch({
        type: DELETE_CMS_FAILURE,
        error: response.message || "Failed to update CMS data",
      });

      throw new Error(response.message || "Failed to update CMS data");
    }
  } catch (error) {
    dispatch({
      type: DELETE_CMS_FAILURE,
      error: error.message || "Network error",
    });

    throw error;
  }
};


export const deleteModel = (data) => async (dispatch) => {
  dispatch({ type: DELETE_MODEL_REQUEST });

  try {
    const response = await api.post(api.Urls.deleteModel, {
      ...data, 
    });

    console.log(response,"deleteModel response");
    

    if (response?.success) {
      dispatch({
        type: DELETE_MODEL_SUCCESS,
        payload: response || [],  
      });
      alert(response.message)
      dispatch(fetchCMSData())

      return response;
    } else {
      dispatch({
        type: DELETE_MODEL_FAILURE,
        error: response.message || "Failed to update CMS data",
      });

      throw new Error(response.message || "Failed to update CMS data");
    }
  } catch (error) {
    dispatch({
      type: DELETE_MODEL_FAILURE,
      error: error.message || "Network error",
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


