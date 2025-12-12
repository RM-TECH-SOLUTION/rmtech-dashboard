import {
  FETCH_CMS_REQUEST,
  FETCH_CMS_SUCCESS,
  FETCH_CMS_FAILURE,
  ADD_CMS_REQUEST,
  ADD_CMS_SUCCESS,
  ADD_CMS_FAILURE,
  UPDATE_CMS_REQUEST,
  UPDATE_CMS_SUCCESS,
  UPDATE_CMS_FAILURE
} from "../constants/actionTypes";

const initialState = {
  data: [],        // all CMS models
  loading: false,
  error: null,
  addLoading: false,
  addError: null,
  lastUpdated: null,
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

    // ---------------------------
    default:
      return state;
  }
};

export default cmsReducer;
