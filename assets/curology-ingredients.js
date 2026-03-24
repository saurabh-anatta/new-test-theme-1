class CurologyIngredients extends HTMLElement {
  connectedCallback() {
    this.track = this.querySelector('.curology-ingredients__track');
    this.prevBtn = this.querySelector('[data-carousel-prev]');
    this.nextBtn = this.querySelector('[data-carousel-next]');
    this.cards = this.querySelectorAll('.curology-ingredients__card');
    this.toggleButtons = this.querySelectorAll('[data-card-toggle]');

    if (!this.track || !this.prevBtn || !this.nextBtn) return;

    this.scrollAmount = 360; // card width (328) + gap (32)

    this.prevBtn.addEventListener('click', this.scrollPrev.bind(this));
    this.nextBtn.addEventListener('click', this.scrollNext.bind(this));
    this.track.addEventListener('scroll', this.updateArrowStates.bind(this));

    for (const btn of this.toggleButtons) {
      btn.addEventListener('click', this.handleToggle.bind(this));
    }

    this.updateArrowStates();
  }

  scrollPrev() {
    this.track.scrollBy({ left: -this.scrollAmount, behavior: 'smooth' });
  }

  scrollNext() {
    this.track.scrollBy({ left: this.scrollAmount, behavior: 'smooth' });
  }

  updateArrowStates() {
    const scrollLeft = this.track.scrollLeft;
    const maxScroll = this.track.scrollWidth - this.track.clientWidth;

    if (scrollLeft <= 0) {
      this.prevBtn.style.opacity = '0.6';
      this.prevBtn.setAttribute('aria-disabled', 'true');
    } else {
      this.prevBtn.style.opacity = '1';
      this.prevBtn.removeAttribute('aria-disabled');
    }

    if (scrollLeft >= maxScroll - 1) {
      this.nextBtn.style.opacity = '0.6';
      this.nextBtn.setAttribute('aria-disabled', 'true');
    } else {
      this.nextBtn.style.opacity = '1';
      this.nextBtn.removeAttribute('aria-disabled');
    }
  }

  handleToggle(event) {
    const button = event.currentTarget;
    const card = button.closest('.curology-ingredients__card');
    if (!card) return;

    const isExpanded = card.classList.contains('expanded');

    // Collapse all cards first (accordion behavior)
    for (const c of this.cards) {
      c.classList.remove('expanded');
    }

    // Toggle the clicked card
    if (!isExpanded) {
      card.classList.add('expanded');
    }
  }
}

customElements.define('curology-ingredients', CurologyIngredients);
