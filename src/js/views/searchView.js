// import the elements.
import { elements } from './base';

// export a function to get the user input from the search field.
export const getInput = () => {
  return elements.searchInput.value;
}

// function to clear the search input.
export const clearInput = () => {
  elements.searchInput.value = "";
}

// function to clear the results.
export const clearResults = () => {
  elements.searchResultList.innerHTML = '';
  elements.searchResPages.innerHTML = '';
}

// function to hightlight a the selected recipe.
export const highlightSelected = (id) => {
  const resultsArr = Array.from(document.querySelectorAll('.results__link'));
  resultsArr.forEach((el) => {
    el.classList.remove('results__link--active');
  });

  document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
}

// function to limit the title of the recipe.
export const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];

  if(title.length > limit) {
    title.split(' ').reduce((acc, current) => {
      if(acc + current.length <= limit) {
        newTitle.push(current);
      }
      return acc + current.length;
    }, 0);
    return `${newTitle.join(' ')} ...`
  }
  return title;
}

const renderRecipe = (recipe) => {
  // create a variable to store the markup.
  const markup = `
      <li>
          <a class="results__link" href="#${recipe.recipe_id}">
              <figure class="results__fig">
                  <img src="${recipe.image_url}" alt="${recipe.title}">
              </figure>
              <div class="results__data">
                  <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                  <p class="results__author">${recipe.publisher}</p>
              </div>
          </a>
      </li>
  `;

  // render the markup to the page.
  elements.searchResultList.insertAdjacentHTML('beforeend', markup);
}

// function to display the button.
const createButton = (page, type) => {
  return `
  <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
      <svg class="search__icon">
          <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
      </svg>
      <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
  </button>
  `
}

// function to render the page buttons.
const renderButtons = (page, numOfResults, resPerPage) => {

  const pages = Math.ceil(numOfResults / resPerPage);

  let button;

  if(page === 1 && pages > 1) {
    // button for next page.
    button = createButton(page, 'next');
  } else if(page < pages) {
    button = `
    ${createButton(page, 'prev')}
    ${createButton(page, 'next')}
    `;
  } else if (page === pages && pages > 1) {
    // button to previous page.
    button = createButton(page, 'prev');
  }

  elements.searchResPages.insertAdjacentHTML('afterbegin', button);
}

// function to loop through the recipes.
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  // for each recipe call the renderRecipe function and pass in the current element of the array.
  recipes.slice(start, end).forEach((current) => {
    renderRecipe(current);
  });

  // register buttons.
  renderButtons(page, recipes.length, resPerPage);
}