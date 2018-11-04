class Modal {
  constructor() {
    this.modal = document.getElementById('modal');
    this.mc = '.modal-container';
    this.title = this.modal.querySelector(`${this.mc}__header__title`);

    this.closeModalIcon = this.modal.querySelector(
      `${this.mc}__header__close-modal`
    );
    this.closeModalIcon.addEventListener('click', this.closeModal);

    this.body = this.modal.querySelector(`${this.mc}__content`);
    this.basketConten = document.querySelector('.basket-content');
  }

  showModal = (header, html) => {
    return new Promise(resolve => {
      this.title.innerHTML = header;
      this.body.innerHTML = html;
      this.modal.classList.add('visible');
      resolve();
    });
  };

  closeModal = () => {
    this.basketConten.removeAttribute('style');
    this.modal.classList.remove('visible');
  };
}

export default Modal;
