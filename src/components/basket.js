import api from '../service';

class Basket {
  constructor(products, modal) {
    this.products = products;
    this.modal = modal;

    this.hb = '.header__basket';
    // header - icon basket
    this.headerBasketIcon = document.querySelector(this.hb);
    this.headerBasketIcon.addEventListener('click', this.showBasketModal);

    // header - icon quantity
    this.headerBasketQuantity = document.querySelector(`${this.hb}__quantity`);

    // header popup

    this.hpp = '.basket-content';
    // header popup content
    this.headerPopupConten = document.querySelector(this.hpp);
    // header popup counter
    this.headerPopupCounter = document.querySelector(
      `${this.hpp}__goods__counter`
    );
    // header popup total money
    this.headerPopupSumm = document.querySelector(
      `${this.hpp}__goods__total-price`
    );
    // header popup btn
    this.headerPopupBtn = document.querySelector(`${this.hpp}__btn`);
    this.headerPopupBtn.addEventListener('click', this.showBasketModal);

    this.loader = document.querySelector('.modal-loading');
  }

  total = 0;
  totalAmmount = 0;
  produstInBasket = {};
  isLoaderVisible = false;

  addToBasket = (item, count) => {
    const currentProduct = this.produstInBasket[item.productName];

    if (currentProduct && currentProduct + count > item.amount) {
      this.showAlarm(item.productName);
      return;
    }

    this.produstInBasket[item.productName] = currentProduct + count || count;

    this.total += count;
    this.totalAmmount += count * item.price;

    this.changeHeader();
  };

  showAlarm = itemName => {
    const html = `<span>${itemName} нельзя добавить</span>`;
    this.modal.showModal('Внимание ', html);
  };

  changeHeader = () => {
    this.headerBasketQuantity.innerHTML = this.total;

    if (this.total === 0) {
      this.headerBasketQuantity.style.opacity = 0;
      this.headerBasketIcon.classList.add('empty');
      return;
    }

    this.headerBasketQuantity.style.opacity = 1;
    this.headerBasketIcon.classList.remove('empty');

    this.changeHeaderPopup();
  };

  changeHeaderPopup = () => {
    this.headerPopupCounter.innerHTML = `товаров - ${this.total}`;
    this.headerPopupSumm.innerHTML = `${this.totalAmmount} рублей`;
  };

  showBasketModal = () => {
    if (Object.keys(this.produstInBasket).length === 0) return;

    this.headerPopupConten.style.display = 'none';

    let html = '';
    let index = 0;

    for (const item in this.produstInBasket) {
      const { price } = this.findByName(item);
      html += `<div class="basket-product">
      <div class="basket-product__amout">${this.produstInBasket[item]}</div>
      <div class="basket-product__big name">${item}</div>
      <div class="basket-product__big">за ${price} рублей</div>
      <div class="basket-product__small hovered add">+</div>
      <div class="basket-product__small hovered remove">-</div>
      <div class="clear hovered">удалить всё</div>
      </div>`;
    }

    const goods = this.declOfNum(this.total);
    const modalHeader = `В корзине ${this.total} ${goods} на сумму ${
      this.totalAmmount
    }`;

    this.modal.showModal(modalHeader, html).then(() => {
      const productsBasket = document.querySelectorAll('.basket-product');
      Array.from(productsBasket).forEach(item => {
        item.addEventListener('click', e =>
          this.handleClickCurrentProduct(e, item)
        );
      });
    });
  };

  handleClickCurrentProduct = (e, product) => {
    const { target } = e;
    const name = product.querySelector('.name').innerHTML;
    const currentValue = this.produstInBasket[name];
    const DOMamount = product.querySelector('.basket-product__amout');
    const { amount, price } = this.findByName(name);

    if (target.className.includes('add')) {
      if (currentValue === amount) return;

      this.changeBasketValues(name, price)
        .then(() => {
          DOMamount.innerHTML = this.produstInBasket[name];
        })
        .catch(e => console.log(e));
    } else if (target.className.includes('remove')) {
      if (currentValue === 1) return;

      this.changeBasketValues(name, price, 'remove')
        .then(() => {
          DOMamount.innerHTML = this.produstInBasket[name];
        })
        .catch(e => console.log(e));
    } else if (target.className.includes('clear')) {
      this.changeBasketValues(name, price, 'clear')
        .then(() => {
          this.modal.body.removeChild(product);
        })
        .catch(e => console.log(e));
    }
  };

  declOfNum = (number, titles = ['товар', 'товара', 'товаров']) => {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[
      number % 100 > 4 && number % 100 < 20
        ? 2
        : cases[number % 10 < 5 ? number % 10 : 5]
    ];
  };

  findByName = name => {
    return this.products.find(pr => pr.productName === name);
  };

  changeBasketValues = (name, price, option = 'add') => {
    this.toogleBasketLoading();
    return new Promise((resolve, reject) => {
      api
        .get('/actions')
        .then(() => {
          if (option === 'add') {
            this.totalAmmount += price;
            this.total += 1;
            this.produstInBasket[name] = this.produstInBasket[name] + 1;
          } else if (option === 'remove') {
            this.totalAmmount -= price;
            this.total -= 1;
            this.produstInBasket[name] = this.produstInBasket[name] - 1;
          } else {
            const value = this.produstInBasket[name];
            this.totalAmmount -= price * value;
            this.total -= value;
            delete this.produstInBasket[name];
          }

          const goods = this.declOfNum(this.total);
          this.modal.title.innerHTML = `В корзине ${
            this.total
          } ${goods} на сумму ${this.totalAmmount}`;

          this.changeHeader();
          resolve();
        })
        .catch(e => {
          alert('Ошибка. Что-то пошло не так');
          reject();
        })
        .finally(() => {
          this.toogleBasketLoading();
        });
    });
  };

  toogleBasketLoading = () => {
    if (!this.isLoaderVisible) {
      this.loader.classList.remove('loader-hidden');
      this.modal.modal.classList.add('disabled');
    } else {
      this.loader.classList.add('loader-hidden');
      this.modal.modal.classList.remove('disabled');
    }
    this.isLoaderVisible = !this.isLoaderVisible;
  };
}

export default Basket;
