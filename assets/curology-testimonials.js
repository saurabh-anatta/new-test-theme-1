class CurologyTestimonialsCarousel extends HTMLElement {
  connectedCallback() {
    this.track = this.querySelector('.curology-testimonials__track');
    this.prevBtn = this.querySelector('[data-carousel-prev]');
    this.nextBtn = this.querySelector('[data-carousel-next]');

    if (!this.track || !this.prevBtn || !this.nextBtn) return;

    this.scrollAmount = 360; // card width (328) + gap (32)

    this.prevBtn.addEventListener('click', this.scrollPrev.bind(this));
    this.nextBtn.addEventListener('click', this.scrollNext.bind(this));
    this.track.addEventListener('scroll', this.updateArrowStates.bind(this));

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
}

customElements.define('curology-testimonials', CurologyTestimonialsCarousel);
