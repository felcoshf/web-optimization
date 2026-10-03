(function () {
  'use strict';

  var ME = {
    name: 'Иван Иванов',
    initials: 'ИМ',
    avatarClass: ''
  };
//   var PEER = {
//     name: 'Анна Смирнова',
//     initials: 'АС',
//     avatarClass: 'avatar--g2',
//     autoReply: [
//       'Понял, спасибо!',
//       'Согласен 👍',
//       'Давай так и сделаем.',
//       'Интересная мысль, обсудим?',
//       'Ок, завтра посмотрю подробнее.',
//       'Хорошо, договорились!'
//     ]
//   };

  var messagesEl  = document.getElementById('messages');
  var formEl      = document.getElementById('composer');
  var inputEl     = document.getElementById('composer-input');
  var sendBtn     = document.getElementById('composer-send');
  var peerStatus  = document.querySelector('.chat__peer-status');

  if (!messagesEl || !formEl || !inputEl) return;

  function nowTime() {
    var d = new Date();
    var h = String(d.getHours()).padStart(2, '0');
    var m = String(d.getMinutes()).padStart(2, '0');
    return h + ':' + m;
  }

  function todayLabel() {
    var d = new Date();
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  }

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function ensureDayLabel() {
    var last = messagesEl.lastElementChild;
    if (!last || !last.classList.contains('day')) {
      var day = document.createElement('div');
      day.className = 'day';
      day.textContent = todayLabel();
      messagesEl.appendChild(day);
    }
  }

  function buildAvatar(side) {
    var span = document.createElement('span');
    span.className = 'avatar' + (side.avatarClass ? ' ' + side.avatarClass : '');
    span.textContent = side.initials;
    return span;
  }

  function appendMessage(text, isMine) {
    ensureDayLabel();

    var wrap = document.createElement('div');
    wrap.className = 'msg ' + (isMine ? 'msg--me' : 'msg--other');

    var side = isMine ? ME : PEER;
    wrap.appendChild(buildAvatar(side));

    var inner = document.createElement('div');

    var bubble = document.createElement('div');
    bubble.className = 'msg__bubble';
    bubble.textContent = text;

    var time = document.createElement('div');
    time.className = 'msg__time';
    time.textContent = nowTime();

    inner.appendChild(bubble);
    inner.appendChild(time);
    wrap.appendChild(inner);
    messagesEl.appendChild(wrap);

    scrollToBottom();
  }

  function peerAutoReply() {
    var original = peerStatus ? peerStatus.textContent : '';
    if (peerStatus) {
      peerStatus.textContent = 'печатает…';
      peerStatus.classList.add('is-online');
    }

    setTimeout(function () {
      if (peerStatus) {
        peerStatus.textContent = original || 'в сети';
      }
      var replies = PEER.autoReply;
      var text = replies[Math.floor(Math.random() * replies.length)];
      appendMessage(text, false);
    }, 1000 + Math.random() * 800);
  }

  function send() {
    var text = inputEl.value.trim();
    if (!text) return;

    appendMessage(text, true);
    inputEl.value = '';
    inputEl.focus();

    peerAutoReply();
  }

  formEl.addEventListener('submit', function (e) {
    e.preventDefault();
    send();
  });

  sendBtn.addEventListener('click', function (e) {
    e.preventDefault();
    send();
  });

  inputEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });

  scrollToBottom();
})();