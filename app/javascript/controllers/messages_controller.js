import { Controller } from "stimulus"
import Pusher from 'pusher-js';
import $ from 'jquery'

export default class extends Controller {
  static targets = ["container", "messages", "form", "input", "mobile"]

  connect() {
    if (this.hasMobileTarget) {
      if (navigator.standalone) {
        this.mobileTarget.style.height = `${window.innerHeight - 140}px`
      } else {
        this.mobileTarget.style.height = `${window.innerHeight - 66}px`
      }
    }
    if (this.hasContainerTarget && this.hasMessagesTarget) {
      let container = this.containerTarget
      let messages = this.messagesTarget
      messages.scrollTop = messages.scrollHeight;
      let key = this.containerTarget.dataset.key
      let currentUser = this.containerTarget.dataset.currentUser
      let cluster = this.containerTarget.dataset.cluster
      let chatChannel = this.containerTarget.dataset.channel
      let pusher = new Pusher(key, {
        cluster: cluster,
        forceTLS: true
      });
      let channel = pusher.subscribe(chatChannel);
      channel.bind('new-message', function(data) {
        if (data.user_id == currentUser) {
          return;
        }
        let newEntry = `
                        <div class="each-message py-1 justify-content-start">
                          <img src="https://res.cloudinary.com/${data.cloud}/image/upload/${data.avatar}" class="user-avatar" alt="user-avatar">
                          <div class="" style="max-width: 77%;">
                            <div class="message-body ml-2 speech-left">
                              ${data.body}
                            </div>
                            <p class="time-created tiny-text lighter mr-3 mb-0 text-right">now</p>
                          </div>
                        </div>
                        `
        messages.insertAdjacentHTML('beforeend', newEntry);
        let time = document.querySelectorAll('.time-created');
        if (time) {
          setTimeout(function() {
            time[time.length - 1].innerText = `${data.created_at}`;
          }, 10000)
        }
      });
    }
  }

  newMessage() {
    const messages = this.messagesTarget
    let [data, status, xhr] = event.detail;
    messages.insertAdjacentHTML('beforeend', xhr.response);
    this.formTarget.reset();
    $(messages).animate({ scrollTop: messages.scrollHeight }, 300);
  }

  updateMessageBox(event) {
    event.target.style.height = `1px`;
    event.target.style.height = `${event.target.scrollHeight}px`;
  }
}

// 1. SET HEIGHT OF MESSAGE BOX WHEN ITS PWA AND EXTRA BOTTOM BIT PWA
// 3. NOTIFICATIONS FOR NEW MESSAGE
