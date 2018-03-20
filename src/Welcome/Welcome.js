import React, { Component } from 'react';
import './Welcome.css';
import { Link } from 'react-router-dom';

class Welcome extends Component {
  render() {
    return (
      <div className="Welcome">
        <div className="d-none d-sm-block p-5"></div>
        <div className="text-center">
          <p className="mt-5 mb-5 ml-1 mr-1">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        </div>
        <div className="d-none d-sm-block p-5"></div>
        <div className="text-center">
          <Link to="/search">
            <button className="btn btn-warning btn-lg">Create new dinner</button>
          </Link>
        </div>
      </div>
    );
  }
}

export default Welcome;
