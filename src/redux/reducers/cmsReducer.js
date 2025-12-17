import {
  FETCH_CMS_REQUEST,
  FETCH_CMS_SUCCESS,
  FETCH_CMS_FAILURE,
  ADD_CMS_REQUEST,
  ADD_CMS_SUCCESS,
  ADD_CMS_FAILURE,
  UPDATE_CMS_REQUEST,
  UPDATE_CMS_SUCCESS,
  UPDATE_CMS_FAILURE,
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
  GET_MERCHANT_REQUEST,
  GET_MERCHANT_SUCCESS,
  GET_MERCHANT_FAILURE,
  
} from "../constants/actionTypes";

const initialState = {
  data: [],        // all CMS models
  loading: false,
  error: null,
  addLoading: false,
  addError: null,
  lastUpdated: null,
  deleteData:null,
  deleteModelData:null,
  uploadCmsImageData:null,
  createMerchantData:null,
  loginMerchantData:null,
  merchantList:null
};


const cmsReducer = (state = initialState, action) => {
  switch (action.type) {
    // ---------------------------
    // FETCH CMS
    // ---------------------------
    case FETCH_CMS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_CMS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,  // Full CMS array from backend
        lastUpdated: new Date().toISOString(),
      };

    case FETCH_CMS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    // ---------------------------
    // ADD CMS
    // ---------------------------
    case ADD_CMS_REQUEST:
      return {
        ...state,
        addLoading: true,
        addError: null,
      };

    case ADD_CMS_SUCCESS:
      return {
        ...state,
        addLoading: false,
        // Append new item(s) if response contains data
        data: action.payload ? action.payload : state.data,
        lastUpdated: new Date().toISOString(),
      };

    case ADD_CMS_FAILURE:
      return {
        ...state,
        addLoading: false,
        addError: action.error,
      };

    // ---------------------------
    // UPDATE CMS
    // ---------------------------
    case UPDATE_CMS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case UPDATE_CMS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,  // Updated full data returned from backend
        lastUpdated: new Date().toISOString(),
      };
      

    case UPDATE_CMS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

      // 
      case DELETE_CMS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case DELETE_CMS_SUCCESS:
      return {
        ...state,
        loading: false,
        deleteData: action.payload, 
        lastUpdated: new Date().toISOString(),
      };
      

    case DELETE_CMS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

      // --------------

    case DELETE_MODEL_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case DELETE_MODEL_SUCCESS:
      return {
        ...state,
        loading: false,
        deleteModelData: action.payload, 
        lastUpdated: new Date().toISOString(),
      };
      
    case DELETE_MODEL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    // ------------
     case UPLOADCMSIMAGE_CMS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case UPLOADCMSIMAGE_CMS_SUCCESS:
      return {
        ...state,
        loading: false,
        uploadCmsImageData: action.payload,
        lastUpdated: new Date().toISOString(),
      };
      

    case UPLOADCMSIMAGE_CMS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

      // --------------

      case CREATE_MERCHANT_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case CREATE_MERCHANT_SUCCESS:
      return {
        ...state,
        loading: false,
        createMerchantData: action.payload,
        lastUpdated: new Date().toISOString(),
      };
      

    case CREATE_MERCHANT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

      // ----

    case MERCHANT_LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case MERCHANT_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        loginMerchantData: action.payload,
      };
      

    case MERCHANT_LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    
    // ------------
      case GET_MERCHANT_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_MERCHANT_SUCCESS:
      return {
        ...state,
        loading: false,
        merchantList: action.payload,
      };
      

    case GET_MERCHANT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    // ---------------------------
    default:
      return state;
  }
};

export default cmsReducer;
