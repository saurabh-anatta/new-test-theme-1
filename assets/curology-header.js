import { Component } from '@theme/component';
import { ThemeEvents } from '@theme/events';

/**
 * @typedef {Object} CurologyHeaderRefs
 * @property {HTMLDialogElement} mobileDrawer - Mobile navigation drawer
 * @property {HTMLButtonElement} drawerOpen - Hamburger menu button
 * @property {HTMLButtonElement} drawerClose - Close drawer button
 * @property {HTMLElement} cartBadge - Cart item count badge
 * @property {HTMLElement[]} dropdownToggle - Desktop dropdown toggle buttons
 */

/** @extends {Component<CurologyHeaderRefs>} */
class CurologyHeaderComponent extends Component {
  #abortController = new AbortController();

  connectedCallback() {
    super.connectedCallback();

    const signal = this.#abortController.signal;

    document.addEventListener(ThemeEvents.cartUpdate, this.#handleCartUpdate.bind(this), { signal });

    if (this.dataset.enableSticky === 'true') {
      this.#initSticky();
    }

    this.#updateHeaderHeight();
    this.#initDropdowns();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#abortController.abort();
  }

  /** Open the mobile drawer */
  handleDrawerOpen() {
    if (!this.refs.mobileDrawer) return;
    this.refs.mobileDrawer.showModal();
    document.body.style.overflow = 'hidden';
  }

  /** Close the mobile drawer */
  handleDrawerClose() {
    if (!this.refs.mobileDrawer) return;
    this.refs.mobileDrawer.close();
    document.body.style.overflow = '';
  }

  /** Toggle mobile accordion sub-menus */
  handleMobileToggle(event) {
    const button = event.currentTarget;
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    const content = document.getElementById(button.getAttribute('aria-controls'));

    if (!content) return;

    button.setAttribute('aria-expanded', String(!isExpanded));
    content.hidden = isExpanded;
  }

  #initSticky() {
    let lastScrollY = 0;
    const signal = this.#abortController.signal;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      const headerHeight = this.offsetHeight;

      if (currentScrollY > headerHeight) {
        this.classList.add('curology-header--sticky');
      } else {
        this.classList.remove('curology-header--sticky');
      }

      lastScrollY = currentScrollY;
    }, { signal, passive: true });
  }

  #updateHeaderHeight() {
    const height = this.offsetHeight;
    document.documentElement.style.setProperty('--header-height', `${height}px`);
  }

  #initDropdowns() {
    const signal = this.#abortController.signal;

    document.addEventListener('click', (event) => {
      const openDropdowns = this.querySelectorAll('.curology-header__dropdown[aria-hidden="false"]');

      for (const dropdown of openDropdowns) {
        const toggle = this.querySelector(`[aria-controls="${dropdown.id}"]`);
        if (toggle && !toggle.contains(event.target) && !dropdown.contains(event.target)) {
          dropdown.setAttribute('aria-hidden', 'true');
          toggle.setAttribute('aria-expanded', 'false');
        }
      }
    }, { signal });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        const openDropdowns = this.querySelectorAll('.curology-header__dropdown[aria-hidden="false"]');

        for (const dropdown of openDropdowns) {
          const toggle = this.querySelector(`[aria-controls="${dropdown.id}"]`);
          dropdown.setAttribute('aria-hidden', 'true');

          if (toggle) {
            toggle.setAttribute('aria-expanded', 'false');
            toggle.focus();
          }
        }

        if (this.refs.mobileDrawer?.open) {
          this.handleDrawerClose();
          this.refs.drawerOpen?.focus();
        }
      }
    }, { signal });
  }

  /** Toggle a desktop dropdown panel */
  handleDropdownToggle(event) {
    const button = event.currentTarget;
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    const dropdownId = button.getAttribute('aria-controls');
    const dropdown = document.getElementById(dropdownId);

    if (!dropdown) return;

    // Close other open dropdowns
    const allDropdowns = this.querySelectorAll('.curology-header__dropdown');

    for (const dd of allDropdowns) {
      if (dd.id !== dropdownId) {
        dd.setAttribute('aria-hidden', 'true');
        const otherToggle = this.querySelector(`[aria-controls="${dd.id}"]`);
        if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
      }
    }

    button.setAttribute('aria-expanded', String(!isExpanded));
    dropdown.setAttribute('aria-hidden', String(isExpanded));
  }

  /**
   * @param {CustomEvent} event
   */
  async #handleCartUpdate(event) {
    try {
      const response = await fetch(`${window.Shopify?.routes?.root || '/'}cart.js`, {
        headers: { 'Accept': 'application/json' },
      });
      const cart = await response.json();

      if (this.refs.cartBadge) {
        const count = cart.item_count || 0;
        this.refs.cartBadge.textContent = String(count);
        this.refs.cartBadge.closest('.curology-header__cart-badge')?.toggleAttribute('hidden', count === 0);
      }
    } catch (error) {
      // Silently fail — badge will retain previous count
    }
  }
}

customElements.define('curology-header-component', CurologyHeaderComponent);
