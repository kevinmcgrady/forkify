import uniqid from 'uniqid';
// model for the shopping list.
export default class List {
  constructor() {
    this.items = [];
  }

  // method to add new item.
  additem(count, unit, ingredient) {
    const item = {
      id: uniqid(),
      count: count,
      unit: unit,
      ingredient: ingredient
    }

    this.items.push(item);
    return item;
  }

  // method to delete an item.
  deleteItem(id) {
    const index = this.items.findIndex(el => el.id === id);
    this.items.splice(index, 1);
  }

  // update count.
  updateCount(id, newCount) {
    this.items.find(el => el.id === id).count = newCount;
  }
}