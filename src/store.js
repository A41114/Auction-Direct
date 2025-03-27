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

const history = createBrowserHistory();

// Các reducer khác của bạn
const rootReducer = combineReducers({
  // Thêm router reducer vào cây trạng thái
  router: connectRouter(history),
  // Các reducer khác
});

const store = createStore(
  rootReducer,
  // Middleware và các cấu hình khác nếu cần
);

export default store;