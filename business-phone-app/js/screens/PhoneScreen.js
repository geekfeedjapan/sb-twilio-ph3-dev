// 電話画面
let phoneActiveTab = 'dial';
let dialNumber = '';

function renderPhoneScreen() {
  return `
    <div class="screen phone-screen">
      <header class="screen-header">
        <h1>電話</h1>
      </header>

      <div class="phone-tabs">
        <button class="phone-tab ${phoneActiveTab === 'dial' ? 'active' : ''}" onclick="setPhoneTab('dial')">ダイヤル</button>
        <button class="phone-tab ${phoneActiveTab === 'history' ? 'active' : ''}" onclick="setPhoneTab('history')">履歴</button>
        <button class="phone-tab ${phoneActiveTab === 'contacts' ? 'active' : ''}" onclick="setPhoneTab('contacts')">電話帳</button>
      </div>

      <div class="screen-content">
        ${phoneActiveTab === 'dial' ? renderDialPad() : ''}
        ${phoneActiveTab === 'history' ? renderCallHistory() : ''}
        ${phoneActiveTab === 'contacts' ? renderContacts() : ''}
      </div>
    </div>
  `;
}

function renderDialPad() {
  return `
    <div class="dial-pad-container">
      <div class="dial-display">
        <span class="dial-number">${dialNumber || '番号を入力'}</span>
      </div>
      <div class="dial-pad">
        ${['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(num => `
          <button class="dial-btn" onclick="handleDial('${num}')">${num}</button>
        `).join('')}
      </div>
      <div class="dial-actions">
        <button class="dial-delete" onclick="handleDialDelete()">
          ${getIcon('ChevronLeft')}
        </button>
        <button class="dial-call" onclick="handleDialCall()">
          ${getIcon('Phone')}
        </button>
      </div>
    </div>
  `;
}

function renderCallHistory() {
  return `
    <div class="call-history">
      ${mockCallHistory.map(call => `
        <div class="history-item" onclick="navigate('dial', { phone: '${call.name}', customer: mockCustomers.find(c => c.name === '${call.name}') })">
          <div class="call-icon ${call.type}">
            ${call.type === 'incoming' ? getIcon('PhoneIncoming') : ''}
            ${call.type === 'outgoing' ? getIcon('PhoneOutgoing') : ''}
            ${call.type === 'missed' ? getIcon('PhoneOff') : ''}
          </div>
          <div class="history-info">
            <span class="history-name">${call.name}</span>
            <span class="history-company">${call.company}</span>
          </div>
          <div class="history-meta">
            <span class="history-time">${call.time}</span>
            <span class="history-duration">${call.duration}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderContacts() {
  return `
    <div class="contacts-list">
      ${mockCustomers.map(customer => `
        <div class="contact-item" onclick="navigate('dial', { customer: mockCustomers.find(c => c.id === ${customer.id}) })">
          <div class="contact-avatar">${customer.name[0]}</div>
          <div class="contact-info">
            <span class="contact-name">${customer.name}</span>
            <span class="contact-phone">${customer.phone}</span>
          </div>
          <button class="contact-call" onclick="event.stopPropagation(); navigate('dial', { customer: mockCustomers.find(c => c.id === ${customer.id}) })">
            ${getIcon('Phone')}
          </button>
        </div>
      `).join('')}
    </div>
  `;
}

function setPhoneTab(tab) {
  phoneActiveTab = tab;
  render();
}

function handleDial(num) {
  dialNumber += num;
  render();
}

function handleDialDelete() {
  dialNumber = dialNumber.slice(0, -1);
  render();
}

function handleDialCall() {
  if (dialNumber) {
    navigate('dial', { phone: dialNumber });
    dialNumber = '';
  }
}
