// import { logger } from "redux-logger";

// import { routerMiddleware } from 'connected-react-router';
// import { createBrowserHistory } from 'history';

// import { createStore, applyMiddleware, compose } from 'redux';
// import { createStateSyncMiddleware } from 'redux-state-sync';
// import { persistStore } from 'redux-persist';

// import createRootReducer from './store/reducers/rootReducer';
// import actionTypes from './store/actions/actionTypes';

// const environment = process.env.NODE_ENV || "development";
// let isDevelopment = environment === "development";

// //hide redux logs
// isDevelopment = false;


// export const history = createBrowserHistory({ basename: process.env.REACT_APP_ROUTER_BASE_NAME });

// const reduxStateSyncConfig = {
//     whitelist: [
//         actionTypes.APP_START_UP_COMPLETE,
//     ]
// }

// const rootReducer = createRootReducer(history);
// const middleware = [
//     routerMiddleware(history),
 
//     createStateSyncMiddleware(reduxStateSyncConfig),
// ]
// if (isDevelopment) middleware.push(logger);

// const composeEnhancers = (isDevelopment && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;

// const reduxStore = createStore(
//     rootReducer,
//     composeEnhancers(applyMiddleware(...middleware)),
// )

// export const dispatch = reduxStore.dispatch;

// export const persistor = persistStore(reduxStore);

// export default reduxStore;



//////////////////////////Thay bằng redux-first-history
import { logger } from "redux-logger";

import { createBrowserHistory } from 'history';
import { createReduxHistoryContext } from 'redux-first-history'; // ✅ thay thế connected-react-router

import { createStore, applyMiddleware, compose } from 'redux';
import { createStateSyncMiddleware } from 'redux-state-sync';
import { persistStore } from 'redux-persist';

import createRootReducer from './store/reducers/rootReducer';
import actionTypes from './store/actions/actionTypes';

const environment = process.env.NODE_ENV || "development";
let isDevelopment = environment === "development";

// ⛔ Tắt log redux nếu muốn
isDevelopment = false;

// ✅ Tạo browser history
export const history = createBrowserHistory({ basename: process.env.REACT_APP_ROUTER_BASE_NAME });

// ✅ Tạo redux-first-history context
const {
  createReduxHistory,
  routerMiddleware,
} = createReduxHistoryContext({
  history,
  reduxTravelling: true,
  savePreviousLocations: 1,
});

// ✅ Cấu hình redux-state-sync
const reduxStateSyncConfig = {
  whitelist: [actionTypes.APP_START_UP_COMPLETE]
};

// ✅ Tạo rootReducer (bên trong đã sử dụng createRouterReducer)
const rootReducer = createRootReducer(history);

// ✅ Cấu hình middleware
const middleware = [
  routerMiddleware, // ✅ từ redux-first-history
  createStateSyncMiddleware(reduxStateSyncConfig),
];
if (isDevelopment) middleware.push(logger);

// ✅ Cấu hình DevTools
const composeEnhancers =
  (isDevelopment && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

// ✅ Tạo redux store
const reduxStore = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middleware))
);

// ✅ Persistor
export const persistor = persistStore(reduxStore);

// ✅ Thay vì dùng history cho router, dùng cái này:
export const reduxHistory = createReduxHistory(reduxStore); // dùng trong <HistoryRouter history={reduxHistory}>

export const dispatch = reduxStore.dispatch;
export default reduxStore;
