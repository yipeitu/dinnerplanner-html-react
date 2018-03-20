import React, {Component} from 'react';
import './Dishes.css';
// Alternative to passing the moderl as the component property, 
// we can import the model instance directly
import {modelInstance, STATUS} from '../data/DinnerModel';
import {ErrorMsg, Loading} from '../Message'
import { Link } from 'react-router-dom';

class Dishes extends Component {
  constructor(props) {
    super(props);
    // We create the state to store the various statuses
    // e.g. API data loading or error 
    this.state = {
      status: STATUS.INITIAL,
      keyWord: "",
      dishType: "all"
    }
  }

  // this methods is called by React lifecycle when the 
  // component is actually shown to the user (mounted to DOM)
  // that's a good place to call the API and get the data
  componentDidMount = () => {
    // when data is retrieved we update the state
    // this will cause the component to re-render
    const dishTypes = modelInstance.getAllDishTypes()
    dishTypes.map((type) => 
      modelInstance.getAllDishes(type).then(dishes => {
        this.setState({
          status: STATUS.LOADED,
          dishes: modelInstance.getDishes(this.state.dishType, this.state.keyWord),
          dishTypes: dishTypes
        })
      }).catch(() => {
        this.setState({
          status: STATUS.ERROR
        })
      })
    )
  }

  update() {
    this.setState({
      dishes: modelInstance.getDishes(this.state.dishType, this.state.keyWord),
      status: modelInstance.getStatus()
    })
  }

  onDishKeyWord = (e) => {
    this.setState({
      keyWord: e.target.value
    });
  };

  onDishTypeSelect = (e) => {
    this.setState({
      dishType: e.target.value
    });
  };

  onDishSearch = () => {
    modelInstance.getAllDishes(this.state.dishType, this.state.keyWord).then(dishes => {
      this.setState({
        status: STATUS.LOADED,
        dishes: modelInstance.getDishes(this.state.dishType, this.state.keyWord)
      })
    }).catch(() => {
      this.setState({
        status: STATUS.ERROR
      })
    })
  }

  dishImage = (dish) => {
    // return <Link to={`/dish/${dish.id}`} key={"dishId_"+dish.id}>
    return <Link to={`/dish/${dish.id}`}>
    <figure className="figure">
      <div className="img img-fluid img-thumbnail m-2 csImg" style={{backgroundImage: `url(${dish.image})`}}></div>
      <figcaption className="figure-caption text-center">{dish.name.slice(0, 18)+"..."}</figcaption>
    </figure>
    </Link>
  }

  render() {
    let dishesList = null;
    let dishTypes = null;
    // depending on the state we either generate
    // useful message to the user or show the list
    // of returned dishes
    switch (this.state.status) {
      case 'INITIAL':
        dishesList = <Loading />
        break;
      case 'LOADED':
        dishesList = this.state.dishes.map(function(dish){
          return this.dishImage(dish)
        }, this)
        dishTypes = this.state.dishTypes.map((dishType, key) =>
          // <option key={"dish_"+key} className="dropdown-item" value={dishType}>{dishType}</option>
          <option className="dropdown-item" value={dishType}>{dishType}</option>
        )
        break;
      default:
        dishesList = <ErrorMsg />
        break;
    }

    return (
      <div className="Dishes">
        <section className="text-center mb-5">
          <div className="container d-none d-sm-block">
            <div className="text-left h2">FIND A DISH</div>
              <div className="row-fluid d-flex align-middle align-items-center">
                <div className="mr-sm-4">
                  <label className="sr-only" htmlFor="enterKeyWords">EnterKeyWords</label>
                    <input type="text" placeholder="Enter key word" 
                    value={this.state.keyWord} 
                    onChange={this.onDishKeyWord}/>
                </div>
                <div className="mr-sm-4">
                  <select onChange={this.onDishTypeSelect}>
                    {dishTypes}
                  </select>
                </div>
                <div>
                  <button className="btn btn-warning btn-md" onClick={this.onDishSearch}>search</button>
                </div>
              </div>
            </div>
        </section>
        <div className="container text-center text-lg-left">{dishesList}</div>
      </div>
      
    );
  }
}

export default Dishes;
