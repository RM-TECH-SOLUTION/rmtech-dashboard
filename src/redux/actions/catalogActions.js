import api from "../../services/api";
import {
  /* ITEMS */
  GET_CATALOG_ITEMS_REQUEST,
  GET_CATALOG_ITEMS_SUCCESS,
  GET_CATALOG_ITEMS_FAILURE,
  CREATE_CATALOG_ITEM_REQUEST,
  CREATE_CATALOG_ITEM_SUCCESS,
  CREATE_CATALOG_ITEM_FAILURE,
  UPDATE_CATALOG_ITEM_REQUEST,
  UPDATE_CATALOG_ITEM_SUCCESS,
  UPDATE_CATALOG_ITEM_FAILURE,

  /* MODELS */
  GET_CATALOG_MODELS_REQUEST,
  GET_CATALOG_MODELS_SUCCESS,
  GET_CATALOG_MODELS_FAILURE,
  CREATE_CATALOG_MODEL_REQUEST,
  CREATE_CATALOG_MODEL_SUCCESS,
  CREATE_CATALOG_MODEL_FAILURE,
  DELETE_CATALOG_MODEL_REQUEST,
  DELETE_CATALOG_MODEL_SUCCESS,
  DELETE_CATALOG_MODEL_FAILURE,

  /* STATUS */
  UPDATE_CATALOG_ITEM_STATUS_REQUEST,
  UPDATE_CATALOG_ITEM_STATUS_SUCCESS,
  UPDATE_CATALOG_ITEM_STATUS_FAILURE,


  CREATE_ITEM_VARIENT_REQUEST,
  CREATE_ITEM_VARIENT_SUCCESS,
  CREATE_ITEM_VARIENT_FAILURE,

  GET_ITEMS_VARIANTS_REQUEST,
  GET_ITEMS_VARIANTS_SUCCESS,
  GET_ITEMS_VARIANTS_FAILURE,

  SET_GET_ITEMS_VARIANTS,

  DELETE_CATALOG_ITEMS_REQUEST,
  DELETE_CATALOG_ITEMS_SUCCESS,
  DELETE_CATALOG_ITEMS_FAILURE,

  UPDATE_ITEM_VARIANT_REQUEST,
  UPDATE_ITEM_VARIANT_SUCCESS,
  UPDATE_ITEM_VARIANT_FAILURE,

  SET_MERCHANT_STATUS
} from "../constants/actionTypes";

/* ======================================================
   ITEMS
====================================================== */


// catalogActions.js
export const setGetItemsVariantsResponse = (payload) => ({
  type: SET_GET_ITEMS_VARIANTS,
  payload,
});

/* GET ITEMS */
export const getCatalogItems = ({ catalogueModelId, merchantId }) => async (dispatch) => {
  dispatch({ type: GET_CATALOG_ITEMS_REQUEST });
  

  try {
    const res = await api.get(api.Urls.getCatalogueItems, {
      catalogueModelId,
      merchantId,
    });

    dispatch({
      type: GET_CATALOG_ITEMS_SUCCESS,
      payload: res.data || [],
    });

    return res;
  } catch (error) {
    dispatch({
      type: GET_CATALOG_ITEMS_FAILURE,
      error: error.message || "Failed to fetch items",
    });
  }
};

export const deleteCatalogueItem = ({ itemId, merchantId }) => async (dispatch) => {
    dispatch({ type: DELETE_CATALOG_ITEMS_REQUEST });

    console.log(itemId, merchantId,"itemId, merchantIdhhhhhh");
    
    try {
      const res = await api.post(api.Urls.deleteCatalogueItem, {
        itemId,
        merchantId,
      });

      if (!res?.success) {
        throw new Error(res?.message || "Delete failed");
      }

      dispatch({
        type: DELETE_CATALOG_ITEMS_SUCCESS,
        payload: itemId, // ✅ IMPORTANT
      });

      return res;
    } catch (error) {
      dispatch({
        type: DELETE_CATALOG_ITEMS_FAILURE,
        error: error.message || "Failed to delete item",
      });
      throw error;
    }
  };



/* CREATE ITEM */
export const createCatalogItem = (data) => async (dispatch) => {
  dispatch({ type: CREATE_CATALOG_ITEM_REQUEST });

  try {
    const res = await api.post(api.Urls.createCatalogueItem, data);

    dispatch({
      type: CREATE_CATALOG_ITEM_SUCCESS,
      payload: res,
    });

    return res;
  } catch (error) {
    dispatch({
      type: CREATE_CATALOG_ITEM_FAILURE,
      error: error.message || "Failed to create item",
    });
    throw error;
  }
};

export const createItemVariant = (data) => async (dispatch) => {
  dispatch({ type: CREATE_ITEM_VARIENT_REQUEST });
  console.log(data,"createCatalogItemkkkk");
  

  try {
    const res = await api.post(api.Urls.createItemVariant, data);

    // ✅ validate API response
    if (res?.success) {
      dispatch({
        type: CREATE_ITEM_VARIENT_SUCCESS,
        payload: res,
      });
      return res;
    } else {
      throw new Error(res?.message || "Failed to create item variant");
    }
  } catch (error) {
    dispatch({
      type: CREATE_ITEM_VARIENT_FAILURE,
      error:
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create item variant",
    });
    throw error;
  }
};

export const getItemVariants = ({ itemId, merchantId }) => async (dispatch) => {
  dispatch({ type: GET_ITEMS_VARIANTS_REQUEST });

  try {
    const res = await api.get(api.Urls.getItemVariants, {
      itemId,
      merchantId,
    });

    dispatch({
      type: GET_ITEMS_VARIANTS_SUCCESS,
      payload: res.data || [],
    });

    return res;
  } catch (error) {
    dispatch({
      type: GET_ITEMS_VARIANTS_FAILURE,
      error: error.message || "Failed to fetch items",
    });
  }
};

/* UPDATE ITEM */
export const updateCatalogItem = ({ id, data }) => async (dispatch) => {
  dispatch({ type: UPDATE_CATALOG_ITEM_REQUEST });

  try {
    const res = await api.post(api.Urls.updateCatalogItem, {
      id,
      ...data,
    });

    if (!res?.success) {
      throw new Error(res?.message || "Update failed");
    }

    dispatch({
      type: UPDATE_CATALOG_ITEM_SUCCESS,
      payload: res, // reducer expects payload.data
    });

    return res;
  } catch (error) {
    dispatch({
      type: UPDATE_CATALOG_ITEM_FAILURE,
      error:
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update item",
    });
    throw error;
  }
};

export const updateItemVariant = (data) => async (dispatch) => {
  dispatch({ type: UPDATE_ITEM_VARIANT_REQUEST });

  try {
    const res = await api.post(api.Urls.updateItemVariant, data);

    if (res?.success) {
      dispatch({
        type: UPDATE_ITEM_VARIANT_SUCCESS,
        payload: res.data,
      });
      return res;
    }

    throw new Error(res?.message || "Failed to update variant");
  } catch (error) {
    dispatch({
      type: UPDATE_ITEM_VARIANT_FAILURE,
      error: error.message,
    });
    throw error;
  }
};



/* UPDATE ITEM STATUS ONLY */
export const updateCatalogItemStatus =
  ({ id, status }) =>
  async (dispatch) => {
    dispatch({ type: UPDATE_CATALOG_ITEM_STATUS_REQUEST });

    try {
      const res = await api.post(api.Urls.updateCatalogueItemStatus, {
        id,
        status,
      });

      dispatch({
        type: UPDATE_CATALOG_ITEM_STATUS_SUCCESS,
        payload: { id, status },
      });

      return res;
    } catch (error) {
      dispatch({
        type: UPDATE_CATALOG_ITEM_STATUS_FAILURE,
        error: error.message || "Failed to update status",
      });
      throw error;
    }
  };


/* ======================================================
   MODELS
====================================================== */

/* GET MODELS */
export const getCatalogModels = (merchantId) => async (dispatch) => {
  dispatch({ type: GET_CATALOG_MODELS_REQUEST });

  try {
    const res = await api.get(api.Urls.getCatalogueModels,{merchantId});

    dispatch({
      type: GET_CATALOG_MODELS_SUCCESS,
      payload: res.data || [],
    });

    return res;
  } catch (error) {
    dispatch({
      type: GET_CATALOG_MODELS_FAILURE,
      error: error.message || "Failed to fetch models",
    });
  }
};

/* CREATE MODEL */
export const createCatalogModel = (data) => async (dispatch) => {
  dispatch({ type: CREATE_CATALOG_MODEL_REQUEST });

  try {
    const res = await api.post(api.Urls.createCatalogueModel, data);

    dispatch({
      type: CREATE_CATALOG_MODEL_SUCCESS,
      payload: res,
    });

    return res;
  } catch (error) {
    dispatch({
      type: CREATE_CATALOG_MODEL_FAILURE,
      error: error.message || "Failed to create model",
    });
    throw error;
  }
};

/* DELETE MODEL */
export const deleteCatalogModel = ({ id }) => async (dispatch) => {
  dispatch({ type: DELETE_CATALOG_MODEL_REQUEST });

  try {
    const res = await api.post(api.Urls.deleteCatalogueModel, { id });

    dispatch({
      type: DELETE_CATALOG_MODEL_SUCCESS,
      payload: id,
    });

    return res;
  } catch (error) {
    dispatch({
      type: DELETE_CATALOG_MODEL_FAILURE,
      error: error.message || "Failed to delete model",
    });
    throw error;
  }
};
