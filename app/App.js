import './styles/main.scss';
import api from './service';
import { Products } from './components';

class App {
  constructor() {
    document.addEventListener('DOMContentLoaded', this.onDOMLoaded);
  }
  mainContainerClass = 'product-container';
  loader = document.querySelector(`.${this.mainContainerClass}__loader`);
  isLoaderVisible = true;

  onDOMLoaded = () => {
    api.get('/products').then(data => {
      this.toogleLoader();
      const products = new Products(data.data, this);
      products.createProducList();

      const basket = document.querySelector('.header__basket');
      basket.style.opacity = 1;
    });
  };

  toogleLoader = () => {
    if (!this.isLoaderVisible) {
      this.loader.classList.remove(
        `${this.mainContainerClass}__loader--hidden`
      );
      document.body.classList.add('disabled');
    } else {
      this.loader.classList.add(`${this.mainContainerClass}__loader--hidden`);
      document.body.classList.remove('disabled');
    }
    this.isLoaderVisible = !this.isLoaderVisible;
  };

  /**
   * Handles shift functionality
   */
  handleShiftButton = () => {};

  /**
   * Called when simple-keyboard input has changed
   */
  // onChange = input => {
  //   document.querySelector('.input').value = input;
  // }

  /**
   * Called when a simple-keyboard key is pressed
   */
  // onKeyPress = button => {
  //   console.log("Button pressed", button);
  //
  //     /**
  //      * Shift functionality
  //      */
  //     if(button === "{lock}" || button === "{shift}")
  //       this.handleShiftButton();
  // }
}

export default App;
