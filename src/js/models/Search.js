// import the axios libary from the node modules folder.
let axios = require('axios');
// import the congig settings.
import {key, proxy} from '../config';

// export the class from the model file.
export default class Search {
  constructor(query) {
    this.query = query;
  }

  // method to get the results.
  async getResults() {
    try {
      // define the result and await the result from the api.
      const result = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
      this.result = result.data.recipes;
    } catch(error) {
      console.log(error);
    }
  }
}


