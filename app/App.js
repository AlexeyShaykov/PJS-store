import './styles/main.scss';

import api from './service';

import { Products } from './components';

class App {
  constructor() {
    document.addEventListener('DOMContentLoaded', this.onDOMLoaded);
  }

  loader = document.querySelector('.product-container__loader');
  basketIcon = document.querySelector('.header__basket');
  isLoaderVisible = true;

  onDOMLoaded = () => {
    api.get('/products').then(({ data }) => {
      this.toogleLoader();
      const products = new Products(data, this);
      products.createProducList();

      this.basketIcon.style.opacity = 1;
    });
  };

  toogleLoader = () => {
    if (!this.isLoaderVisible) {
      this.loader.classList.remove('loader-hidden');
      document.body.classList.add('disabled');
    } else {
      this.loader.classList.add('loader-hidden');
      document.body.classList.remove('disabled');
    }
    this.isLoaderVisible = !this.isLoaderVisible;
  };
}

export default App;
