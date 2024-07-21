import * as THREE from 'three';

export default class ModalController {
  constructor(modalId) {
      this.modal = document.getElementById(modalId);
      this.closeButton = this.modal.querySelector('.close');

      // Bind the event listeners
      this.closeButton.addEventListener('click', () => this.closeModal());
      window.addEventListener('click', (event) => this.outsideClick(event));

      // Open modal on start
      this.openModal();
  }

  openModal() {
      this.modal.style.display = "block";
  }

  closeModal() {
      this.modal.style.display = "none";
  }

  outsideClick(event) {
      if (event.target == this.modal) {
          this.closeModal();
      }
  }
}

