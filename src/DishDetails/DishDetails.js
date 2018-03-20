import React, {Component} from 'react';
import {STATUS} from '../data/DinnerModel';
import {ErrorMsg, Loading} from '../Message'
import Sidebar from '../Sidebar/Sidebar';
import {Link} from 'react-router-dom';

class DishDetails extends Component {
  constructor(props) {
    super(props);
    // We create the state to store the various statuses
    // e.g. API data loading or error 
    this.state = {
      status: STATUS.INITIAL,
      dishId: parseInt(props.data.match.params.id, 10),
      dish: this.props.model.getDish(parseInt(props.data.match.params.id, 10)),
      numberOfGuests: this.props.model.getNumberOfGuests(),
    }
  }

  // this methods is called by React lifecycle when the 
  // component is actually shown to the user (mounted to DOM)
  // that's a good place to call the API and get the data
  componentDidMount = () => {
    // when data is retrieved we update the state
    // this will cause the component to re-render
    if(this.state.status !== STATUS.LOADED){
      this.props.model.getDetailDish(this.state.dishId).then(dish => {
          this.setState({
            status: STATUS.LOADED,
            dish: dish
          })
        }).catch(() => {
          this.setState({
            status: STATUS.ERROR
          })
        })
    }
    this.props.model.addObserver(this)
  }

  componentWillUnmount() {
    this.props.model.removeObserver(this)
  }

  update() {
    this.setState ({
      status: this.props.model.getStatus(),
      numberOfGuests: this.props.model.getNumberOfGuests()
    })
  }

  onAddToMenu = () => {
    if(!this.props.model.addDishToMenu(this.state.dishId)){
      alert("already ordered")
    }
  }

  dishImage = () => {
    if(this.state.dish.description === ""){
      return<figure className="figure">
        <div className="figure-img img-fluid img-thumbnail m-2 csImgDetail" style={{backgroundImage: `url(${this.state.dish.image})`}}></div>
        <figcaption className="figure-caption text-left" id="description"><Loading /></figcaption></figure>;
    } else{
      return<figure className="figure">
        <div className="figure-img img-fluid img-thumbnail m-2 csImgDetail" style={{backgroundImage: `url(${this.state.dish.image})`}}></div>
        <figcaption className="figure-caption text-left" id="description">{this.state.dish.description}</figcaption></figure>;
    }
  }

  ingredientRow = (ingredient, key) => {
    // return <div className="d-flex m-1" key={"ingredient_"+key}>
    return <div className="d-flex m-1">
    <div className="mr-auto text-left">
      {(this.state.numberOfGuests * ingredient.quantity).toFixed(2)+" "+ingredient.unit}
    </div>
    <div className="text-right"> 
      {ingredient.name}
    </div>
    </div>;
  }

  render() {
    let ingredients = null;
    let price = "0.00";
    switch (this.state.status) {
      case 'INITIAL':
        ingredients = <Loading />
        break;
      case 'LOADED':
        ingredients = this.state.dish.ingredients.map((ingredient, key) =>{
          return this.ingredientRow(ingredient, key)
        })
        price = (this.state.numberOfGuests * this.state.dish.price).toFixed(2)
        break;
      default:
        ingredients = <ErrorMsg />
        break;
    }
    return (
      <div className="DishDetails row flex-xl-nowrap">
        {/* We pass the model as property to the Sidebar component */}
        <div className="col-sm-4 bd-sidebar">
          <Sidebar model={this.props.model}/>
        </div>
        <div className="col-sm-8 bd-content">
          <div className="container-fluid">
          <div className="row">
            <div className="col">
              <div className="h2 m-1" id="iDishName">
                {this.state.dish.name}
              </div>
              <div className="row m-1" id="iDishImg">
                {this.dishImage()}
              </div>
              <div className="row m-1">
                <Link to="/search">
                  <button className="btn btn-warning btn-lg btn-array-left">back to search</button>
                </Link>
              </div>
            </div>
            <div className="d-flex flex-column border border-dark m-1 align-items-around" style={{"backgroundColor": "#FAFAD2"}}>
              <div className="text-center m-1 h4" id="iNumberOfGuests">
                INGREDIENTS FOR {this.state.numberOfGuests} PERSON
              </div>
              <hr style={{width: "100%", height: "1px", "backgroundColor": "black"}} />
              <div>
                {ingredients}
              </div>
              <hr style={{width: "100%", height: "1px", "backgroundColor": "black"}} />
              <div className="d-flex justify-content-around align-items-center">
                <div className="text-left">
                  <button className="btn btn-warning btn-lg" onClick={this.onAddToMenu}>add to menu</button>
                </div>
                <div className="text-right h5">
                  SEK <span id="iIngredientsPrice">{price}</span>
                </div>
              </div>
            </div>
            <div className="col-12 h2">
              PREPARATION
            </div>
          </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DishDetails;
