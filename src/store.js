
// import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
// import { connectRouter } from 'connected-react-router';
// import { createBrowserHistory } from 'history';
// import authReducer from './authSlice'
// import storage from 'redux-persist/lib/storage'; // lưu vào localStorage
// import { persistStore, persistReducer } from 'redux-persist';
// import { createReduxHistoryContext } from 'redux-first-history'
// const history = createBrowserHistory();

// const persistConfig = {
//   key: 'root',
//   storage,
//   whitelist: ['auth'], // chỉ lưu reducer auth
// };
// // Các reducer khác của bạn
// const rootReducer = combineReducers({
//   // Thêm router reducer vào cây trạng thái
//   router: connectRouter(history),
//   // Các reducer khác
//   auth: authReducer, // ✅ đặt key là "auth"
// });

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// const store = createStore(
//   // rootReducer,
//   // Middleware và các cấu hình khác nếu cần
//   persistedReducer,
//   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// );

// export const persistor = persistStore(store);
// export default store;


////////////////////////////////////////////////////////////////////
import { createStore, applyMiddleware, compose } from 'redux';
import {thunk} from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { createReduxHistoryContext } from 'redux-first-history';
import { persistStore } from 'redux-persist';
import createRootReducer from './store/reducers/rootReducer';

export const browserHistory = createBrowserHistory();

const {
  createReduxHistory,
  routerMiddleware,
  routerReducer
} = createReduxHistoryContext({
  history: browserHistory,
  reduxTravelling: true,
  savePreviousLocations: true//=1
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  createRootReducer(routerReducer), // ✅ truyền đúng reducer
  composeEnhancers(applyMiddleware(routerMiddleware, thunk))
);

export const persistor = persistStore(store);
export const history = createReduxHistory(store); // ✅ phải gọi SAU createStore

export default store;
////////////////////////////////////////////////////////////////
// import { createStore, applyMiddleware, compose } from 'redux';
// import {thunk} from 'redux-thunk';
// import { createBrowserHistory } from 'history';
// import { createReduxHistoryContext } from 'redux-first-history';
// import { persistStore } from 'redux-persist';
// import createRootReducer from './store/reducers/rootReducer'; // ✅ là một HÀM

// // ✅ Khởi tạo history
// export const browserHistory = createBrowserHistory();

// // ✅ Tạo context từ redux-first-history
// const {
//   createReduxHistory,
//   routerMiddleware,
// } = createReduxHistoryContext({
//   history: browserHistory,
//   reduxTravelling: true,
//   savePreviousLocations: 1,
// });

// // ✅ Tạo root reducer (truyền history, không phải routerReducer)
// const rootReducer = createRootReducer(browserHistory);

// // ✅ Tạo store
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// const store = createStore(
//   rootReducer,
//   composeEnhancers(applyMiddleware(routerMiddleware, thunk))
// );

// // ✅ Export persistor & history
// export const persistor = persistStore(store);
// export const history = createReduxHistory(store);

// export default store;









