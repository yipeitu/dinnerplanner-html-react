import React, { Component } from 'react';
import './App.css';
import { Route } from 'react-router-dom';
import Welcome from './Welcome/Welcome';
import { modelInstance } from './data/DinnerModel'
import SelectDish from "./SelectDish/SelectDish";
import DishDetails from "./DishDetails/DishDetails";
import ConfirmDish from "./ConfirmDish/ConfirmDish";
import PrintReceipt from "./PrintReceipt/PrintReceipt";

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: 'Dinner Planner',
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title navbar flex-column bg-light h1">{this.state.title}</h1>
          
          {/* We rended diffrent component based on the path */}
          <Route exact path="/" component={Welcome}/>
          <Route path="/search" render={(props) => <SelectDish {...props} model={modelInstance}/>}/>
          <Route path="/dish/:id" render={(props) => <DishDetails data={props} model={modelInstance}/>}/>
          <Route path="/confirm" render={(props) => <ConfirmDish {...props} model={modelInstance}/>}/>
          <Route path="/print" render={(props) => <PrintReceipt {...props} model={modelInstance}/>}/>
        </header>
      </div>
    );
  }
}

export default App;
