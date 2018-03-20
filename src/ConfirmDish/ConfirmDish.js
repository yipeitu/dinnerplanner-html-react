import React, {Component} from 'react';
// Alternative to passing the moderl as the component property, 
// we can import the model instance directly
import Statusbar from '../Statusbar/Statusbar';
import { Link } from 'react-router-dom';

class ConfirmDish extends Component {
  constructor(props) {
    super(props);
    // We create the state to store the various statuses
    // e.g. API data loading or error 
    this.state = {
      numberOfGuests: this.props.model.getNumberOfGuests(),
      currentDish: this.currentDish(),
      totalPrice: this.props.model.getTotalPrice()
    }
  }

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

  update() {
    this.setState({
      numberOfGuests: this.props.model.getNumberOfGuests(),
      currentDish: this.currentDish(),
      totalPrice: this.props.model.getTotalPrice()
    })
  }

  currentDish = () => {
    return this.props.model.getCurrentDishes().map((dish)=>{
      return <figure class="figure m-4 my-xs-2 ml-xs-1" key={"confirm"+dish[4]}>
        <div class="figure-img img-fluid rounded csImg" style={{backgroundImage: `url(${dish[2]})`}}></div>
          <figcaption class="figure-caption text-center">{dish[0].slice(0, 18)+"..."}</figcaption>
            <p class="text-right">{(dish[1]*this.props.model.getNumberOfGuests()).toFixed(2)+" SEK"}</p>
      </figure>
    })
  }
 
  render() {
    return (
      <div className="ConfirmDish container">
        <Statusbar model={this.props.model}/>
        <div id="iOverView">
          <div className="d-flex justify-content-around">
          <div className="row flex-xl-nowrap justify-content-center" id="iResultImage">
            {this.state.currentDish}
          </div>
          <div className="d-flex align-items-center text-left border-left border-dark">
            <div className="ml-2">
              <div className="h5">Total:</div>
                <div className="h5">SEK <span id="iFinalPrice">{this.state.totalPrice}</span></div>
                </div>
              </div>
          </div>
          <hr style={{width: "100%", height: "1px", "backgroundColor": "black"}} />
          <div className="row">
            <div className="col text-center">
              <Link to={"/print"}>
                <button id="iResultPrintout" className="btn btn-warning btn-lg ">Print Full Receipe</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ConfirmDish;
