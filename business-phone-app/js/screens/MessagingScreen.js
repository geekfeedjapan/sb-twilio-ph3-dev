// メッセージング画面
let messagingChannel = 'line';

function renderMessagingScreen(customer) {
  const messages = [
    { id: 1, type: 'received', text: 'お世話になっております。見積書の件でご連絡しました。', time: '14:00' },
    { id: 2, type: 'sent', text: '見積書を添付いたします。ご確認お願いいたします。', time: '14:05' },
    { id: 3, type: 'received', text: 'ありがとうございます。確認いたします。', time: '14:10' },
  ];

  return `
    <div class="screen messaging-screen">
      <header class="screen-header with-back">
        <button class="back-btn" onclick="goBack()">${getIcon('ChevronLeft')}</button>
        <div class="header-info">
          <h1>${customer?.name || '顧客名'}</h1>
          <span class="header-subtitle">${customer?.company || ''}</span>
        </div>
        <button class="icon-btn">
          ${getIcon('Phone')}
        </button>
      </header>

      <div class="channel-selector">
        <button class="channel-btn ${messagingChannel === 'line' ? 'active' : ''}" onclick="setMessagingChannel('line')">LINE</button>
        <button class="channel-btn ${messagingChannel === 'sms' ? 'active' : ''}" onclick="setMessagingChannel('sms')">SMS</button>
      </div>

      <div class="messages-container">
        ${messages.map(msg => `
          <div class="message ${msg.type}">
            <div class="message-bubble">
              <p>${msg.text}</p>
              <span class="message-time">${msg.time}</span>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="message-input-container">
        <input type="text" placeholder="メッセージを入力...">
        <button class="send-btn">
          ${getIcon('Send')}
        </button>
      </div>
    </div>
  `;
}

function setMessagingChannel(channel) {
  messagingChannel = channel;
  render();
}
