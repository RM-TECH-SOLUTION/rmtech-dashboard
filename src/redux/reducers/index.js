// src/redux/reducers/index.js
import { combineReducers } from 'redux';
import authReducer from './authReducer';
import cmsReducer from './cmsReducer';
import postReducer from './postReducer';
import mediaReducer from './mediaReducer';
import userReducer from './userReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  cms: cmsReducer,
  posts: postReducer,
  media: mediaReducer,
  users: userReducer,
});

export default rootReducer;