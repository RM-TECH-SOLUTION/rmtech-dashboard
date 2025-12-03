// src/redux/reducers/cmsReducer.js
import {
  FETCH_CMS_REQUEST,
  FETCH_CMS_SUCCESS,
  FETCH_CMS_FAILURE,
  UPDATE_CMS_REQUEST,
  UPDATE_CMS_SUCCESS,
  UPDATE_CMS_FAILURE
} from '../constants/actionTypes';

const initialState = {
  data: {
    navbar: null,
    footer: null,
    home: null,
    about: null,
    contact: null,
    settings: null,
  },
  loading: {
    navbar: false,
    footer: false,
    home: false,
    about: false,
    contact: false,
    settings: false,
  },
  error: {
    navbar: null,
    footer: null,
    home: null,
    about: null,
    contact: null,
    settings: null,
  },
  lastUpdated: {},
};

const cmsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CMS_REQUEST:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.cmsName]: true,
        },
        error: {
          ...state.error,
          [action.cmsName]: null,
        },
      };

    case FETCH_CMS_SUCCESS:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.cmsName]: false,
        },
        data: {
          ...state.data,
          [action.cmsName]: action.payload,
        },
        lastUpdated: {
          ...state.lastUpdated,
          [action.cmsName]: new Date().toISOString(),
        },
      };

    case FETCH_CMS_FAILURE:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.cmsName]: false,
        },
        error: {
          ...state.error,
          [action.cmsName]: action.error,
        },
      };

    case UPDATE_CMS_REQUEST:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.cmsName]: true,
        },
        error: {
          ...state.error,
          [action.cmsName]: null,
        },
      };

    case UPDATE_CMS_SUCCESS:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.cmsName]: false,
        },
        data: {
          ...state.data,
          [action.cmsName]: action.payload,
        },
        lastUpdated: {
          ...state.lastUpdated,
          [action.cmsName]: new Date().toISOString(),
        },
      };

    case UPDATE_CMS_FAILURE:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.cmsName]: false,
        },
        error: {
          ...state.error,
          [action.cmsName]: action.error,
        },
      };

    default:
      return state;
  }
};

export default cmsReducer;