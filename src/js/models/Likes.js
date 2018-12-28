// Likes model.
export default class Likes {
  // constructor with a likes array.
  constructor() {
    this.likes = [];
  }
  // add like method accepts an id, title, author and an image.
  addLike(id, title, author, img) {
    // create a object to store the values.
    const like = {id, title, author, img};
    // push the object to the likes array.
    this.likes.push(like);
    // change data to local storage.
    this.persistData();
    // return the like.
    return like;
  }
  // method to delete a like.
  deleteLike(id) {
    // find the index of the passes id.
    const index = this.likes.findIndex(el => el.id === id);
    // remove the id.
    this.likes.splice(index, 1);
    // change data to local storage.
    this.persistData();
  }
  // this method returns true or false, if the recipe is liked or not.
  isLiked(id) {
    return this.likes.findIndex(el => el.id === id) !== -1;
  }

  // this method gets the number of likes.
  getNumberOfLikes() {
    return this.likes.length;
  }

  // method to store likes to local storage.
  persistData() {
    localStorage.setItem('likes', JSON.stringify(this.likes));
  }

  // method to get the likes from local storage.
  readStorage() {
    const storage = JSON.parse(localStorage.getItem('likes'));
    if(storage) {
      // if there is storage, then the likes is the result of the local storage.
      this.likes = storage;
    }
  }
}