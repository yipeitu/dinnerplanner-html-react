import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Statusbar extends Component {

  constructor(props) {
    super(props)
    
    // we put on state the properties we want to use and modify in the component
    this.state = {
      numberOfGuests: this.props.model.getNumberOfGuests()
    }
  }

  // this methods is called by React lifecycle when the 
  // component is actually shown to the user (mounted to DOM)
  // that's a good place to setup model observer
  componentDidMount() {
    this.props.model.addObserver(this)
  }

  // this is called when component is removed from the DOM
  // good place to remove observer
  componentWillUnmount() {
    this.props.model.removeObserver(this)
  }

  // in our update function we modify the state which will
  // cause the component to re-render
  update() {
    this.setState({
      numberOfGuests: this.props.model.getNumberOfGuests(),
    })
  }


  render() {
    return (
      <div className="StatusBar row" id="iStatusView">
        <div className="h2">
          My Dinner: <span id="iNumberOfGuests">{this.state.numberOfGuests}</span> people
        </div>
        <div className="col text-right">
          <Link to={"/search"}>
            <button id="iResultBackToSearch" className="btn btn-warning btn-lg btn-array-left">back to search</button>
          </Link>
        </div>
        <hr style={{width: "100%", height: "1px", "backgroundColor": "black"}} />
      </div>
    );
  }
}

export default Statusbar;
