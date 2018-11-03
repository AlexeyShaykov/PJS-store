import api from '../service';

import Basket from './basket';
import Modal from './modal';

class Products {
  constructor(products, app) {
    this.products = products;
    this.app = app;
    this.modal = new Modal();
    this.basket = new Basket(products, this.modal);
  }
  produstClass = 'products-list';

  createProducList = () => {
    const productList = document.querySelector(`.${this.produstClass}`);
    const productTitle = document.querySelector(`.${this.produstClass}__title`);
    const categories = {};
    productTitle.innerHTML = 'Имеющиеся товары: ';
    this.products.forEach(item => {
      productTitle.innerHTML += `${item['productName']} - ${item['amount']} `;

      const product = document.createElement('div');
      product.classList.add(`${this.produstClass}__product`);
      product.setAttribute('id', item.id);

      const productAmount = document.createElement('div');
      productAmount.classList.add('product__amount');
      productAmount.innerHTML = `Осталось ${item['amount']}`;

      const productName = document.createElement('div');
      productName.classList.add('product__name');
      productName.innerHTML = `${item['productName']}`;

      const productPrice = document.createElement('div');
      productPrice.classList.add('product__price');
      productPrice.innerHTML = `за ${item['price']} рублей`;

      const productBtn = document.createElement('div');
      productBtn.classList.add('product__btn');
      productBtn.innerHTML = 'Добавить в корзину';
      productBtn.addEventListener(
        'click',
        () => this.handleToBasketClick(item),
        false
      );

      product.appendChild(productAmount);
      product.appendChild(productName);
      product.appendChild(productPrice);
      product.appendChild(productBtn);

      productList.appendChild(product);
      categories[item.productName] = categories[item.productName] + 1 || 1;
    });
  };

  handleToBasketClick = item => {
    this.app.toogleLoader();
    api
      .get('/actions')
      .then(data => {
        this.basket.addToBasket(item);
      })
      .catch(e => {
        this.modal.showModal('Ошибка ', '<span>Что-то пошло не так</span>');
      })
      .finally(() => {
        this.app.toogleLoader();
      });
  };
}

export default Products;
