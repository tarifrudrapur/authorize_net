import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from 'containers/Home/';

export default class App extends React.Component {
  render () {
    return (
        <Router>
            <Route exact path="/" component={Home} />
        </Router>
    );
  }
}
