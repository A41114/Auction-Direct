// import { createStore,combineReducers } from 'redux';
// // import rootReducer from './reducers'; // Giả sử bạn đã có rootReducer
// import { connectRouter } from 'connected-react-router';
// import { createBrowserHistory } from 'history';
// const history = createBrowserHistory();

// // Các reducer khác của bạn
// const rootReducer = combineReducers({
//   // Thêm router reducer vào cây trạng thái
//   router: connectRouter(history),
//   // Các reducer khác
// });
// const store = createStore(rootReducer);

// export default history;



import { createStore, combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import authReducer from './authSlice'
import storage from 'redux-persist/lib/storage'; // lưu vào localStorage
import { persistStore, persistReducer } from 'redux-persist';
const history = createBrowserHistory();

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // chỉ lưu reducer auth
};
// Các reducer khác của bạn
const rootReducer = combineReducers({
  // Thêm router reducer vào cây trạng thái
  router: connectRouter(history),
  // Các reducer khác
  auth: authReducer, // ✅ đặt key là "auth"
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  // rootReducer,
  // Middleware và các cấu hình khác nếu cần
  persistedReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export const persistor = persistStore(store);
export default store;
