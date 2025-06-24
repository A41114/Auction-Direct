// import {combineReducers} from 'redux';
// import { connectRouter } from 'connected-react-router';


// import appReducer from "./appReducer";
// import adminReducer from "./adminReducer";
// import userReducer from "./userReducer";

// import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
// import storage from 'redux-persist/lib/storage';
// import { persistReducer } from 'redux-persist';

// const persistCommonConfig = {
//     storage: storage,
//     stateReconciler: autoMergeLevel2,
// };

// const adminPersistConfig = {
//     ...persistCommonConfig,
//     key: 'admin',
//     whitelist: ['isLoggedIn', 'adminInfo']
// };

// export default (history) => combineReducers({
//     router: connectRouter(history),
//     admin: persistReducer(adminPersistConfig, adminReducer),
//     user: userReducer,
//     app: appReducer
// })


///////////////////////////////////////////////////////////////////

import { combineReducers } from 'redux';
import appReducer from './appReducer';
import adminReducer from './adminReducer';
import userReducer from './userReducer';
import authReducer from '../../authSlice';

import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { persistReducer } from 'redux-persist';
// import { createRouterReducer } from 'redux-first-history'; // ✅ cái này mới đúng

const persistCommonConfig = {
  storage,
  stateReconciler: autoMergeLevel2,
};

const adminPersistConfig = {
  ...persistCommonConfig,
  key: 'admin',
  whitelist: ['isLoggedIn', 'adminInfo'],
};

const authPersistConfig = {
  ...persistCommonConfig,
  key: 'auth',
  whitelist: ['token', 'userInfo'],
};

// ✅ createRootReducer TRẢ VỀ FUNCTION reducer (KHÔNG phải object)
const createRootReducer = (routerReducer) =>
    combineReducers({
      router: routerReducer, // ✅ truyền từ ngoài vào
      admin: persistReducer(adminPersistConfig, adminReducer),
      auth: persistReducer(authPersistConfig, authReducer),
      user: userReducer,
      app: appReducer,
    });
export default createRootReducer;












