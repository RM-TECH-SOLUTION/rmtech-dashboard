import {
  // MODELS
  GET_CATALOG_MODELS_REQUEST,
  GET_CATALOG_MODELS_SUCCESS,
  GET_CATALOG_MODELS_FAILURE,

  CREATE_CATALOG_MODEL_REQUEST,
  CREATE_CATALOG_MODEL_SUCCESS,
  CREATE_CATALOG_MODEL_FAILURE,

  DELETE_CATALOG_MODEL_REQUEST,
  DELETE_CATALOG_MODEL_SUCCESS,
  DELETE_CATALOG_MODEL_FAILURE,

  // ITEMS
  GET_CATALOG_ITEMS_REQUEST,
  GET_CATALOG_ITEMS_SUCCESS,
  GET_CATALOG_ITEMS_FAILURE,

  CREATE_CATALOG_ITEM_REQUEST,
  CREATE_CATALOG_ITEM_SUCCESS,
  CREATE_CATALOG_ITEM_FAILURE,

  UPDATE_CATALOG_ITEM_REQUEST,
  UPDATE_CATALOG_ITEM_SUCCESS,
  UPDATE_CATALOG_ITEM_FAILURE,

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

const initialState = {
  models: [],
  items: [],
  loading: false,
  error: null,

  createItemVariantResponse:null,

  createModelData: null,
  deleteModelData: null,

  createItemData: null,
  updateItemData: null,
  updateItemStatusData: null,
  getItemsVariantsResponse:null,
  deleteCatalogItemData:null,
  updateItemVariantResponse:null
};

const catalogReducer = (state = initialState, action) => {
  switch (action.type) {
    /* ================= MODELS ================= */

    case GET_CATALOG_MODELS_REQUEST:
    case CREATE_CATALOG_MODEL_REQUEST:
    case DELETE_CATALOG_MODEL_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_CATALOG_MODELS_SUCCESS:
      return {
        ...state,
        loading: false,
        models: action.payload,
        error: null,
      };

    case CREATE_CATALOG_MODEL_SUCCESS:
      return {
        ...state,
        loading: false,
        createModelData: action.payload,
        error: null,
      };

    case DELETE_CATALOG_MODEL_SUCCESS:
      return {
        ...state,
        loading: false,
        deleteModelData: action.payload,
        models: state.models.filter((m) => m.id !== action.payload),
        error: null,
      };

    case GET_CATALOG_MODELS_FAILURE:
    case CREATE_CATALOG_MODEL_FAILURE:
    case DELETE_CATALOG_MODEL_FAILURE:
      return { ...state, loading: false, error: action.error };

    /* ================= ITEMS ================= */

    case GET_CATALOG_ITEMS_REQUEST:
    case CREATE_CATALOG_ITEM_REQUEST:
    case UPDATE_CATALOG_ITEM_REQUEST:
    case UPDATE_CATALOG_ITEM_STATUS_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_CATALOG_ITEMS_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
        error: null,
      };

    case CREATE_CATALOG_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        createItemData: action.payload,
        items: [...state.items, action.payload?.data].filter(Boolean),
        error: null,
      };

    case UPDATE_CATALOG_ITEM_SUCCESS:
  return {
    ...state,
    loading: false,
    updateItemData: action.payload,
    items: state.items.map((i) =>
      i.id === action.payload?.data?.id
        ? { ...i, ...action.payload.data }
        : i
    ),
    error: null,
  };


    case UPDATE_CATALOG_ITEM_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        updateItemStatusData: action.payload,
        items: state.items.map((i) =>
          i.id === action.payload.id
            ? { ...i, status: action.payload.status }
            : i
        ),
        error: null,
      };


    case GET_CATALOG_ITEMS_FAILURE:
    case CREATE_CATALOG_ITEM_FAILURE:
    case UPDATE_CATALOG_ITEM_FAILURE:
    case UPDATE_CATALOG_ITEM_STATUS_FAILURE:

      /* ================= ITEM VARIANTS ================= */

case CREATE_ITEM_VARIENT_REQUEST:
  return {
    ...state,
    loading: true,
    error: null,
    createItemVariantResponse: null,
  };

case CREATE_ITEM_VARIENT_SUCCESS:
  return {
    ...state,
    loading: false,
    createItemVariantResponse: action.payload,
    error: null,
  };

case CREATE_ITEM_VARIENT_FAILURE:
  return {
    ...state,
    loading: false,
    error: action.error,
    createItemVariantResponse: null,
  };

  // 

  case GET_ITEMS_VARIANTS_REQUEST:
  return {
    ...state,
    loading: true,
    error: null,
    getItemsVariantsResponse: null,
  };

case GET_ITEMS_VARIANTS_SUCCESS:
  return {
    ...state,
    loading: false,
    getItemsVariantsResponse: action.payload,
    error: null,
  };

case GET_ITEMS_VARIANTS_FAILURE:
  return {
    ...state,
    loading: false,
    error: action.error,
    getItemsVariantsResponse: null,
  };

  // 
  case SET_GET_ITEMS_VARIANTS:
  return {
    ...state,
    getItemsVariantsResponse: action.payload,
  };

  // 
  case DELETE_CATALOG_ITEMS_REQUEST:
  return {
    ...state,
    loading: true,
    error: null,
    deleteCatalogItemData: null,
  };

case DELETE_CATALOG_ITEMS_SUCCESS:
  return {
    ...state,
    loading: false,
    deleteCatalogItemData: action.payload,
    items: state.items.filter(
      (item) => item.id !== action.payload
    ),
    error: null,
  };


case DELETE_CATALOG_ITEMS_FAILURE:
  return {
    ...state,
    loading: false,
    error: action.error,
    deleteCatalogItemData: null,
  };

  // 
  case UPDATE_ITEM_VARIANT_REQUEST:
  return {
    ...state,
    loading: true,
    error: null,
  };

case UPDATE_ITEM_VARIANT_SUCCESS:
  return {
    ...state,
    loading: false,
    updateItemVariantResponse: action.payload,
    error: null,
  };

case UPDATE_ITEM_VARIANT_FAILURE:
  return {
    ...state,
    loading: false,
    error: action.error,
    updateItemVariantResponse: null,
  };


    default:
      return state;
  }
};

export default catalogReducer;
