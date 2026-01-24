// 着信画面
function renderIncomingCallScreen(customer) {
  return `
    <div class="screen incoming-call-screen">
      <div class="incoming-content">
        <span class="incoming-label">着信中...</span>
        <div class="incoming-avatar">${customer?.name?.[0] || '?'}</div>
        <h2>${customer?.name || '不明な発信者'}</h2>
        ${customer?.company ? `<p>${customer.company}</p>` : ''}
        ${customer?.phone ? `<p class="incoming-phone">${customer.phone}</p>` : ''}

        ${customer ? `
          <div class="incoming-crm-preview">
            <div class="crm-row">
              <span>商談金額</span>
              <span>${customer.amount}</span>
            </div>
            ${customer.verified ? `
              <div class="crm-verified">
                ${getIcon('Shield')} 本人確認済み
              </div>
            ` : ''}
          </div>
        ` : ''}

        <div class="incoming-actions">
          <button class="decline-btn" onclick="declineCall()">
            ${getIcon('PhoneOff')}
          </button>
          <button class="answer-btn" onclick="answerCall()">
            ${getIcon('Phone')}
          </button>
        </div>
      </div>
    </div>
  `;
}
