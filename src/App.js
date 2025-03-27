import React, { Component, Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'connected-react-router';
import { Provider } from 'react-redux';
import { Redirect } from 'react-router-dom';
import store from './store';
import {history} from './redux'
import { connect } from 'react-redux';
import WordToImg from './WordToImg';
import Home from './containers/Home'
class App extends Component {

  handlePersistorState = () => {
      const { persistor } = this.props;
      if(persistor){
      let { bootstrapped } = persistor.getState();
      if (bootstrapped) {
          if (this.props.onBeforeLift) {
              Promise.resolve(this.props.onBeforeLift())
                  .then(() => this.setState({ bootstrapped: true }))
                  .catch(() => this.setState({ bootstrapped: true }));
          } else {
              this.setState({ bootstrapped: true });
          }
      }
      }
  };

  componentDidMount() {
      this.handlePersistorState();
  }
  
  render() {
      return (
          <Fragment>
            <Provider store={store}>
              <Router history={history}>
                  <div className="main-container">
                      <span className="content-container">
                          <Switch>
                              <Route path={'/'} exact component={Home} />                          
                          </Switch>
                      </span>

                      
                  </div>
              </Router>
            </Provider>
          </Fragment>
      )
  }
}

export default App;


