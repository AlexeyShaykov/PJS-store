class Basket {
  constructor(products, modal) {
    this.products = products;
    this.modal = modal;
  }
  basketClass = 'header__basket__quantity';
  total = 0;
  produstInBasket = {};

  addToBasket = item => {
    console.log('caught ', item);
    if (item.amount < item.maxPerPerson) {
      console.log(this.modal);
      this.showAlarm(item.productName);
      return;
    }
    if (
      this.produstInBasket[item.productName] &&
      this.produstInBasket[item.productName] === item.amount
    ) {
      console.log('caught full ', item.productName);
      this.showAlarm(item.productName);
      return;
    }
    this.produstInBasket[item.productName] =
      this.produstInBasket[item.productName] + item.maxPerPerson ||
      item.maxPerPerson;

    const basketCounter = document.querySelector(`.${this.basketClass}`);
    basketCounter.style.opacity = 1;
    this.total += item.maxPerPerson;
    basketCounter.innerHTML = this.total;
    console.log(this.produstInBasket);
  };

  showAlarm = itemName => {
    const html = `<span>${itemName} нельзя добавить</span>`;
    this.modal.showModal('Внимание ', html);
    // var html = "<div id='confirm-box'><h2 id='confirm-header'></h2>";
  };
}

export default Basket;
