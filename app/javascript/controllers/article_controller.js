import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [
                   ]

  connect() {
    const quotes = document.querySelectorAll('blockquote')
    if (quotes) {
      quotes.forEach((quote) => {
        quote.insertAdjacentHTML('afterbegin', `<i class="fas fa-quote-left" style="color: #4D77B7"></i> `)
        quote.insertAdjacentHTML('beforeend', ` <i class="fas fa-quote-right" style="color: #4D77B7"></i>`)
      })
    }
  }
}
