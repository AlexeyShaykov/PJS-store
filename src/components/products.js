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

    productTitle.innerHTML = 'Имеющиеся товары: ';
    this.products.forEach(item => {
      productTitle.innerHTML += `${item['productName']} - ${item['amount']} `;

      const product = document.createElement('div');
      product.classList.add(`${this.produstClass}__product`);
      product.setAttribute('id', `product-id${item.id}`);

      const productAmount = document.createElement('div');
      productAmount.classList.add('product__amount');
      productAmount.innerHTML = `Осталось ${item['amount']}`;

      const productName = document.createElement('div');
      productName.classList.add('product__name');
      productName.innerHTML = `${item['productName']}`;

      const productPrice = document.createElement('div');
      productPrice.classList.add('product__price');
      productPrice.innerHTML = `за ${item['price']} рублей`;

      const productCount = document.createElement('input');
      productCount.classList.add('product__count');
      productCount.setAttribute('type', 'number');
      productCount.setAttribute('value', 1);
      productCount.setAttribute('min', 1);
      productCount.setAttribute('max', item['amount']);

      const productBtn = document.createElement('div');
      productBtn.classList.add('product__btn');
      productBtn.innerHTML = 'Добавить в корзину';
      productBtn.addEventListener(
        'click',
        () => this.handleProductBtnClick(item, productCount),
        false
      );

      product.appendChild(productAmount);
      product.appendChild(productName);
      product.appendChild(productPrice);
      product.appendChild(productBtn);
      product.appendChild(productCount);

      productList.appendChild(product);
    });
  };

  handleProductBtnClick = (item, productCount) => {
    const productCountValue = parseInt(productCount.value);

    if (
      productCountValue < 0 ||
      productCountValue > item.maxPerPerson ||
      productCountValue > item.amount
    ) {
      const html = `<span> ${item.productName} нельзя добавить</span>`;
      this.modal.showModal('Внимание ', html);

      if (productCountValue < 0) {
        productCount.value = 1;
      }

      if (productCountValue > item.amount) {
        productCount.value = item.amount;
      }

      return;
    }
    this.app.toogleLoader();
    api
      .get('/actions')
      .then(data => {
        this.basket.addToBasket(item, productCountValue);
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
