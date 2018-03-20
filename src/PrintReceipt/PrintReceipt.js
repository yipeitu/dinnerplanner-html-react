import React, {Component} from 'react';
// Alternative to passing the moderl as the component property, 
// we can import the model instance directly
import Statusbar from '../Statusbar/Statusbar';

class PrintReceipt extends Component {
  constructor(props) {
    super(props);
    // We create the state to store the various statuses
    // e.g. API data loading or error 
    this.state = {
      receipt: this.getReceipt()
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
      receipt: this.getReceipt()
    })
  }

  getReceipt = () => {
    return this.props.model.getCurrentDishes().map((dish)=>{
      return <div className="row flex-xl-nowrap justify-content-between">
              <div className="row flex-xl-nowrap">
                <div className="d-flex justify-content-center">
                    <div className="figure-img img-fluid rounded csImgReceipe" style={{backgroundImage: `url(${dish[2]})`}}></div>
                </div>
                <div className="ml-2 d-flex flex-column">
                  <div className="h3">{dish[0]}</div>
                  <p>{dish[3]}</p>
                </div>
              </div>

              <div className="ml-3 col-sm-6 flex-column">
                <div className="h5">
                  Preparation
                </div>
                <p>
                  {dish[3]}
                </p>
              </div>
            </div>;
        })
  }

  render() {
    return (
      <div className="PrintReceipt container">
        <Statusbar model={this.props.model}/>
        <div id="iResult">
          <div className="container-fluid" id="iPrintout">
            {this.state.receipt}
          </div>
        </div>
      </div>
      
    );
  }
}

export default PrintReceipt;
