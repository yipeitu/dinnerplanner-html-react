// import Cookies from 'universal-cookie';
// const cookies = new Cookies();

const httpOptions = {
  headers: {'X-Mashape-Key': 'Qu9grxVNWpmshA4Kl9pTwyiJxVGUp1lKzrZjsnghQMkFkfA4LB'}
};

export const STATUS = {
  LOADED: "LOADED",
  INITIAL: "INITIAL",
  ERROR: "ERROR"
};

const DinnerModel = function () {

  let numberOfGuests = 4;
  let observers = [];
  let pMapDishesId = [];
  let pSearchType = "all";
  let pDishTypes = ["all", "main course", "side dish", "dessert", "appetizer", "salad", "bread", "breakfast", "soup", "beverage", "sauce", "drink"];
  let pDishes = [];
  let pMissImgId = [110669, 146557, 698704, 609572];
  let pStatus = STATUS.INITIAL;
  let pSelecteIds = [];

  this.setNumberOfGuests = function (num) {
    if(localStorage.getItem("numberOfGuests") !== null){
      numberOfGuests = localStorage.getItem("numberOfGuests");
    }
    if(num < 0) return;
    numberOfGuests = num;
    localStorage.setItem("numberOfGuests", numberOfGuests)
    notifyObservers();
  };

  this.getNumberOfGuests = function () {
    if(localStorage.getItem("numberOfGuests") !== null){
      numberOfGuests = localStorage.getItem("numberOfGuests");
    }
    return numberOfGuests;
  };

  this.getAllDishTypes = function(){
    return pDishTypes;
  }

  this.getDish = function(dishId){
    // if(pDishes.length === 0) pDishes = cookies.get("pDishes")
    if(localStorage.getItem("pDishes") !== null){
      pDishes = JSON.parse(localStorage.getItem("pDishes"))
    }
    for(var key in pDishes){
      if(pDishes[key].id === dishId){
        return pDishes[key]
      }
    }
  }

  this.getDishes = function(dishType, keyWord){
    if(localStorage.getItem("pDishes") !== null){
      pDishes = JSON.parse(localStorage.getItem("pDishes"))
    }
    return pDishes.filter(function(dish) {
      var found = true;
      if(keyWord){
        found = false;
        dish.ingredients.forEach(function(ingredient) {
          if(ingredient.name.indexOf(keyWord)!== -1) {
            found = true;
          }
        });
        if(dish.name.indexOf(keyWord) !== -1)
        {
          found = true;
        }
      }
      if(dishType === "all") return found;
        return dish.type === pSearchType && found;
    });
  }

  this.getStatus = function(){
    return pStatus;
  }

  this.addDishToMenu = function(dishId){
    if(localStorage.getItem("pSelecteIds") !== null){
      pSelecteIds = JSON.parse(localStorage.getItem("pSelecteIds"))
    }
    var index = pSelecteIds.indexOf(dishId);
    // add to the customer menu
    if(index === -1){
      pSelecteIds.push(dishId);
      localStorage.setItem("pSelecteIds", JSON.stringify(pSelecteIds));
      notifyObservers();
      return true;
    }
    return false;
    // index = unSelectedIds.indexOf(dishId);
    // // remove from the main menu
    // if(index !== -1) pSelecteIds.splice(index, 1);
  }

  this.getCurrentDishes = function(){
    if(localStorage.getItem("pSelecteIds") !== null){
      pSelecteIds = JSON.parse(localStorage.getItem("pSelecteIds"))
    }
    return pSelecteIds.map(function(id){
      var dish = this.getDish(id);
      return [dish.name, dish.price, dish.image, dish.description, dish.id];
    }, this);
  }

  this.getTotalPrice = function(){
    var total = 0;
    pSelecteIds.map((id)=>{
      var dish = this.getDish(id);
      total += dish.price
    })
    return (total*numberOfGuests).toFixed(2)
  }
  // API Calls

  this.getAllDishes = function (dishType, keyWord="") {
    pStatus = STATUS.INITIAL;
    if(localStorage.getItem("pDishes") !== null){
      pDishes = JSON.parse(localStorage.getItem("pDishes"))
      pMapDishesId = JSON.parse(localStorage.getItem("pMapDishesId"))
    }
    return searchDishes(dishType, keyWord).then(dishes => {
      pStatus = STATUS.LOADED;
      dishes.results.forEach(function(dish){
        if(pMapDishesId.indexOf(dish.id) === -1 && pMissImgId.indexOf(dish.id) === -1){
          pDishes.push({
            "id": dish.id,
            "name": dish.title,
            "type": dishType,
            "image": dishes.baseUri+dish.image,
            "description": "",
            "ingredients": [],
            "price": 0.00
          })
          pMapDishesId.push(dish.id);
          localStorage.setItem("pDishes", JSON.stringify(pDishes))
          localStorage.setItem("pMapDishesId", JSON.stringify(pMapDishesId))
          // cookies.set('pDishes', pDishes, { path: '/' });
          // cookies.set('pMapDishesId', pMapDishesId, { path: '/' });
        }   
      })
      // return pDishes;
    }).catch((e) => {
      pStatus = STATUS.ERROR;
      console.log("error", e);
      // return null;
    })
  }
  
  this.getDetailDish = function(dishId) {
    pStatus = STATUS.INITIAL;
    if(localStorage.getItem("pDishes") !== null){
      pDishes = JSON.parse(localStorage.getItem("pDishes"))
    }
    for(var key in pDishes){
      if(pDishes[key].id === dishId) {
        pStatus = STATUS.LOADED;
        if(pDishes[key].ingredients.length === 0){
          console.log("1")
          return detailDish(dishId).then(data => {
            const detail = data[0]
            detail.extendedIngredients.forEach(function(ingredient){
              pDishes[key].ingredients.push({ 
                'name': ingredient.name,
                'quantity': (ingredient.amount/detail.servings).toFixed(2),
                'unit': ingredient.unit,
                // 'price': parseFloat((detail.pricePerServing/detail.servings).toFixed(2))
                });
            })
            pDishes[key].description = detail.instructions;
            pDishes[key].price = parseFloat((detail.pricePerServing/detail.servings).toFixed(2))
            localStorage.setItem("pDishes", JSON.stringify(pDishes))
            // cookies.set('pDishes', pDishes, { path: '/' });
            return pDishes[key]
          }).catch(() => {
            pStatus = STATUS.ERROR;
            console.log("error");
          })
        }
        else{
          console.log("2")
          return Promise.resolve(pDishes[key]).then(
            () => { return pDishes[key]}).catch(
            ()=>{console.log("error")});
        }
      }
    }
  }

  const searchDishes = function(type, filter) {
    const url = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search?number=3&type="+type+"&query="+filter;
    return fetch(url, httpOptions)
      .then(processResponse)
      .catch(handleError)
  }

  const detailDish = function(dishId){
    const url = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/informationBulk?ids="+dishId+"&includeNutrition=false";
    return fetch(url, httpOptions)
      .then(processResponse)
      .catch(handleError)
  }
  // API Helper methods

  const processResponse = function (response) {
    if (response.ok) {
      return response.json()
    }
    throw response;
  }
  
  const handleError = function (error) {
    if (error.json) {
      error.json().then(error => {
        pStatus = STATUS.ERROR;
        console.error('API Error:', error.message || error)
      })
    } else {
      pStatus = STATUS.ERROR;
      console.error('API Error:', error.message || error)
    }
  }

  // Observer pattern

  this.addObserver = function (observer) {
    observers.push(observer);
  };

  this.removeObserver = function (observer) {
    observers = observers.filter(o => o !== observer);
  };

  const notifyObservers = function () {
    observers.forEach(o => o.update());
  };
};

export const modelInstance = new DinnerModel();
