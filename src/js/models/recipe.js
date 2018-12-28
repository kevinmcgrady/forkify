// model for the single recipe.
// import axios.
import axios from 'axios';
// import the config settimgs.
import {key, proxy} from "../config";

// create a class for the single recipe.
export default class Recipe {
  constructor(id) {
    this.id = id
  }
  // create an async function to await for the results.
  async getRecipe() {
    try {
      // define the result and await the result from the api.
      const res = await axios(`${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`);
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.image = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch(error) {
      console.log(error);
    }
  }
  // function to calculate the time the recipe will take to complete.
  calcTime() {
    const numOfIngredients = this.ingredients.length;
    const periods = Math.ceil(numOfIngredients / 3);
    this.time = periods + 15;
  }

  // function to calculate the servings for each recipe.
  calcServings() {
    this.servings = 4;
  }

  parseIngredients() {
    const unitsLong = ['tablespoons', 'tablespoon', 'ounce', 'ounces', 'teaspoon', 'teaspoons', 'cups', 'pounds'];
    const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
    const units = [...unitsShort, 'kg', 'g'];

    const newIngredients = this.ingredients.map((element) => {
      // 1. uniform units.
      let ingredient = element.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });
      // 2. remove ().
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
      // 3. parse ingr into count, unit and ingr.
      const arrIng = ingredient.split(' ');
      const unitIndex = arrIng.findIndex((element2) => {
        return units.includes(element2)
      });

      let objIng;

      if(unitIndex > -1) {
        // there is a unit.
        const arrCount = arrIng.slice(0, unitIndex);
        let count;
        if(arrCount.length === 1) {
          count = eval(arrIng[0].replace('-', '+'));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join('+'));
        }

        objIng = {
          count: count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(' ')
        }

      } else if(parseInt(arrIng[0], 10)) {
        // no unit, but still a number.
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: '',
          ingredient: arrIng.slice(1).join(' ')
        }
      } else if(unitIndex === -1) {
        // no unit and no number.
        objIng = {
          count: 1,
          unit: '',
          ingredient: ingredient
        }
      }
      return objIng;
    })

    this.ingredients = newIngredients;
  }
  // method to update the servings for each recipe.
  updateServings(type) {
    // servings.
    const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

    // Ingredients
    this.ingredients.forEach(ing => {
      ing.count = ing.count * (newServings / this.servings);
    });

    this.servings = newServings;
  }
}