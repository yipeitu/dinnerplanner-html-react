import React, { Component } from 'react';
import './SelectDish.css';
import Sidebar from '../Sidebar/Sidebar';
import Dishes from '../Dishes/Dishes';

class SelectDish extends Component {
  render() {
    return (
      <div className="SelectDish row flex-xl-nowrap">
        {/* We pass the model as property to the Sidebar component */}
        <div className="col-sm-4 bd-sidebar">
          <Sidebar model={this.props.model}/>
        </div>
        <div className="col-sm-8 bd-content">
          <Dishes/>
        </div>
      </div>
    );
  }
}

export default SelectDish;
