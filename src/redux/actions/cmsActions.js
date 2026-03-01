
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
  CREATE_COUPON_REQUEST,
  CREATE_COUPON_SUCCESS,
  CREATE_COUPON_FAILURE,
  GET_COUPON_REQUEST,
  GET_COUPON_SUCCESS,
  GET_COUPON_FAILURE,
  DELETE_COUPON_REQUEST,
  DELETE_COUPON_SUCCESS,
  DELETE_COUPON_FAILURE,
  MERCHANT_LOGIN_REQUEST,
  MERCHANT_LOGIN_SUCCESS,
  MERCHANT_LOGIN_FAILURE,
  GET_MERCHANT_REQUEST,
  GET_MERCHANT_SUCCESS,
  GET_MERCHANT_FAILURE,
  UPDATE_MERCHANT_REQUEST,
  UPDATE_MERCHANT_SUCCESS,
  UPDATE_MERCHANT_FAILURE,
  SET_MERCHANT_STATUS,
  SAVE_LOYALTY_SETTINGS_REQUEST,
  SAVE_LOYALTY_SETTINGS_SUCCESS,
  SAVE_LOYALTY_SETTINGS_FAILURE,
  GET_LOYALTY_SETTINGS_REQUEST,
  GET_LOYALTY_SETTINGS_SUCCESS,
  GET_LOYALTY_SETTINGS_FAILURE,
} from '../constants/actionTypes';
import api from '../../services/api';


export const setMerchantStatus = (payload) => ({
  type: SET_MERCHANT_STATUS,
  payload,
});

export const fetchCMSData = (merchantId = null) => async (dispatch) => {
  dispatch({ type: FETCH_CMS_REQUEST });

  try {
    const payload = merchantId ? { merchantId } : {};

    const response = await api.get(api.Urls.getCms, payload);

    if (Array.isArray(response)) {
      dispatch({
        type: FETCH_CMS_SUCCESS,
        payload: response,
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
    const response = await api.post(api.Urls.updateCms, {
      ...data, 
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
        payload: response,
      });

      return response; // ✅ success
    } else {
      dispatch({
        type: CREATE_MERCHANT_FAILURE,
        error: response.message || "Failed to create merchant",
      });

      return {
        success: false,
        message: response.message || "Failed to create merchant",
      }; // ✅ RETURN, NOT THROW
    }
  } catch (error) {
    dispatch({
      type: CREATE_MERCHANT_FAILURE,
      error: error.message || "Network error",
    });

    return {
      success: false,
      message: error.message || "Network error",
    }; // ✅ RETURN
  }
};

export const createCoupon = (data) => async (dispatch) => {
  dispatch({ type: CREATE_COUPON_REQUEST });

  try {
    const response = await api.post(
      api.Urls.createCoupon,
      data   // ✅ send full coupon data
    );

    if (response?.success) {
      dispatch({
        type: CREATE_COUPON_SUCCESS,
        payload: response,
      });

      return response;
    } else {
      dispatch({
        type: CREATE_COUPON_FAILURE,
        error: response.message || "Failed to create coupon",
      });

      return response;
    }
  } catch (error) {
    dispatch({
      type: CREATE_COUPON_FAILURE,
      error: error.message || "Network error",
    });

    return {
      success: false,
      message: error.message || "Network error",
    };
  }
};

export const getCoupon = (merchantId) => async (dispatch) => {
  dispatch({ type: GET_COUPON_REQUEST });

  try {
    const response = await api.get( api.Urls.getCoupon,
     { merchantId }
    );

    if (response?.success) {
      dispatch({
        type: GET_COUPON_SUCCESS,
        payload: response.data, // only coupon array
      });

      return response;
    } else {
      dispatch({
        type: GET_COUPON_FAILURE,
        error: response.message || "Failed to fetch coupons",
      });

      return response;
    }
  } catch (error) {
    dispatch({
      type: GET_COUPON_FAILURE,
      error: error.message || "Network error",
    });

    return {
      success: false,
      message: error.message || "Network error",
    };
  }
};

export const deleteCoupon = (id) => async (dispatch) => {
  dispatch({ type: DELETE_COUPON_REQUEST });

  try {
    const response = await api.post(
      api.Urls.deleteCoupon,
      { id }
    );

    if (response?.success) {
      dispatch({
        type: DELETE_COUPON_SUCCESS,
        payload: id, // return deleted id
      });

      return response;
    } else {
      dispatch({
        type: DELETE_COUPON_FAILURE,
        error: response.message || "Failed to delete coupon",
      });

      return response;
    }
  } catch (error) {
    dispatch({
      type: DELETE_COUPON_FAILURE,
      error: error.message || "Network error",
    });

    return {
      success: false,
      message: error.message || "Network error",
    };
  }
};

export const updateMerchantStatus = ({ merchantId, status }) => async (dispatch) => {
  dispatch({ type: UPDATE_MERCHANT_REQUEST });

  try {
    const response = await api.post(
      api.Urls.updateMerchantStatus,
      { merchantId, status } 
    );

    if (response?.success) {
      dispatch({
        type: UPDATE_MERCHANT_SUCCESS,
        payload: response,
      });

      return response;
    } else {
      dispatch({
        type: UPDATE_MERCHANT_FAILURE,
        error: response.message || "Failed to update merchant",
      });

      return {
        success: false,
        message: response.message || "Failed to update merchant",
      };
    }
  } catch (error) {
    dispatch({
      type: UPDATE_MERCHANT_FAILURE,
      error: error.message || "Network error",
    });

    return {
      success: false,
      message: error.message || "Network error",
    };
  }
};

export const getLoyaltySettings = (merchantId) => async (dispatch) => {
  dispatch({ type: GET_LOYALTY_SETTINGS_REQUEST });

  try {
    const response = await api.get(
      `${api.Urls.getLoyaltySettings}?merchant_id=${merchantId}`
    );

    if (response?.success) {
      dispatch({
        type: GET_LOYALTY_SETTINGS_SUCCESS,
        payload: response.settings,
      });

      return response;
    } else {
      dispatch({
        type: GET_LOYALTY_SETTINGS_FAILURE,
        error: response.message,
      });

      return response;
    }
  } catch (error) {
    dispatch({
      type: GET_LOYALTY_SETTINGS_FAILURE,
      error: error.message,
    });

    return { success: false, message: error.message };
  }
};

export const saveLoyaltySettings = (data) => async (dispatch) => {
  dispatch({ type: SAVE_LOYALTY_SETTINGS_REQUEST });

  try {
    const response = await api.post(
      api.Urls.saveLoyaltySettings,
      data
    );

    if (response?.success) {
      dispatch({
        type: SAVE_LOYALTY_SETTINGS_SUCCESS,
        payload: response,
      });

      return response;
    } else {
      dispatch({
        type: SAVE_LOYALTY_SETTINGS_FAILURE,
        error: response.message,
      });

      return response;
    }
  } catch (error) {
    dispatch({
      type: SAVE_LOYALTY_SETTINGS_FAILURE,
      error: error.message,
    });

    return { success: false, message: error.message };
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

export const getMerchant = (merchantId = null) => async (dispatch) => {
  dispatch({ type: GET_MERCHANT_REQUEST });

  try {
    // ✅ Build query dynamically
    const url = merchantId
      ? `${api.Urls.getMerchant}?merchantId=${merchantId}`
      : api.Urls.getMerchant;

    const response = await api.get(url);

    if (response?.success) {
      dispatch({
        type: GET_MERCHANT_SUCCESS,
        payload: response.data, // ✅ ONLY DATA
      });

      return response;
    } else {
      dispatch({
        type: GET_MERCHANT_FAILURE,
        error: response?.message || "Merchant not found",
      });

      return response;
    }
  } catch (error) {
    dispatch({
      type: GET_MERCHANT_FAILURE,
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


