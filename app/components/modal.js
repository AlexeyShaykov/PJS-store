class Modal {
  constructor() {
    this.modal = document.getElementById('modal-demo');
    this.title = this.modal.querySelector('.modal-title');
    this.closeModal = this.modal.querySelector('.close-modal');
    this.closeModal.addEventListener('click', () => {
      this.modal.classList.remove('visible');
    });
  }
  showModal = (header, html) => {
    this.title.innerHTML = header;
    const body = this.modal.querySelector('.modal-content');
    body.innerHTML = html;
    this.modal.classList.toggle('visible');
  };
}

export default Modal;
