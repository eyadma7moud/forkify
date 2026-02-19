import * as model from './model.js';
import recipeView from './views/recipeview.js';
import searchView from './views/searchView.js';
import resulsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////

bookmarksView.render(model.state.bookmarks);
const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    await model.loadRecipe(id);

    //? Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError(err);
  }
};

const controlSearchResults = async function () {
  try {
    
    const query = searchView.getQuery();
    if (!query) return;
    
    resulsView.renderSpinner();
    
    await model.loadSearchResults(query);
    console.log(model.state.search.results);
    
    //? Render results
    // resulsView.render(model.state.search.results);
    resulsView.render(model.getSearchResultsPage());
    
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(`${err}🤬🤬🤬🤬`);
  }
};

const controlerPagination = function (goToPage) {
  resulsView.render(model.getSearchResultsPage(goToPage));

  paginationView.render(model.state.search);
};

const conrolServings = function (newServings) {
  model.updateSurvings(newServings);
  recipeView.render(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  recipeView.render(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
};

controlSearchResults();

['hashchange', 'load'].forEach(ev =>
  window.addEventListener(ev, controlRecipe),
);

searchView.addHandlerSearch(controlSearchResults);
paginationView.addHandlerClick(controlerPagination);
recipeView.addHandlerUpdateServings(conrolServings);
recipeView.addHandlerAddBookmark(controlAddBookmark);
