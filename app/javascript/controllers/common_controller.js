import { Controller } from "stimulus"
import $ from 'jquery'

export default class extends Controller {
  static targets = [
                    "pwaPopup", "pwaUnderlay", "pwaHomeNavbar", "loader", "loaderUnderlay", "resourceTabs",
                    "tabsHolder", "resourcesHeader", "resourcesContent", "minHeightDiv", "switch", "switchPwa",
                    "tab"
                   ]

  connect() {
    if (window.innerWidth < 577) {
      if (navigator.standalone) {
        this.minHeightDivTarget.style.minHeight = `${window.innerHeight - 140}px`;
      } else {
        this.minHeightDivTarget.style.minHeight = `${window.innerHeight - 66}px`;
      }
    }
    if (navigator.standalone) {
      this.resourcesHeaderTargets.forEach((header) => { header.style.display = 'none' });
      // this.tabsHolderTarget.classList.add('pwa-resource-tabs');
      // this.resourcesContentTarget.style.marginTop = '51px'
      this.pwaHomeNavbarTarget.classList.remove('d-none');
    }
    if (this.hasPwaPopupTarget) {
      const pwaUnderlay = this.pwaUnderlayTarget
      const pwaPopup = this.pwaPopupTarget
      if (!navigator.standalone) {
        setTimeout(function() {
          pwaUnderlay.style.display = 'block';
          pwaPopup.style.display = 'flex';
          pwaUnderlay.style.top = 0;
          pwaUnderlay.style.opacity = 1;
          if (window.innerWidth > 576) {
            pwaPopup.style.top = 'calc(50vh - 275px)';
          } else {
            pwaPopup.style.top = `calc(50vh - ${ pwaPopup.offsetHeight / 2 }px`
          }
        }, 2000);
      }
    }
  }

  hide() {
    const underlay = this.pwaUnderlayTarget
    const pwaPopup = this.pwaPopupTarget
    this.pwaUnderlayTarget.style.opacity = 0
    this.pwaPopupTarget.style.top = '100vh'
    setTimeout(function() {
      underlay.style.display = 'none'
      pwaPopup.style.display = 'none'
    }, 300)
  }

  showLoader() {
    this.loaderTarget.style.display = 'inline-block';
    this.loaderUnderlayTarget.style.display = 'block';
  }

  switchTabs() {
    this.tabTargets.forEach((tab) => {
      tab.classList.remove('tab-active')
    })
    event.target.classList.add('tab-active')
    this.resourceTabsTargets.forEach((tab) => {
      if (event.currentTarget.dataset.type == tab.dataset.type) {
        tab.style.display = 'block'
        setTimeout(function() {
          tab.classList.add('resource-active')
        }, 1)
      } else {
        tab.classList.remove('resource-active')
        setTimeout(function() {
          tab.style.display = 'none'
        }, 200)
      }
    })
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
  }

  toggleDarkMode() {
    this.switchTarget.classList.toggle('switch-dark')
    setTimeout(function() {
      window.location.reload(true)
    }, 100)
  }

  toggleDarkModePwa() {
    this.switchPwaTarget.classList.toggle('switch-dark')
    this.loaderTarget.style.display = 'inline-block';
    this.loaderUnderlayTarget.style.display = 'block';
    setTimeout(function() {
      window.location.reload(true)
    }, 300)
  }
}
