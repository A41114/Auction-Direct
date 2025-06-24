// import React, { Component, Fragment } from 'react';
// import { Route, Switch } from 'react-router-dom';
// import { ConnectedRouter as Router } from 'connected-react-router';
// import { Provider } from 'react-redux';
// import { Redirect } from 'react-router-dom';
// import store from './store';
// import {history} from './redux'
// import { connect } from 'react-redux';
// import WordToImg from './WordToImg';
// import Home from './containers/Home'
// import HomePage from './containers/HomePage';
// import Signup from './containers/Signup';
// import Login from './containers/Login';
// import UserDetails from './containers/UserDetails';


// class App extends Component {

//   handlePersistorState = () => {
//       const { persistor } = this.props;
//       if(persistor){
//       let { bootstrapped } = persistor.getState();
//       if (bootstrapped) {
//           if (this.props.onBeforeLift) {
//               Promise.resolve(this.props.onBeforeLift())
//                   .then(() => this.setState({ bootstrapped: true }))
//                   .catch(() => this.setState({ bootstrapped: true }));
//           } else {
//               this.setState({ bootstrapped: true });
//           }
//       }
//       }
//   };

//   componentDidMount() {
//       this.handlePersistorState();
//   }
  
//   render() {
//       return (
//           <Fragment>
//             <Provider store={store}>
//               <Router history={history}>
//                   <div className="main-container">
//                       <span className="content-container">
//                           <Switch>
//                               <Route path={'/'} exact component={HomePage} /> 
//                               <Route path={'/signup'} exact component={Signup} />  
//                               <Route path={'/Login'} exact component={Login} />  
//                               <Route path={'/UserDetails'} exact component={UserDetails} />                          
//                           </Switch>
//                       </span>

                      
//                   </div>
//               </Router>
//             </Provider>
//           </Fragment>
//       )
//   }
// }

// export default App;



// src/App.js
// import React from 'react';
// import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
// import { Routes, Route } from 'react-router-dom';
// import { HistoryRouter as Router } from 'redux-first-history/rr6';

// import store, { history, persistor } from './store';

// import HomePage from './containers/HomePage';
// import Signup from './containers/Signup';
// import Login from './containers/Login';
// import UserDetails from './containers/UserDetails';

// function App() {
//   return (
//     <Provider store={store}>
//       <PersistGate loading={null} persistor={persistor}>
//         <Router history={history}>
//           <div className="main-container">
//             <h1>Hello App loaded</h1>
//             <Routes>
//               <Route path="/" element={<HomePage />} />
//               <Route path="/signup" element={<Signup />} />
//               <Route path="/login" element={<Login />} />
//               <Route path="/userdetails" element={<UserDetails />} />
//             </Routes>
//           </div>
//         </Router>
//       </PersistGate>
//     </Provider>
//   );
// }

// export default App;


// import React from 'react';
// import { Provider } from 'react-redux';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import store from './store';

// import HomePage from './containers/HomePage';
// import Signup from './containers/Signup';
// import Login from './containers/Login';
// import UserDetails from './containers/UserDetails';

// function App() {
//   return (
//     <Provider store={store}>
//       <Router>
//         <div className="main-container">
//           <h1>Hello App loaded</h1>
//           <Routes>
//             <Route path="/" element={<HomePage />} />
//             <Route path="/signup" element={<Signup />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/userdetails" element={<UserDetails />} />
//           </Routes>
//         </div>
//       </Router>
//     </Provider>
//   );
// }

// export default App; work fine
// import React from 'react';
// import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
// import { Routes, Route } from 'react-router-dom';
// import { HistoryRouter } from 'redux-first-history/rr6';

// import store, { history, persistor } from './store';

// import HomePage from './containers/HomePage';
// import Signup from './containers/Signup';
// import Login from './containers/Login';
// import UserDetails from './containers/UserDetails';

// function App() {
//   return (
//     <Provider store={store}>
 
//         <HistoryRouter history={history}>
//           <div className="main-container">
//             <h1>Hello App loaded</h1>
//             <Routes>
//               <Route path="/" element={<HomePage />} />
//               <Route path="/signup" element={<Signup />} />
//               <Route path="/login" element={<Login />} />
//               <Route path="/userdetails" element={<UserDetails />} />
//             </Routes>
//           </div>
//         </HistoryRouter>

//     </Provider>
//   );
// }

// export default App;

// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
//import { HistoryRouter } from 'redux-first-history/rr6';
import { history } from './store';

import HomePage from './containers/HomePage';
import Signup from './containers/Signup';
import Login from './containers/Login';
import UserDetails from './containers/UserDetails';

function App() {
  return (
    //<HistoryRouter history={history}>
      <div className="main-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/userdetails" element={<UserDetails />} />
        </Routes>
      </div>
    //</HistoryRouter>
  );
}


export default App;



