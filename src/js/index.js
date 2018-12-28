///////////// Global app controller //////////////
// import the search model from the Search.js file.
import Search from './models/Search';
// import the Recipe model.
import Recipe from './models/recipe';
// import the list model.
import List from './models/list';
// import likes Model.
import Likes from './models/likes';
// import the all from the search view.
import * as searchView from './views/searchView';
// import the recipe view.
import * as recipeView from './views/recipeView';
// import the list view.
import * as listView from './views/listView';
// import the likes view.
import * as likesView from './views/likesView';
// import from the base file.
import { elements, renderLoader, clearLoader } from './views/base';

// the global state of the app.
const state = {};

///////// SEARCH CONTROLLER ///////////
// function to get the results.
const controlSearch = async () => {
  // 1. get the query from the view.
  const query = searchView.getInput();

  if(query) {
    // 2. create new search object.
    state.search = new Search(query);

    // 3. prepare UI for results.
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchResults);
    
    try {
      // 4. search for recipes.
       await state.search.getResults();
      // 5. render results on UI.
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (error) {
      console.log(error);
      clearLoader();
    }
  }
}

// event listener for the search bar.
elements.searchForm.addEventListener('submit', (event) => {
  // prevent the default link behaviour.
  event.preventDefault();
  // call the controlSearch function.
  controlSearch();
});


// event listener for page buttons.
elements.searchResPages.addEventListener('click', (event) => {
  const btn = event.target.closest('.btn-inline');
  searchView.clearResults();
  if(btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.renderResults(state.search.result, goToPage);
  }
});

//////////// RECIPE CONTROLLER ////////////
const controleRecipe = async () => {
  // get the recipe id from the URL hash.
  const id = window.location.hash.replace('#', '');
  // if the ID exists.
  if(id) {
    // 1. prepare the UI for changes.
    recipeView.clearRecipe();
    renderLoader(elements.recipe);
    // highlight selected item.
    if(state.search) {
      searchView.highlightSelected(id);
    }
    // 2. create new recipe object.
    state.recipe = new Recipe(id);

    try {
      // 3. get the recipe data and parseIngredients.
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      // 4. calculate servings and time.
      state.recipe.calcServings();
      state.recipe.calcTime();
      // 5. render the recipe.
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch(error) {
      console.log(error);
    }
  }
}
// add addEventListener to load the recipe.
// add more than one event listener on the window object, using a loop to loop through an array.
['hashchange', 'load'].forEach((event) => {
  window.addEventListener(event, controleRecipe);
});

////////// LIST CONTROLLER //////////
const controlList = () => {
  // create a new list if none.
  if(!state.list) {
    state.list = new List();
  }

  // add each ingredient to the list.
  state.recipe.ingredients.forEach(el => {
    const item = state.list.additem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
}

// handle delete and update list item events.
elements.shopping.addEventListener('click', (event) => {
  const id = event.target.closest('.shopping__item').dataset.itemid;

  // handle delete button.
  if(event.target.matches('.shopping__delete, .shopping__delete *')) {
    // delete item from state.
    state.list.deleteItem(id);
    // delete from UI.
    listView.deleteItem(id);
    // handle the count update.
  } else if(event.target.matches('.shopping__count-value')) {
    const val = parseFloat(event.target.value);
    state.list.updateCount(id, val);
  }
});

///////////// LIKES CONTROLLER ///////////////

const controlLike = () => {
  if(!state.likes) {
    state.likes = new Likes();
  }

  const currentId = state.recipe.id;

  if(!state.likes.isLiked(currentId)) {
    // add the like to the state.
    const newLike = state.likes.addLike(currentId, state.recipe.title, state.recipe.author, state.recipe.image);
    console.log(newLike);
    // toggle the like button.
    likesView.toggleLikeBtn(true);
    // add like to UI list.
    likesView.renderLike(newLike);
  } else {
    // remove the like to the state.
    state.likes.deleteLike(currentId);
    // toggle the like button.
    likesView.toggleLikeBtn(false);
    // remove like to UI list.
    likesView.deleteLike(currentId);
  }

  // show likes menu if there are likes or hide if no likes.
  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
}

// restore likes on page load.
window.addEventListener('load', () => {
  state.likes = new Likes();
  state.likes.readStorage();
  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
  state.likes.likes.forEach((like) => likesView.renderLike(like))
});

// event listeners to add or remove servings.
elements.recipe.addEventListener('click', event => {
  if(event.target.matches('.btn-decrease, .btn-decrease *')) {
    // Decrease button is clicked
    if(state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if(event.target.matches('.btn-increase, .btn-increase *')) {
    // increase button is clicked.
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if(event.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    // List Controller.
    controlList();
  } else if(event.target.matches('.recipe__love, .recipe__love *')) {
    // like controller.
    controlLike();
  }
});




