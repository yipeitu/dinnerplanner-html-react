import React, { Component } from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';

class Sidebar extends Component {

  constructor(props) {
    super(props)
    
    // we put on state the properties we want to use and modify in the component
    this.state = {
      numberOfGuests: this.props.model.getNumberOfGuests(),
      currentDish: this.currentDish(),
      totalPrice: this.props.model.getTotalPrice(),
      mobile: "d-none"
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
      currentDish: this.currentDish(),
      totalPrice: this.props.model.getTotalPrice()
    })
  }

  onNumberOfGuestsIncrease = (e) => {
    this.props.model.setNumberOfGuests(this.props.model.getNumberOfGuests()+1)
  }

  onNumberOfGuestsDecrease = (e) => {
    this.props.model.setNumberOfGuests(this.props.model.getNumberOfGuests()-1)
  }

  onClickMobileMenu = (e) => {
    // console.log(this.refs.iBtnGuest.className)
    // if(this.refs.iBtnGuest.hasClass("d-none")){
    //   this.refs.iBtnGuest.removeClass("d-none")
    // } else {
    //   this.refs.iBtnGuest.addClass("d-none");
    // }
    
    // if(this.refs.iOrderDishes.hasClass("d-none")){
    //   this.refs.iOrderDishes.removeClass("d-none")
    // } else {
    //   this.refs.iOrderDishes.addClass("d-none");
    // }

    // if(this.refs.iBtnConfirm.hasClass("d-none")){
    //   this.refs.iBtnConfirm.removeClass("d-none")
    // } else {
    //   this.refs.iBtnConfirm.addClass("d-none");
    // }
    console.log(this.refs.mobile, this.refs.mobile.class)
    if(this.state.mobile === "d-none"){
      this.setState({
        mobile: "d-sm-block"
      })
    } else {
      this.setState({
        mobile: "d-none"
      })
    }
  }

  currentDish = () => {
    return this.props.model.getCurrentDishes().map((dish) => {
      // return <div className="d-flex" key={"order_"+dish[4]}>
      return <div className="d-flex">
        <div className="col-xs-3 mr-auto p-2">
          {dish[0].slice(0, 18)+"..."}
        </div>
        <div className="col-xs-3 ml-auto p-2">
          {(dish[1]*this.props.model.getNumberOfGuests()).toFixed(2)}
        </div>
        </div>
    })
  }

  render() {
    return (
      <div className="Sidebar">
        <div className="container align-items-center">
          <div className="d-flex align-items-center justify-content-between">
            <span className="align-middle text-left h2">My Dinner</span>
              <div className="d-block d-sm-none text-right align-items-center">SEK <span id="mTotalPrice">{this.state.totalPrice}</span></div>
              <div id="iToggle" className="d-block d-sm-none" onClick={this.onClickMobileMenu}>
                <div className="one"></div>
                <div className="two"></div>
                <div className="three"></div>
              </div>
          </div>
          <div class={this.state.mobile} ref="mobile">
            <div className="h4">People: <span className="mr-sm-3">{this.state.numberOfGuests}</span>
              <div className="btn-group">
                <button className="btn btn-secondary" onClick={this.onNumberOfGuestsDecrease}>-</button>
                <button className="btn btn-secondary" onClick={this.onNumberOfGuestsIncrease}>+</button>
              </div>
            </div>
            <div className="bg-light text-dark border">
              <div className="d-flex">
                <div className="col-xs-3 mr-auto p-2">
                  Dish Name
                </div>
                <div className="col-xs-3 ml-auto p-2">
                    Cost
                </div>
              </div>
              {this.state.currentDish}
            </div>
            <div className="d-inline-flex">
              <Link to={"/confirm"}>
                <button ref="iBtnConfirm" className="d-sm-block btn btn-warning btn-lg btn-block mt-2">Confirm Dinner</button>
              </Link>
            </div>
          </div>
          <div className="d-none d-sm-block" ref="iBtnGuest">
            <div className="h4">People: <span className="mr-sm-3">{this.state.numberOfGuests}</span>
              <div className="btn-group">
                <button className="btn btn-secondary" onClick={this.onNumberOfGuestsDecrease}>-</button>
                <button className="btn btn-secondary" onClick={this.onNumberOfGuestsIncrease}>+</button>
              </div>
            </div>
          </div>
          <div className="d-none d-sm-block bg-light text-dark border" ref="iOrderDishes">
            <div className="d-flex">
              <div className="col-xs-3 mr-auto p-2">
                Dish Name
              </div>
              <div className="col-xs-3 ml-auto p-2">
                  Cost
              </div>
            </div>
            {this.state.currentDish}
          </div>
          <p className="d-none d-sm-block text-right mt-2">SEK <span id="iTotalPrice">{this.state.totalPrice}</span></p>
          <div className="d-inline-flex">
            <Link to={"/confirm"}>
              <button ref="iBtnConfirm" className="d-none d-sm-block btn btn-warning btn-lg btn-block mt-2">Confirm Dinner</button>
            </Link>
          </div>
        </div>
      </div>
    );
    // return (
    //   <div className="Sidebar">
    //     <h3>This is the sidebar</h3>
    //     <p>
    //     People: <input value={this.state.numberOfGuests} onChange={this.onNumberOfGuestsChanged}/>
    //     <br/>
    //     Total number of guests: {this.state.numberOfGuests}
    //     </p>
    //   </div>
    // );
  }
}

export default Sidebar;
